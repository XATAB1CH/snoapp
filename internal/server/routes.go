package server

import (
	"net/http"
	"os"
	"strings"

	"sno-webapp/internal/db"
	"sno-webapp/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	pg := db.New() // инициализация по BLUEPRINT_*

	r := gin.Default()

	// CORS
	allowed := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
	if len(allowed) == 0 || allowed[0] == "" {
		allowed = []string{"http://localhost:5173", "https://snoapp.ru", "https://separated-buf-mix-insulation.trycloudflare.com", "http://localhost:8080"} // cloudflared заменить
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowed,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	h := handlers.New(pg)
	api := r.Group("/api")
	{
		api.GET("/health", h.Health)
		api.GET("/auth", h.AuthHandler) // ?initData=...

		api.POST("/students", h.CreateStudent)
		api.GET("/students", h.ListStudents)
		api.GET("/students/:tg_id", h.GetStudent)
		api.PUT("/students/:tg_id", h.UpdateStudent)
		api.DELETE("/students/:tg_id", h.DeleteStudent)

		// api.POST("/news", h.CreateNews)
		api.GET("/news", h.ListNews)

		api.GET("/products", h.ListProducts)

		// Рейтинг по балансу
		api.GET("/leaderboard", h.Leaderboard)
	}
	return r
}
