-- 001_create_price_plan_table.sql
CREATE TABLE price_plan (
    id SERIAL PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    sms_price DECIMAL(10, 2) NOT NULL,
    call_price DECIMAL(10, 2) NOT NULL
);
