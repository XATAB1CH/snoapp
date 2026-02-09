package bot

import (
	"os"

	tg "gopkg.in/telebot.v4"
)

const (
	En = "en"
	Ru = "ru"
)

// Обработчик команды /start
func HandleStart(c tg.Context) error {
	// Проверка на необрабатываемые сообщения
	// Проверка на спам

	webAppUrl := os.Getenv("WEBAPP_URL")

	// Создание меню и веб-приложения
	menu := &tg.ReplyMarkup{ResizeKeyboard: true}
	webApp := &tg.WebApp{URL: webAppUrl}

	// Создание кнопок и текста
	var appButton tg.Btn
	var text string

	appButton = menu.WebApp("Запустить", webApp)
	text = "Официальное приложение СНО"

	// Добавление кнопок в меню
	menu.Inline(
		menu.Row(appButton),
	)

	return c.Send(text, menu)
}
