package main

import (
	"auction/internal/database"
	"auction/internal/handlers"
	"log"
	"net/http"
)

func main() {
	log.Println("DEBUG: InitDB")
	database.InitDB()
	mux := http.NewServeMux()

	mux.HandleFunc("/register", handlers.RegisterHandler)
	mux.HandleFunc("/login", handlers.LoginHandler)
	mux.HandleFunc("/lots", handlers.GetLotsHandlers)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Println("Сервер запущен на http://localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		log.Println("Error to started server")
	}
}
