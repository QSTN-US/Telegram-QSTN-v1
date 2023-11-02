use crate::{db::db_queries, errors::qstn_errors::QSTNError};
use actix_web::{web, Error, HttpResponse};
use deadpool_postgres::{Client, Pool};

// Async request handler function to get all users from the db
// Takes a connection pool as parameter
// This is mapped to the /users route when starting the server
pub async fn get_users(db_pool: web::Data<Pool>) -> Result<HttpResponse, Error> {
    // Try to retrieve a connection from the pool
    let client: Client = db_pool.get().await.map_err(QSTNError::PoolError)?;

    // Fetch users from the database
    let users = db_queries::get_users(&client).await?;

    // Return Ok result containing json with users if no Err was thrown earlier
    Ok(HttpResponse::Ok().json(users))
}
