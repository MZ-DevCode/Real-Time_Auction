package handlers

import (
	"auction/internal/database"
	"auction/internal/models"
	"context"
	"encoding/json"
	"net/http"
	"time"
)

func GetLotsHandlers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		query := "SELECT id, title, description, start_price, current_price, ends_at, status FROM lots"
		rows, err := database.DB.QueryContext(ctx, query)
		if err != nil {
			http.Error(w, "Ошибка при чтении базы данных", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var lots []models.Lot

		for rows.Next() {
			var (
				id           int64
				title        string
				description  string
				startPrice   float64
				currentPrice float64
				endsAt       time.Time
				status       string
			)

			err := rows.Scan(&id, &title, &description, &startPrice, &currentPrice, &endsAt, &status)
			if err != nil {
				http.Error(w, "Ошибка при чтении товаров из базы данных", http.StatusInternalServerError)
				return
			}

			lot := models.Lot{
				ID:           id,
				Title:        title,
				Description:  description,
				StartPrice:   startPrice,
				CurrentPrice: currentPrice,
				EndsAt:       endsAt,
				Status:       status,
			}

			lots = append(lots, lot)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(lots)

	default:
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
	}
}
