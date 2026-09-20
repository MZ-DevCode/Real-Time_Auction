package handlers

import "net/http"

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"name"`
	Password string `json:"name"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {

	}
}
