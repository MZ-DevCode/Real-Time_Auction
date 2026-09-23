package handlers

import (
	"auction/internal/database"
	"context"
	"net/http"
	"time"
)

func GetLotsHandlers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		var (
			id          int
			title       string
			description string
			price       float64
			time        int
			status      string
		)

		query := "SELECT id, title, description, price, time, status FROM lots"
		rows, err := database.DB.QueryContext(ctx, query).Scan(&id, &title, &description, &price, &time, &time, &status)
		if err != nil {
			http.Error(w, "Ошибка при читании базы данных", http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		for rows.Next() {

		}
	}
}
