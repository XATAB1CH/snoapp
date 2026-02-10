package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	botToken      string
	webappURL     string
	viteServerURL string
	serverPort    string

	dbName     string
	dbPassword string
	dbUsername string
	dbPort     string
	dbHost     string
	dbSchema   string
}

func MustLoad() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	Config := Config{
		botToken:      os.Getenv("BOT_TOKEN"),
		webappURL:     os.Getenv("WEBAPP_URL"),
		viteServerURL: os.Getenv("VITE_SERVER_URL"),
		serverPort:    os.Getenv("SERVER_PORT"),
		dbName:        os.Getenv("DB_NAME"),
		dbPassword:    os.Getenv("DB_PASSWORD"),
		dbUsername:    os.Getenv("DB_USERNAME"),
		dbPort:        os.Getenv("DB_PORT"),
		dbHost:        os.Getenv("DB_HOST"),
		dbSchema:      os.Getenv("DB_SCHEMA"),
	}

	return &Config, nil

}

func (cfg *Config) GetDbURL() string {
	return "postgres://" + cfg.dbUsername + ":" + cfg.dbPassword + "@" + cfg.dbHost + ":" + cfg.dbPort + "/" + cfg.dbName + "?sslmode=disable"
}
