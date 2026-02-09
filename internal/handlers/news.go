package handlers

import "github.com/gin-gonic/gin"

// ===== News CRUD =====

// func (h *HandlerManager) CreateNews(c *gin.Context) {

// }

func (h *HandlerManager) ListNews(c *gin.Context) {
	news, err := h.pg.GetAllNews(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, news)
}
