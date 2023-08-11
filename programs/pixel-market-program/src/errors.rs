use crate::*;

#[error]
#[derive(PartialEq)]
pub enum PixelMarketErrorCode {
    #[msg("Only admin")]
    OnlyAdmin,
    #[msg("Wrong Operator")]
    WrongOperator,
}
