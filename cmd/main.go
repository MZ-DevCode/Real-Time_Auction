package main

import (
	"log"
	"my-bot/Desktop/Projects/Real-Time_Auction/internal/database"
	"net/http"
)

func main() {
	database.InitDB()
	mux := http.NewServeMux

	mux.HandleFunc("/")

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Println("Сервер запущен на http://localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		log.Println("Error to started server")
	}
}
