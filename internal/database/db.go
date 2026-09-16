package database

import (
	"database/sql"
	"log"
)

var DB *sql.DB

func InitDB() {
	var err error

	DB, err = sql.Open("sqlite", "auction.db")
	if err != nil {
		log.Println("Ошибка открытия базы данных: ", err)
		return
	}

	if err = DB.Ping(); err != nil {
		log.Println("База данных не отвечает: ", err)
	}

	log.Println("Успешное подключение к базе данных")

	createTables()
}

func createTables() {
	users := `
	CREATE TABLE IF NOT EXIST users(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	balance REAL DEFAULT 0,
	created_at DATETIME
	);
	`
	_, err := DB.Exec(users)
	if err != nil {
		log.Println("Ошибка при создании таблицы users: ", err)
	}
}
