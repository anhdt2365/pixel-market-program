use crate::*;

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [CONFIG_SEED, config_account.admin.as_ref()],
        bump = config_account.bump[0],
    )]
    pub config_account: Account<'info, Config>,
    /// CHECK:
    #[account(
        mut,
        address = config_account.operator @ PixelMarketErrorCode::WrongOperator,
    )]
    pub operator_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<Buy>, id: String) -> Result<()> {
    let config = &mut ctx.accounts.config_account;
    let operator = &mut ctx.accounts.operator_account;

    // Transfer RENEC to asset's owner
    invoke(
        &system_instruction::transfer(&ctx.accounts.authority.key(), &operator.key(), config.price),
        &[
            ctx.accounts.authority.to_account_info(),
            operator.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // emit event to notify frontend
    emit!(BuyEvent { id });
    Ok(())
}

#[event]
pub struct BuyEvent {
    #[index]
    pub id: String,
}
