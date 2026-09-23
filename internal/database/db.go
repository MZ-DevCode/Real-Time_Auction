package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	log.Println("DEBUG: InitDB")
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
	CREATE TABLE IF NOT EXISTS users(
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

	lots := `
	CREATE TABLE IF NOT EXISTS lots(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	description TEXT,
	start_price REAL NOT NULL,
	current_price REAL NOT NULL,
	starts_at DATETIME NOT NULL,
	ends_at DATETIME NOT NULL,
	status TEXT NOT NULL DEFAULT 'upcoming',
	winner_id INTEGER,
	FOREIGN KEY (winner_id) REFERENCES users(id)
	);
	`
	_, err = DB.Exec(lots)
	if err != nil {
		log.Println("Ошибка при создании таблицы lots: ", err)
	}

	bids := `
	CREATE TABLE IF NOT EXISTS bids(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lot_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	amount REAL NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (lot_id) REFERENCES lots(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
	);
	`
	_, err = DB.Exec(bids)
	if err != nil {
		log.Println("Ошибка при создании таблицы bids: ", err)
	}
}
