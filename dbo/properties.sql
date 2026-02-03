CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
--property information
    address VARCHAR(255) NOT NULL,
    address_two VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
--values to calcualte profit and rental value
    bought_price DECIMAL(15,2),
    listed_price DECIMAL(15,2),
    loan_type VARCHAR(50),
    loan_percentage DECIMAL(5,2),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME,
    date_deleted DATETIME
);
