package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"sno-webapp/internal/db"
)

type Server struct {
	port int
	db   db.Postgres
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("SERVER_PORT"))
	NewServer := &Server{
		port: port,
		db:   db.New(),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}

func (s *Server) StartHTTPS() error {
	// Путь к сертификату и приватному ключу
	certFile := "../../ssl_keys/cert.pem"  // Путь к вашему сертификату
	keyFile := "../../ssl_keys/key.pem"   // Путь к вашему приватному ключу

	// Запуск HTTPS-сервера
	fmt.Printf("Starting HTTPS server on port %d...\n", s.port)
	return http.ListenAndServeTLS(fmt.Sprintf(":%d", s.port), certFile, keyFile, s.RegisterRoutes())
}
