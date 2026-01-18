package data

import (
	"fmt"
	"net/http"
)

type user struct {
	id               int
	firebase_user_id string
	team_id          int
}

func Users(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello there!\n")
}
