package handlers

import (
	"fmt"
	"sno-webapp/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ===== Health =====
func (h *HandlerManager) Health(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) }

// ===== Students CRUD =====
func (h *HandlerManager) CreateStudent(c *gin.Context) {
	var student models.Student

	if err := c.BindJSON(&student); err != nil {
		c.JSON(400, gin.H{"error": "bad json"})
		return
	}

	student.SetStartBalance()

	// fmt.Println(student)

	_, err := h.pg.CreateUser(c, &student)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"tg_id": student.TGID})
}

func (h *HandlerManager) GetStudent(c *gin.Context) {
	tg_id, _ := strconv.ParseInt(c.Param("tg_id"), 10, 64)
	fmt.Println(tg_id)

	student, err := h.pg.GetUserByTGID(c, tg_id)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, student)
}

func (h *HandlerManager) ListStudents(c *gin.Context) {
	var list []models.Student

	list, err := h.pg.GetAllUsers(c)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, list)
}

func (h *HandlerManager) UpdateStudent(c *gin.Context) {
	// tg_id, _ := strconv.ParseInt(c.Param("tg_id"), 10, 64)

	var student models.Student // Получаем данные студента из тела запроса
	if err := c.BindJSON(&student); err != nil {
		c.JSON(400, gin.H{"error": "bad json"})
		return
	}

	// Обновляем данные студента в БД
	if err := h.pg.UpdateUser(c, student); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"ok": true})
}

func (h *HandlerManager) DeleteStudent(c *gin.Context) {
	tg_id, _ := strconv.ParseInt(c.Param("tg_id"), 10, 64)

	if err := h.pg.DeleteUser(c, tg_id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
	}
	c.Status(204)
}
