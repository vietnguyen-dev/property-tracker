package data

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/vietnguyen-dev/property-tracker/utils"
)

type iProperty struct {
	Id                 int      `json:"id"`
	UserId             int      `json:"user_id"`
	Address            string   `json:"address"`
	AddressTwo         *string  `json:"address_two"`
	City               string   `json:"city"`
	State              string   `json:"state"`
	ZipCode            string   `json:"zip_code"`
	BoughtPrice        *float64 `json:"bought_price"`
	ListedPrice        *float64 `json:"listed_price"`
	PotentialSalePrice *float64 `json:"potential_sale_price"`
	LoanType           *string  `json:"loan_type"`
	LoanPercentage     *float64 `json:"loan_percentage"`
	PotentialProfit    *float64 `json:"potential_profit"`
	BaseRentalValue    *float64 `json:"base_rental_value"`
	DateCreated        string   `json:"date_created"`
	DateUpdated        *string  `json:"date_updated"`
}

type iCreateProperty struct {
	UserId             int      `json:"user_id"`
	Address            string   `json:"address"`
	AddressTwo         *string  `json:"address_two"`
	City               string   `json:"city"`
	State              string   `json:"state"`
	ZipCode            string   `json:"zip_code"`
	BoughtPrice        *float64 `json:"bought_price"`
	ListedPrice        *float64 `json:"listed_price"`
	PotentialSalePrice *float64 `json:"potential_sale_price"`
	LoanType           *string  `json:"loan_type"`
	LoanPercentage     *float64 `json:"loan_percentage"`
}

type iUpdateProperty struct {
	Id                 int      `json:"id"`
	Address            string   `json:"address"`
	AddressTwo         *string  `json:"address_two"`
	City               string   `json:"city"`
	State              string   `json:"state"`
	ZipCode            string   `json:"zip_code"`
	BoughtPrice        *float64 `json:"bought_price"`
	ListedPrice        *float64 `json:"listed_price"`
	PotentialSalePrice *float64 `json:"potential_sale_price"`
	LoanType           *string  `json:"loan_type"`
	LoanPercentage     *float64 `json:"loan_percentage"`
}

type iDeleteProperty struct {
	Id int `json:"id"`
}

func Properties(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getProperties(w, r)
	case http.MethodPost:
		createProperty(w, r)
	case http.MethodPut:
		updateProperty(w, r)
	case http.MethodDelete:
		deleteProperty(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProperties(w http.ResponseWriter, r *http.Request) {
	db := utils.MySql()
	defer db.Close()

	// Single property lookup by id
	propertyId := r.URL.Query().Get("id")
	if propertyId != "" {
		var p iProperty
		err := db.QueryRow("SELECT * FROM vw_properties WHERE id = ?;", propertyId).Scan(
			&p.Id, &p.UserId, &p.Address, &p.AddressTwo, &p.City, &p.State, &p.ZipCode,
			&p.BoughtPrice, &p.ListedPrice, &p.PotentialSalePrice, &p.LoanType, &p.LoanPercentage,
			&p.PotentialProfit, &p.BaseRentalValue, &p.DateCreated, &p.DateUpdated,
		)
		if err != nil {
			http.Error(w, "Property not found", http.StatusNotFound)
			fmt.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(p)
		return
	}

	userId := r.URL.Query().Get("user_id")
	if userId == "" {
		http.Error(w, "user_id or id is required", http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT * FROM vw_properties WHERE user_id = ?;", userId)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	defer rows.Close()

	var properties []iProperty
	for rows.Next() {
		var p iProperty
		if err := rows.Scan(
			&p.Id,
			&p.UserId,
			&p.Address,
			&p.AddressTwo,
			&p.City,
			&p.State,
			&p.ZipCode,
			&p.BoughtPrice,
			&p.ListedPrice,
			&p.PotentialSalePrice,
			&p.LoanType,
			&p.LoanPercentage,
			&p.PotentialProfit,
			&p.BaseRentalValue,
			&p.DateCreated,
			&p.DateUpdated,
		); err != nil {
			http.Error(w, "Data extraction error", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
		properties = append(properties, p)
	}

	jsonData, err := json.Marshal(properties)
	if err != nil {
		http.Error(w, "JSON serialization failed", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func createProperty(w http.ResponseWriter, r *http.Request) {
	var body iCreateProperty
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	if body.UserId == 0 || body.Address == "" || body.City == "" || body.State == "" || body.ZipCode == "" {
		http.Error(w, "user_id, address, city, state, and zip_code are required", http.StatusBadRequest)
		return
	}

	db := utils.MySql()
	defer db.Close()

	result, err := db.Exec(
		"INSERT INTO properties (user_id, address, address_two, city, state, zip_code, bought_price, listed_price, potential_sale_price, loan_type, loan_percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		body.UserId, body.Address, body.AddressTwo, body.City, body.State, body.ZipCode, body.BoughtPrice, body.ListedPrice, body.PotentialSalePrice, body.LoanType, body.LoanPercentage,
	)
	if err != nil {
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Failed to get inserted ID", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

func updateProperty(w http.ResponseWriter, r *http.Request) {
	var body iUpdateProperty
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	if body.Id == 0 {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	db := utils.MySql()
	defer db.Close()

	_, err := db.Exec(
		"UPDATE properties SET address = ?, address_two = ?, city = ?, state = ?, zip_code = ?, bought_price = ?, listed_price = ?, potential_sale_price = ?, loan_type = ?, loan_percentage = ?, date_updated = NOW() WHERE id = ? AND date_deleted IS NULL;",
		body.Address, body.AddressTwo, body.City, body.State, body.ZipCode, body.BoughtPrice, body.ListedPrice, body.PotentialSalePrice, body.LoanType, body.LoanPercentage, body.Id,
	)
	if err != nil {
		http.Error(w, "Database update error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func deleteProperty(w http.ResponseWriter, r *http.Request) {
	var body iDeleteProperty
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	if body.Id == 0 {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	db := utils.MySql()
	defer db.Close()

	_, err := db.Exec("UPDATE properties SET date_deleted = NOW() WHERE id = ? AND date_deleted IS NULL;", body.Id)
	if err != nil {
		http.Error(w, "Database delete error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}
