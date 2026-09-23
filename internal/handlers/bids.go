package handlers

import (
	"auction/internal/database"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
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
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		var (
			id            int
			current_price float64
			status        string
		)

		err = database.DB.QueryRowContext(ctx, "SELECT id FROM users WHERE username = ?", req.Username).Scan(&id)
		if err != nil {
			http.Error(w, "Пользователь не найден", http.StatusInternalServerError)
			return
		}

		err = database.DB.QueryRowContext(ctx, "SELECT current_price, status FROM lots WHERE id = ?", req.LotID).Scan(&current_price, &status)
		if err != nil {
			http.Error(w, "Лот не найден", http.StatusNotFound)
			return
		}

		if status != "active" {
			http.Error(w, "Лот уже завершен", http.StatusBadRequest)
			return
		}

		if req.Amount <= current_price {
			http.Error(w, "Ставка слишком мала", http.StatusBadRequest)
			return
		}

		tx, err := database.DB.BeginTx(ctx, nil)
		if err != nil {
			http.Error(w, "Ошибка начала транзакции", http.StatusInternalServerError)
			return
		}

		defer func() {
			if err := tx.Rollback(); err != nil && !errors.Is(err, sql.ErrTxDone) {
				log.Printf("Ошибка отката транзакции: %v", err)
			}
		}()

		_, err = tx.ExecContext(ctx, "UPDATE lots SET current_price = ? WHERE id = ?", req.Amount, req.LotID)
		if err != nil {
			http.Error(w, "Ошибка обновления цены", http.StatusInternalServerError)
			return
		}

		_, err = tx.ExecContext(ctx, "INSERT INTO bids (lot_id, user_id, amount) VALUES (?, ?, ?)", req.LotID, id, req.Amount)
		if err != nil {
			http.Error(w, "Ошибка сохранения ставки", http.StatusInternalServerError)
			return
		}

		if err = tx.Commit(); err != nil {
			http.Error(w, "Ошибка коммита", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		json.NewEncoder(w).Encode(map[string]string{
			"message": "Вход выполнен успешно",
		})
	default:
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
	}
}
