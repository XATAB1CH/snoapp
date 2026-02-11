package handlers

import (
	"fmt"
	"net/http"
	"sno-webapp/internal/tools"

	"github.com/gin-gonic/gin"
)

func (hm *HandlerManager) AuthHandler(c *gin.Context) {
	rowInitData := c.Query("initData")

	// Логирование initData для отладки
	fmt.Println("Received initData:", rowInitData)

	if rowInitData == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "initData is required",
		})
		return
	}

	// Верификация initData с обработкой ошибки
	result, err := tools.VerifyInitData(rowInitData)
	if err != nil {
		// Возвращаем ошибку в формате JSON
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": fmt.Sprintf("Authentication failed: %s", err.Error()),
		})
		return
	}

	// Возвращаем результат аутентификации в формате JSON
	c.JSON(http.StatusOK, result)
}
