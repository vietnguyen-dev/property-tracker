CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    address_two VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL, -- e.g., Residential, Commercial, Land
    status VARCHAR(50) NOT NULL, -- e.g., Available, Under Contract, Sold
    listing_price DECIMAL(15,2), -- Price listed for sale
    sale_price DECIMAL(15,2), -- Actual sale price
    rent_amount DECIMAL(15,2), -- Monthly rent if rented
    rent_type VARCHAR(50), -- e.g., Monthly, Yearly
    room_amount INT NOT NULL,
    bath_amount INT NOT NULL,
    size_sq_feet INT NOT NULL,
    lot_size_acres DECIMAL(10,2), -- Lot size in acres
    year_built YEAR,
    property_age INT, -- Calculated or stored age
    vacancy BOOLEAN NOT NULL DEFAULT FALSE,
    expected_value DECIMAL(15,2), -- Estimated current market value
    bought_price DECIMAL(15,2), -- Purchase price
    purchase_date DATE,
    loan TINYINT(1) NOT NULL DEFAULT 0,
    loan_type VARCHAR(50), -- e.g., FHA, VA, Conventional
    loan_percent DECIMAL(5,2), -- Loan to value percentage
    loan_amount DECIMAL(15,2),
    interest_rate DECIMAL(5,2),
    loan_term_months INT,
    closing_fees DECIMAL(15,2),
    ownership_type VARCHAR(50), -- e.g., LLC, Individual
    owner_name VARCHAR(255),
    owner_contact VARCHAR(255),
    notes TEXT, -- Additional notes about the property
    image_url VARCHAR(255), -- Link to property images
    property_tax DECIMAL(15,2),
    insurance_cost DECIMAL(15,2),
    HOA_fees DECIMAL(15,2),
    cash_flow DECIMAL(15,2), -- Estimated or actual cash flow
    cap_rate DECIMAL(5,2), -- Capitalization rate
    return_on_investment DECIMAL(5,2),
    rental_yield DECIMAL(5,2),
    is_active TINYINT(1) DEFAULT 1, -- Whether the property is currently active/investable
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME,
    date_deleted DATETIME
);
