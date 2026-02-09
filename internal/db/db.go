package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "github.com/joho/godotenv/autoload"
)

type Postgres struct {
	db *sql.DB
}

var (
	database = os.Getenv("DB_NAME")
	password = os.Getenv("DB_PASSWORD")
	username = os.Getenv("DB_USERNAME")
	port     = os.Getenv("DB_PORT")
	host     = os.Getenv("DB_HOST")
	schema   = os.Getenv("DB_SCHEMA")
)

// Подключаемя к базе данных
func New() Postgres {
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s", username, password, host, port, database, schema)
	fmt.Println(connStr)
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatal(err)
	}
	postgres := Postgres{
		db: db,
	}

	return postgres
}

// Возврат сырого соединения (для простых хендлеров)
func (p *Postgres) Conn() *sql.DB {
	return p.db
}

// Закрываем соединение с Бд
func (s *Postgres) Close() error {
	log.Printf("Disconnected from database: %s", database)
	return s.db.Close()
}
