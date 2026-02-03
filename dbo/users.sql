CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	firebase_id VARCHAR(255) NOT NULL,
    	date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    	date_updated DATETIME,
	date_deleted DATETIME
);

CREATE VIEW vw_users AS
SELECT id, firebase_id, date_created, date_updated FROM users WHERE date_deleted IS NULL;
