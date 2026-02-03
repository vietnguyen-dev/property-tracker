CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	firebase_id VARCHAR(255) NOT NULL,
    	date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    	date_updated DATETIME,
	date_deleted DATETIME
);

