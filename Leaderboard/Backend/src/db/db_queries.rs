use deadpool_postgres::Client;
use tokio_pg_mapper::FromTokioPostgresRow;

use crate::{errors::qstn_errors::QSTNError, models::user::User};

pub async fn get_users(client: &Client) -> Result<Vec<User>, QSTNError> {
    // Queries are read from a separate file
    let stmt = include_str!("../sql/get_users_submitted_surveys.sql");
    let stmt = client.prepare(stmt).await.unwrap();

    let results = client
        .query(&stmt, &[])
        .await?
        .iter()
        .map(|row| User::from_row_ref(row).unwrap())
        .collect::<Vec<User>>();

    Ok(results)
}
