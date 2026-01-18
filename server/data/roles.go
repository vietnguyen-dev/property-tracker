package data

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/vietnguyen-dev/property-tracker/utils"
)

type iRoles struct {
	Id   int    `json:"id"`
	Code string `json:"code"`
	Role string `json:"role"`
}

func Roles(w http.ResponseWriter, r *http.Request) {
	// connect to the database
	db := utils.MySql()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM roles;")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	// turn the data into proper json
	var roles []iRoles
	for rows.Next() {
		var role iRoles
		if err := rows.Scan(
			&role.Id,
			&role.Code,
			&role.Role,
		); err != nil {
			http.Error(w, "Data extraction error", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}
		roles = append(roles, role)
	}

	// return data
	jsonData, err := json.Marshal(roles)
	if err != nil {
		http.Error(w, "JSON serialization failed", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	// Set the content type and write the JSON data
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
