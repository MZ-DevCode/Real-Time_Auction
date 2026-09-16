package models

import "time"

type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	Balance      float64   `json:"balance"`
	CreatedAt    time.Time `json:"created_at"`
}
