package bot

import (
	"os"
	"time"

	tg "gopkg.in/telebot.v4"
)

type Bot struct {
	telegramBot *tg.Bot
}

// Инициализация бота
func New() (*Bot, error) {
	pref := tg.Settings{
		Poller:    &tg.LongPoller{Timeout: 10 * time.Second},
		ParseMode: tg.ModeMarkdown,
	}

	token := os.Getenv("BOT_TOKEN")

	pref.Token = token

	// Создание бота
	bot, err := tg.NewBot(pref)
	if err != nil {
		return nil, err
	}

	// Регистрация команды /start
	bot.Handle("/start", HandleStart)

	return &Bot{
		telegramBot: bot,
	}, nil
}

func (b *Bot) Run() {
	b.telegramBot.Start()
}

func (b *Bot) Stop() {
	b.telegramBot.Stop()
}
