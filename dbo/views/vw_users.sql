CREATE VIEW vw_users AS
SELECT id, firebase_id, date_created, date_updated FROM users WHERE date_deleted IS NULL;
