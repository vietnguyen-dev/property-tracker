CREATE VIEW vw_properties AS
SELECT
    id,
    user_id,
    address,
    address_two,
    city,
    state,
    zip_code,
    bought_price,
    listed_price,
    potential_sale_price,
    loan_type,
    loan_percentage,
    -- potential profit: sale price minus bought price minus loan cost
    (potential_sale_price - bought_price - (bought_price * loan_percentage / 100)) AS potential_profit,
    -- base rental value: 1% of bought price as monthly rent estimate
    (bought_price * 0.01) AS base_rental_value,
    date_created,
    date_updated
FROM properties
WHERE date_deleted IS NULL;
