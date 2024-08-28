    -- 003-create-phonebill-totals.sql
-- 003_update_price_plans.sql

-- Update existing price plans with new prices
UPDATE price_plan SET sms_price = 0.85, call_price = 1.35 WHERE plan_name = 'sms 101';
UPDATE price_plan SET sms_price = 1.10, call_price = 1.45 WHERE plan_name = 'call 101';
UPDATE price_plan SET sms_price = 1.20, call_price = 1.65 WHERE plan_name = 'call 201';

-- Insert new price plans
INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES ('sms saver', 0.60, 1.00);
INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES ('call saver', 0.70, 1.20);
