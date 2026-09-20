package handlers

import (
	"encoding/json"
	"net/http"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var req RegisterRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {

	}
}
