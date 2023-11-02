use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use tokio_pg_mapper_derive::PostgresMapper;

// User model containing all columns in the users database
// Optional fields wrapped in Option<_>
// Types are matched to the Postgres types by using chrono and serde
#[derive(Debug, Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table = "users")]
pub struct User {
    profile_id: i32,
    first_name: Option<String>,
    last_name: Option<String>,
    display_name: Option<String>,
    bio: Option<String>,
    email: String,
    avatar: Option<String>,
    account_type: String,
    account_status: String,
    pin_code: Option<i32>,
    wallet: Option<JsonValue>,
    surveys: Option<JsonValue>,
    surveys_taken: Option<JsonValue>,
    medias: Option<JsonValue>,
    owned_medias: Option<JsonValue>,
    referrals: Option<JsonValue>,
    inviter: Option<i32>,
    verified: Option<bool>,
    issuer: Option<String>,
    visibility: String,
    payment_method: Option<JsonValue>,
    created_at: NaiveDateTime,
    updated_at: Option<NaiveDateTime>,
    last_login_at: Option<NaiveDateTime>,
    category: Option<String>,
    location: Option<String>,
    gender: Option<String>,
    age: Option<i32>,
    business_name: Option<String>,
    iden3issuer: Option<String>,
}
