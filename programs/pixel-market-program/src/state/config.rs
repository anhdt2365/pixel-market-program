use crate::*;

#[account]
pub struct Config {
    pub bump: [u8; 1],
    pub admin: Pubkey,
    pub operator: Pubkey,
    pub price: u64,
}

impl Config {
    pub const LEN: usize = DISCRIMINATOR_LEN +
    U8_LEN +  // bump
    PUBKEY_LEN +  // admin
    PUBKEY_LEN +  // operator
    U64_LEN; // price

    pub fn init(
        &mut self,
        bump: u8,
        admin: Pubkey,
        operator: Pubkey,
        price: u64,
    ) -> Result<()> {
        self.bump = [bump];
        self.admin = admin;
        self.operator = operator;
        self.price = price;

        Ok(())
    }

    pub fn change_operator(&mut self, operator: Pubkey) -> Result<()> {
        self.operator = operator;

        Ok(())
    }

    pub fn update_price(&mut self, price: u64) -> Result<()> {
        self.price = price;

        Ok(())
    }
}
