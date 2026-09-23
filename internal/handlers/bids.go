package handlers

import (
	"auction/internal/database"
	"context"
	"encoding/json"
	"net/http"
	"time"
)

type PlaceBidRequest struct {
	LotID    int64   `json:"lot_id"`
	Amount   float64 `json:"amount"`
	Username string  `json:"username"`
}

func PlaceBidHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		var req PlaceBidRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
		}

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		var (
			id            int
			current_price int
			status        string
		)

		err = database.DB.QueryRowContext(ctx, "SELECT id FROM users WHERE username = ?", req.Username).Scan(&id)
		if err != nil {
			http.Error(w, "Ошибка хз ", http.StatusInternalServerError)
			return
		}

		err = database.DB.QueryRowContext(ctx, "SELECT current_price, status FROM lots WHERE id = ?", req.LotID).Scan(&current_price, &status)
		if err != nil {
			http.Error(w, "Ошибка хз ", http.StatusInternalServerError)
			return
		}
	}
}
