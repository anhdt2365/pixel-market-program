use crate::*;

#[derive(Accounts)]
pub struct ChangeOperator<'info> {
    #[account(
        address = config_account.admin @ PixelMarketErrorCode::OnlyAdmin,
    )]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [CONFIG_SEED, config_account.admin.as_ref()],
        bump = config_account.bump[0],
    )]
    pub config_account: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

pub fn exec(ctx: Context<ChangeOperator>, new_operator: Pubkey) -> Result<()> {
    let config = &mut ctx.accounts.config_account;
    config.change_operator(new_operator)
}
