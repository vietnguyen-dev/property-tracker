CREATE VIEW vw_property_metrics AS
SELECT
    p.id,
    p.address,
    p.city,
    p.state,
    p.zip_code,
    p.type,
    p.status,
    p.listing_price,
    p.sale_price,
    p.rent_amount,
    p.rent_type,
    p.size_sq_feet,
    p.lot_size_acres,
    p.year_built,
    p.purchase_date,
    p.bought_price,
    p.expected_value AS arv_value, -- ARV
    p.loan_amount,
    p.interest_rate,
    p.loan_term_months,
    p.closing_fees,
    p.property_tax,
    p.insurance_cost,
    p.HOA_fees,
    -- Calculated Fields:
    -- Example: ROI = (Annual Net Income) / (Total Investment)
    -- Assuming rent is monthly income, and expenses are property tax, insurance, HOA
    ((p.rent_amount * 12) - p.property_tax - p.insurance_cost - p.HOA_fees) /
    NULLIF(p.bought_price + p.closing_fees, 0) AS roi_percentage,
    -- Cap Rate = (Net Operating Income) / (Property Value)
    ((p.rent_amount * 12) - p.property_tax - p.insurance_cost - p.HOA_fees) /
    NULLIF(p.expected_value, 0) AS cap_rate,
    -- Cash Flow = Monthly Rent - Expenses
    (p.rent_amount - (p.property_tax / 12 + p.insurance_cost / 12 + p.HOA_fees / 12)) AS monthly_cash_flow,
    -- Return on Investment (ROI) over the property holding period
    CASE WHEN p.purchase_date IS NOT NULL THEN
        ((p.rent_amount * 12) * DATEDIFF(CURRENT_DATE, p.purchase_date) / 365) - (p.bought_price + p.closing_fees)
        ELSE NULL
    END AS total_return
FROM
    properties p;
