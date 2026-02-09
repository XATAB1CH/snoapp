package db

import (
	"context"
	"sno-webapp/internal/models"
)

func (pg *Postgres) GetAllNews(ctx context.Context) ([]models.News, error) {
	rows, err := pg.db.QueryContext(ctx, `
SELECT news_id, title, link, image_url FROM news ORDER BY news_id DESC
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.News
	for rows.Next() {
		news := models.News{}
		if err := rows.Scan(&news.NewsID, &news.Title, &news.Link, &news.ImageURL); err != nil {
			return nil, err
		}
		out = append(out, news)
	}
	return out, rows.Err()
}
