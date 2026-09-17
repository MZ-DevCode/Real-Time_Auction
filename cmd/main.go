package main

import (
	"auction/internal/database"
	"log"
	"net/http"
)

func main() {
	database.InitDB()
	mux := http.NewServeMux()

	mux.HandleFunc("/register", handlers.registerHandler)
	mux.HandleFunc("/login", handlers.loginHandler)

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Println("Сервер запущен на http://localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		log.Println("Error to started server")
	}
}
