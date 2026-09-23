package worker

import (
	"auction/internal/database"
	"context"
	"log"
	"time"
)

func StartLotCloser() {
	ticker := time.NewTicker(1 * time.Second)

	go func() {
		for range ticker.C {
			ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)

			_, err := database.DB.ExecContext(ctx, "UPDATE lots SET status='closed' WHERE status = 'active' AND ends_at <= ?", time.Now())
			if err != nil {
				log.Println("Ошибка обновления статуса: ", err)
			}
			cancel()
		}
	}()
}
