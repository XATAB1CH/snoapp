package handlers

import (
	"os"
	"sno-webapp/internal/db"
)

type HandlerManager struct {
	pg       db.Postgres
	botToken string
}

func New(pg db.Postgres) *HandlerManager {
	return &HandlerManager{pg: pg, botToken: os.Getenv("TELEGRAM_BOT_TOKEN")}
}
