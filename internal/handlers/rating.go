package handlers

import "github.com/gin-gonic/gin"

func (h *HandlerManager) Leaderboard(c *gin.Context) {
	list, err := h.pg.GetLeaderboard(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, list)
}
