package models

import "time"

type Lot struct {
	ID           int64     `json:"id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	StartPrice   float64   `json:"start_price"`
	CurrentPrice float64   `json:"current_price"`
	EndsAt       time.Time `json:"ends_at"`
	Status       string    `json:"status"`
	WinnerID     *int64    `json:"winner_id,omitempty"`
}
