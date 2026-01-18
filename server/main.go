package main

import (
	"fmt"
	"net/http"

	"github.com/vietnguyen-dev/property-tracker/data"
)

func main() {
	fmt.Println("Property Tracker on port 8080...")
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.HandleFunc("/api/users", data.Users)
	http.HandleFunc("/api/roles", data.Roles)
	http.ListenAndServe(":8080", nil)
}
