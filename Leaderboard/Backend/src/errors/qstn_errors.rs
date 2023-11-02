use actix_web::{HttpResponse, ResponseError};
use deadpool_postgres::PoolError;
use derive_more::{Display, From};
use tokio_pg_mapper::Error as PGMError;
use tokio_postgres::error::Error as PGError;

// Custom error handler
#[derive(Display, From, Debug)]
pub enum QSTNError {
    NotFound,
    // Postgres error
    PGError(PGError),
    // Postgres mapper error
    PGMError(PGMError),
    // Postgres connection pool error
    PoolError(PoolError),
}
impl std::error::Error for QSTNError {}

impl ResponseError for QSTNError {
    fn error_response(&self) -> HttpResponse {
        match *self {
            QSTNError::NotFound => HttpResponse::NotFound().finish(),
            QSTNError::PoolError(ref err) => {
                HttpResponse::InternalServerError().body(err.to_string())
            }
            _ => HttpResponse::InternalServerError().finish(),
        }
    }
}
