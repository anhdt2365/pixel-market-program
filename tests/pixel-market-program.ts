import * as anchor from "@project-serum/anchor";
import { BorshCoder, EventParser, Program, BN } from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
  SendTransactionError,
} from "@solana/web3.js";
import { PixelMarketProgram } from "../target/types/pixel_market_program";
import { expect } from "chai";
const CONFIG_SEED = "config";

const transferSol = async (
  connection: Connection,
  from: Keypair,
  to: PublicKey,
  amount: number,
) => {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: LAMPORTS_PER_SOL * amount,
    }),
  );
  await sendAndConfirmTransaction(connection, tx, [from]);
};

describe("pixel-market-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const program = anchor.workspace.PixelMarketProgram as Program<PixelMarketProgram>;
  const payer = (provider.wallet as anchor.Wallet).payer;
  const payerAccount = payer.publicKey;

  let configAccount: PublicKey;
  const operator: Keypair = anchor.web3.Keypair.generate();
  const alice: Keypair = anchor.web3.Keypair.generate();
  const bob: Keypair = anchor.web3.Keypair.generate();

  const price = 0.01 * LAMPORTS_PER_SOL;

  it("Is init resources", async () => {
    // Transfer 10 RENEC to Operator
    await transferSol(connection, payer, operator.publicKey, 10);
    // Transfer 10 RENEC to Alice
    await transferSol(connection, payer, alice.publicKey, 10);
    // Transfer 10 RENEC to Bob
    await transferSol(connection, payer, bob.publicKey, 10);
  });

  it("Is initialized", async () => {
    let bump: number;
    [configAccount, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED), payerAccount.toBuffer()],
      program.programId,
    );

    const instructions = [
      await program.methods
        .initialize(bump, operator.publicKey, new BN(price))
        .accounts({
          feePayer: payerAccount,
          authority: payerAccount,
          configAccount,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction(),
    ];

    const transaction = new Transaction().add(...instructions);
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.feePayer = payerAccount;
    const recoverTx = Transaction.from(transaction.serialize({ requireAllSignatures: false }));
    recoverTx.sign(payer);

    await connection.sendRawTransaction(recoverTx.serialize());

    // Ensure tx above is confirmed
    await transferSol(connection, payer, Keypair.generate().publicKey, 1);

    const configAccountInfo = await program.account.config.fetch(configAccount);
    expect(configAccountInfo.bump[0]).to.be.equal(bump);
    expect(configAccountInfo.admin.toString()).to.be.equal(payerAccount.toBase58());
    expect(configAccountInfo.operator.toString()).to.be.equal(operator.publicKey.toBase58());
    expect(configAccountInfo.price.toString()).to.be.equal(price.toString());
  });

  it("cannot change operator without admin role", async () => {
    try {
      await program.methods
        .changeOperator(
          alice.publicKey,
        )
        .accounts({
          authority: alice.publicKey,
          configAccount,
          systemProgram: SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      expect.fail("Should have failed");
    } catch (err) {
      expect(err).to.be.instanceOf(SendTransactionError);
      expect((err as SendTransactionError).message).to.equal(
        "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1770",
      );
    }
  });

  it("cannot update price without admin role", async () => {
    try {
      await program.methods
        .updatePrice(
          new BN(price).add(new BN(LAMPORTS_PER_SOL)),
        )
        .accounts({
          authority: alice.publicKey,
          configAccount,
          systemProgram: SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      expect.fail("Should have failed");
    } catch (err) {
      expect(err).to.be.instanceOf(SendTransactionError);
      expect((err as SendTransactionError).message).to.equal(
        "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1770",
      );
    }
  });

  it("successfully update price", async () => {
    let instructions = [
      await program.methods
        .updatePrice(
          new BN(price).add(new BN(LAMPORTS_PER_SOL)),
        )
        .accounts({
          authority: payerAccount,
          configAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
    ];

    let transaction = new Transaction().add(...instructions);
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.feePayer = payerAccount;
    let recoverTx = Transaction.from(transaction.serialize({ requireAllSignatures: false }));
    recoverTx.sign(payer);

    await connection.sendRawTransaction(recoverTx.serialize());

    // Ensure tx above is confirmed
    await transferSol(connection, payer, Keypair.generate().publicKey, 1);

    let configAccountInfo = await program.account.config.fetch(configAccount);
    expect(configAccountInfo.price.toString()).to.be.equal(new BN(price).add(new BN(LAMPORTS_PER_SOL)).toString());

    instructions = [
      await program.methods
        .updatePrice(new BN(price))
        .accounts({
          authority: payerAccount,
          configAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
    ];

    transaction = new Transaction().add(...instructions);
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.feePayer = payerAccount;
    recoverTx = Transaction.from(transaction.serialize({ requireAllSignatures: false }));
    recoverTx.sign(payer);

    await connection.sendRawTransaction(recoverTx.serialize());

    // Ensure tx above is confirmed
    await transferSol(connection, payer, Keypair.generate().publicKey, 1);

    configAccountInfo = await program.account.config.fetch(configAccount);
    expect(configAccountInfo.price.toString()).to.be.equal(new BN(price).toString());
  });

  it("successfully buy", async () => {
    // get balance of an RENEC account
    let balance = await connection.getBalance(alice.publicKey);
    expect(balance).to.be.equal(10 * LAMPORTS_PER_SOL);
    let operatorBalance = await connection.getBalance(operator.publicKey);
    expect(operatorBalance).to.be.equal(10 * LAMPORTS_PER_SOL);

    const instructions = [
      await program.methods
        .buy("#1")
        .accounts({
          authority: alice.publicKey,
          configAccount,
          operatorAccount: operator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction(),
    ];

    const transaction = new Transaction().add(...instructions);
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    transaction.feePayer = alice.publicKey;
    const recoverTx = Transaction.from(transaction.serialize({ requireAllSignatures: false }));
    recoverTx.sign(alice);

    const txHash = await connection.sendRawTransaction(recoverTx.serialize());

    // Ensure tx above is confirmed
    await transferSol(connection, payer, Keypair.generate().publicKey, 1);
    await transferSol(connection, payer, Keypair.generate().publicKey, 1);

    const txResult = await connection.getTransaction(txHash, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 1,
    });
    const eventParser = new EventParser(program.programId, new BorshCoder(program.idl));
    eventParser.parseLogs(txResult.meta.logMessages, (event) => {
      console.log(event);
      expect(event.name).to.be.equal("BuyEvent");
      expect(event.data.id).to.be.equal("#1");
    });
    // {
    //   data: { id: '#1' },
    //   name: 'Event'
    // }

    balance = await connection.getBalance(alice.publicKey);
    expect(balance).to.be.equal(new BN(10 * LAMPORTS_PER_SOL).sub(new BN(price)).toNumber());
    operatorBalance = await connection.getBalance(operator.publicKey);
    expect(operatorBalance).to.be.equal(new BN(10 * LAMPORTS_PER_SOL).add(new BN(price)).toNumber());
  });

  it("successfully transfer RENEC to asset owner", async () => {
    // get balance of an RENEC account
    let balance = await connection.getBalance(bob.publicKey);
    expect(balance).to.be.equal(10 * LAMPORTS_PER_SOL);
    let operatorBalance = await connection.getBalance(operator.publicKey);
    expect(operatorBalance).to.be.equal(new BN(10 * LAMPORTS_PER_SOL).add(new BN(price)).toNumber());

    // Ensure tx above is confirmed
    await transferSol(connection, operator, bob.publicKey, 0.01);

    balance = await connection.getBalance(bob.publicKey);
    expect(balance).to.be.equal(new BN(10 * LAMPORTS_PER_SOL).add(new BN(price)).toNumber());
    operatorBalance = await connection.getBalance(operator.publicKey);
    expect(operatorBalance).to.be.equal(new BN(10 * LAMPORTS_PER_SOL).toNumber());
  });
});
