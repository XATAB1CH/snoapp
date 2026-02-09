package tools

import (
	"errors"
	"log"
	"os"
	"time"

	"sno-webapp/internal/models"

	tgData "github.com/telegram-mini-apps/init-data-golang"
)

func VerifyInitData(rawInitData string) (*models.Student, error) {
	if rawInitData == "" {
		return nil, errors.New("initData is empty")
	}

	// Get the Telegram Bot Token from environment variables
	telegramBotToken := os.Getenv("BOT_TOKEN")
	if telegramBotToken == "" {
		return nil, errors.New("telegram bot token is not set")
	}

	// Define expiration time for initData (e.g., 24 hours)
	expiration := 24 * time.Hour

	if rawInitData != "" {
		// Validate the initData with the Telegram Bot Token and expiration time
		err := tgData.Validate(rawInitData, telegramBotToken, expiration)
		if err != nil {
			log.Println("Error validating initData:", err)
			return nil, errors.New("invalid initData")
		}

		// Parse the initData to get user data
		initDataParsed, err := tgData.Parse(rawInitData)
		if err != nil {
			log.Println("Error parsing initData:", err)
			return nil, errors.New("failed to parse initData")
		}

		student := models.CreateStudent(initDataParsed.User.ID, initDataParsed.User.Username)

		return student, nil
	}

	return nil, errors.New("invalid initData")
}
