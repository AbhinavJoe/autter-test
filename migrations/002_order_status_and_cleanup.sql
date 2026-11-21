-- add fulfilment info and tidy up users

ALTER TABLE orders ADD COLUMN shipping_address TEXT NOT NULL;
ALTER TABLE orders ADD COLUMN fulfilled_at TIMESTAMPTZ;
ALTER TABLE orders ALTER COLUMN total_cents TYPE BIGINT;

ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN display_name TO name;

UPDATE orders SET status = 'legacy';

CREATE INDEX orders_status_idx ON orders (status);
DROP INDEX orders_user_id_idx;

DROP TABLE IF EXISTS order_audit_log;
