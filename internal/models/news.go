package models

type News struct {
	NewsID   int64  `json:"news_id"`
	Title    string `json:"title"`
	Link     string `json:"link"`
	ImageURL string `json:"image_url"`
}

func CreateNews(news_id int64, title string, link string, image_url string) *News {
	return &News{
		NewsID:   news_id,
		Title:    title,
		Link:     link,
		ImageURL: image_url,
	}
}
