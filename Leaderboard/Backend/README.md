# Setup process

Install psql and run postgres docker image with provided environment variables in the root Readme.
In order to start the HTTP server you need to run the following command in the root of the project:

```bash

cargo run

```

Server is going to start by default on localhost:8080. Only one endpoint is served on /users and will return all the users who submitted a survey.
Environment variables are loaded from the .env file in the root directory.

# Testing process

There are only 2 tests in src/tests/users.rs which test the happy path (getting data from /users endpoint) and also a test for a custom error type.
The other error branch is not tested because I couldn't instantiate a PoolError. I think it can be mocked but I didn't have time to do that.

Tests can be run using

```bash

cargo test

```
The endpoint can also be manually tested by comparing the JSON response against the SQL query result obtained by running the query directly on the database which can be done by using plsql or by installing PGAdmin.