package handlers

import (
	"auction/internal/database"
	"context"
	"encoding/json"
	"net/http"
	"time"
)

type Request struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var req Request
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		_, err = database.DB.ExecContext(ctx, "INSERT INTO users(username, password_hash) VALUES (?, ?)", req.Username, req.Password)
		if err != nil {
			http.Error(w, "Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(map[string]string{
			"message": "Регистрация прошла успешно",
		})
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var req Request
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		_, err = database.DB.QueryContext(ctx, "SELECT password_hash FROM users WHERE username = ?", req.Username)
		if err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
	}
}
