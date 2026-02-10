package main

import (
	"fmt"
	"log"

	"sno-webapp/internal/config"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres" // Дрейвер миграций postgres
	_ "github.com/golang-migrate/migrate/v4/source/file"       // Драйвер для чтения sql файлов
	_ "github.com/lib/pq"                                      // Драйвер для PostgreSQL
)

func main() {
	cfg, err := config.MustLoad()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	connStr := cfg.GetDbURL()

	fmt.Println(connStr)
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	RunMigrations(connStr)
	fmt.Println("Migrations finished.")
}

func RunMigrations(dbURL string) {
	m, err := migrate.New(
		"file://migrations",
		dbURL,
	)
	if err != nil {
		log.Fatalf("Error initializing migration: %v", err)
	}

	fmt.Println("Running migrations...")
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			fmt.Println("No new migrations to apply.")
		} else {
			log.Fatalf("Error applying migrations: %v", err)
		}
	}

	fmt.Println("Migrations completed successfully.")
}
