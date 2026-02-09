package db

import (
	"context"
	"sno-webapp/internal/models"
)

func (pg *Postgres) GetLeaderboard(ctx context.Context) ([]models.Student, error) {
	rows, err := pg.db.QueryContext(ctx, `
		SELECT 
			tg_id,
			COALESCE(first_name, '')    AS first_name,
			COALESCE(last_name, '')     AS last_name,
			COALESCE(vk_url, '')        AS vk_url,
			COALESCE(profile_img, '')   AS profile_img,
			COALESCE(balance, 0)        AS balance
		FROM students
		ORDER BY balance DESC, tg_id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []models.Student
	for rows.Next() {
		var s models.Student
		// Подстраиваемся под твою модель Student (добавь недостающие поля в ней, если нужно)
		if err := rows.Scan(&s.TGID, &s.FirstName, &s.LastName, &s.VKURL, &s.ProfileImg, &s.Balance); err != nil {
			return nil, err
		}
		out = append(out, s)
	}
	return out, rows.Err()
}
