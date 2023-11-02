#[cfg(test)]
mod tests {
    use crate::config::postgres_config::PostgresConfig;
    use crate::errors::qstn_errors::QSTNError;
    use crate::handlers::users::get_users;
    use actix_web::{http::StatusCode, test, web, App, ResponseError};

    const PATH: &str = "/users";

    #[actix_web::test]
    async fn test_get_users_ok() {
        // Create a mock database pool
        let config = PostgresConfig::from_env();
        let pool = config.create_pool();

        // Set up our test server
        let mut app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .service(web::resource(PATH).route(web::get().to(get_users))),
        )
        .await;

        // Send a GET request to the /users endpoint
        let req = test::TestRequest::get().uri(PATH).to_request();
        let resp = test::call_service(&mut app, req).await;

        // Verify that the response status is OK
        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[test]
    async fn not_found_response() {
        let err = QSTNError::NotFound;
        let response = err.error_response();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    //tried to test the QSTNError::PoolError but couldn't instantiate PoolError
}
