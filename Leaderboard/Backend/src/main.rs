mod config;
mod db;
mod errors;
mod handlers;
mod models;

#[cfg(test)]
mod tests;

use crate::config::postgres_config::PostgresConfig;
use crate::handlers::users::get_users;
use actix_web::{web, App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load the config
    let config = PostgresConfig::from_env();

    // Create connection pool
    let pool = config.create_pool();

    // Start the http server on localhost:8080
    // The server address is hardcoded here but could be loaded from a config file as well
    let server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(web::resource("/users").route(web::get().to(get_users)))
    })
    .bind("localhost:8080")?
    .run();
    println!("Server running at http://localhost:8080/");

    server.await
}
