use deadpool_postgres::Pool;
use dotenv::dotenv;
use serde::Deserialize;
use std::env;
use tokio_postgres::NoTls;

#[derive(Debug, Default, Deserialize)]
pub struct PostgresConfig {
    user: String,
    host: String,
    password: String,
    database: String,
    port: u16,
}

impl PostgresConfig {
    pub fn from_env() -> Self {
        // Load values from .env
        dotenv().ok();

        // Retrieve values or provide default ones
        let user = env::var("PGUSER").unwrap_or_else(|_| "qstn".to_string());
        let host = env::var("PGHOST").unwrap_or_else(|_| "localhost".to_string());
        let password = env::var("PGPASSWORD").unwrap_or_else(|_| "YOURPASSWORD".to_string());
        let database = env::var("PGDATABASE").unwrap_or_else(|_| "qstndbv1".to_string());
        let port = env::var("PGPORT")
            .unwrap_or_else(|_| "5432".to_string())
            .parse::<u16>()
            .expect("Failed to parse PGPORT as u16");

        PostgresConfig {
            user,
            host,
            password,
            database,
            port,
        }
    }

    // This is needed in order to get the fields necessary to create a connection pool
    fn to_deadpool_config(&self) -> deadpool_postgres::Config {
        deadpool_postgres::Config {
            host: Some(self.host.clone()),
            user: Some(self.user.clone()),
            password: Some(self.password.clone()),
            dbname: Some(self.database.clone()),
            port: Some(self.port),
            ..Default::default()
        }
    }

    pub fn create_pool(&self) -> Pool {
        // Convert to deadpool config in order to create a pool
        let cfg = self.to_deadpool_config();
        cfg.create_pool(None, NoTls).unwrap()
    }
}
