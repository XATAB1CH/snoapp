package db

import (
	"context"
	"sno-webapp/internal/models"
)

func (pg *Postgres) GetAllProducts(ctx context.Context) ([]models.Product, error) {
	rows, err := pg.db.QueryContext(ctx, `
		SELECT product_id, name, price, image_url
		FROM products
		ORDER BY product_id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ProductID, &p.Name, &p.Price, &p.ImgURL); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}
