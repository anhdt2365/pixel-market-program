use crate::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds = [CONFIG_SEED, authority.key().as_ref()],
        bump,
        payer = fee_payer,
        space = Config::LEN,
    )]
    pub config_account: Account<'info, Config>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(
    ctx: Context<Initialize>,
    bump: u8,
    operator: Pubkey,
    price: u64,
) -> Result<()> {
    let config = &mut ctx.accounts.config_account;
    config.init(
        bump,
        *ctx.accounts.authority.key,
        operator,
        price,
    )
}