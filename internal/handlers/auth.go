package handlers

import (
	"fmt"
	"net/http"
	"sno-webapp/internal/tools"

	"github.com/gin-gonic/gin"
)

func (hm *HandlerManager) AuthHandler(c *gin.Context) {
	rowInitData := c.Query("initData")

	fmt.Println(rowInitData)

	if rowInitData == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "initData is required",
		})
	}
	// Аунтификация и обработка данных Init
	result, err := tools.VerifyInitData(rowInitData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication failed"})
		return
	}

	// fmt.Println("Всё ок!", result)

	c.JSON(http.StatusOK, result)
}
