package models

import "time"

type Bid struct {
	ID        int64     `json:"id"`
	LotID     int64     `json:"lot_id"`
	UserID    int64     `json:"user_id"`
	Username  string    `json:"username,omitempty"`
	Amount    float64   `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}
