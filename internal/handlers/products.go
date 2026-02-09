package handlers

import "github.com/gin-gonic/gin"

// ===== News CRUD =====

// func (h *HandlerManager) CreateProduct(c *gin.Context) {

// }

func (h *HandlerManager) ListProducts(c *gin.Context) {
	products, err := h.pg.GetAllProducts(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, products)
}
