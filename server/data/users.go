package data

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/vietnguyen-dev/property-tracker/utils"
)

type iUser struct {
	Id          int     `json:"id"`
	FirebaseId  string  `json:"firebase_id"`
	DateCreated string  `json:"date_created"`
	DateUpdated *string `json:"date_updated"`
}

type iCreateUser struct {
	FirebaseId string `json:"firebase_id"`
}

type iUpdateUser struct {
	Id         int    `json:"id"`
	FirebaseId string `json:"firebase_id"`
}

type iDeleteUser struct {
	Id int `json:"id"`
}

func Users(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getUsers(w, r)
	case http.MethodPost:
		createUser(w, r)
	case http.MethodPut:
		updateUser(w, r)
	case http.MethodDelete:
		deleteUser(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	db := utils.MySql()
	defer db.Close()

	firebaseId := r.URL.Query().Get("firebase_id")

	// If firebase_id is provided, return a single user
	if firebaseId != "" {
		var user iUser
		err := db.QueryRow("SELECT * FROM vw_users WHERE firebase_id = ?;", firebaseId).Scan(
			&user.Id,
			&user.FirebaseId,
			&user.DateCreated,
			&user.DateUpdated,
		)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			fmt.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
		return
	}

	rows, err := db.Query("SELECT * FROM vw_users;")
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	defer rows.Close()

	var users []iUser
	for rows.Next() {
		var user iUser
		if err := rows.Scan(
			&user.Id,
			&user.FirebaseId,
			&user.DateCreated,
			&user.DateUpdated,
		); err != nil {
			http.Error(w, "Data extraction error", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
		users = append(users, user)
	}

	jsonData, err := json.Marshal(users)
	if err != nil {
		http.Error(w, "JSON serialization failed", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var body iCreateUser
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	if body.FirebaseId == "" {
		http.Error(w, "firebase_id is required", http.StatusBadRequest)
		return
	}

	db := utils.MySql()
	defer db.Close()

	result, err := db.Exec("INSERT INTO users (firebase_id) VALUES (?);", body.FirebaseId)
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

func updateUser(w http.ResponseWriter, r *http.Request) {
	var body iUpdateUser
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println(err)
		return
	}

	if body.Id == 0 || body.FirebaseId == "" {
		http.Error(w, "id and firebase_id are required", http.StatusBadRequest)
		return
	}

	db := utils.MySql()
	defer db.Close()

	_, err := db.Exec("UPDATE users SET firebase_id = ?, date_updated = NOW() WHERE id = ? AND date_deleted IS NULL;", body.FirebaseId, body.Id)
	if err != nil {
		http.Error(w, "Database update error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	var body iDeleteUser
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

	_, err := db.Exec("UPDATE users SET date_deleted = NOW() WHERE id = ? AND date_deleted IS NULL;", body.Id)
	if err != nil {
		http.Error(w, "Database delete error", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}
