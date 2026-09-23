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

		query := "SELECT id, title, description, price, time, status FROM lots"
		rows, err := database.DB.QueryContext(ctx, query)
		if err != nil{
			http.Error(w, "Ошибка при читании базы данных", http.StatusInternalServerError)
			return
		}
	defer rows.Close()
	for rows.Next() {
		var (
			id          int
			title       string
			description string
			price       float64
			time        int
			status      string
		)

		var lots []models.Lot

		lots, err := rows.Scan(&id, &title, &description, &price, &time, &status)
		if err != nil {
			http.Error(w, "Ошибка при чтении товаров из базы данных", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(lots)
}
