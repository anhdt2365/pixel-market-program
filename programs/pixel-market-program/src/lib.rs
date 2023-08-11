use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("9L6oPAeVehsLcL8iAnakzhnb22UApVfbyf5JcS6BnEVL");

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

pub use instructions::*;
pub use state::*;
pub use errors::*;
pub use constants::*;

#[program]
pub mod pixel_market_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8, operator: Pubkey, price: u64) -> Result<()> {
        initialize::exec(ctx, bump, operator, price)
    }

    pub fn change_operator(ctx: Context<ChangeOperator>, new_operator: Pubkey) -> Result<()> {
        change_operator::exec(ctx, new_operator)
    }

    pub fn update_price(ctx: Context<UpdatePrice>, new_price: u64) -> Result<()> {
        update_price::exec(ctx, new_price)
    }

    pub fn buy(ctx: Context<Buy>, id: String) -> Result<()> {
        buy::exec(ctx, id)
    }
}
