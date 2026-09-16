package database

import (
	"database/sql"
	"log"
)

var db *sql.DB

func InitDB() {
	var err error

	db, err = sql.Open("sqlite", "auction.db")
	if err != nil {
		log.Println("Ошибка открытия базы данных: ", err)
		return
	}

	if err = db.Ping(); err != nil {
		log.Println("База данных не отвечает: ", err)
	}

	log.Println("Успешное подключение к базе данных")
}
