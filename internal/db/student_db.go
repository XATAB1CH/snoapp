package db

import (
	"context"
	"errors"
	"sno-webapp/internal/models"
)

// Создание студента
func (pg *Postgres) CreateUser(ctx context.Context, st *models.Student) (int64, error) {
	row := pg.db.QueryRowContext(ctx, `
INSERT INTO students (tg_id, tg_name, first_name, last_name, vk_url, profile_img, balance, total_balance)
VALUES ($1,$2,$3,$4,$5,$6, $7, $8) RETURNING tg_id
`, st.TGID, st.TGName, st.FirstName, st.LastName, st.VKURL, st.ProfileImg, st.Balance, st.TotalBalance)
	var tg_id int64
	if err := row.Scan(&tg_id); err != nil {
		return 0, err
	}
	return tg_id, nil
}

// Получение одного студента по tg_id телеграма
func (pg *Postgres) GetUserByTGID(ctx context.Context, TgId int64) (models.Student, error) {
	st := models.Student{}
	err := pg.db.QueryRowContext(ctx, `
SELECT tg_id, tg_name, first_name, last_name, vk_url, profile_img, created_at, updated_at, balance, total_balance
FROM students WHERE tg_id=$1
`, TgId).Scan(&st.TGID, &st.TGName, &st.FirstName, &st.LastName, &st.VKURL, &st.ProfileImg, &st.CreatedAt, &st.UpdatedAt, &st.Balance, &st.TotalBalance)
	if err != nil {
		return models.Student{}, err
	}
	return st, nil
}

// Получение списка всех студентов
func (pg *Postgres) GetAllUsers(ctx context.Context) ([]models.Student, error) {
	rows, err := pg.db.QueryContext(ctx, `
SELECT tg_id, tg_name, first_name, last_name, vk_url, profile_img, created_at, updated_at, balance, total_balance
FROM students ORDER BY tg_id DESC
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Student
	for rows.Next() {
		st := models.Student{}
		if err := rows.Scan(&st.TGID, &st.TGName, &st.FirstName, &st.LastName, &st.VKURL, &st.ProfileImg, &st.CreatedAt, &st.UpdatedAt, &st.Balance, &st.TotalBalance); err != nil {
			return nil, err
		}
		out = append(out, st)
	}
	return out, rows.Err()
}

// Обновление данных студента
func (pg *Postgres) UpdateUser(ctx context.Context, st models.Student) error {
	res, err := pg.db.ExecContext(ctx, `
UPDATE students SET first_name=$1, last_name=$2, vk_url=$3, profile_img=$4, updated_at=now(), balance=$5, total_balance=$6
WHERE tg_id=$7
`, st.FirstName, st.LastName, st.VKURL, st.ProfileImg, st.Balance, st.TotalBalance, st.TGID)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return errors.New("not found")
	}
	return nil
}

// Удаление студента по tg_id
func (pg *Postgres) DeleteUser(ctx context.Context, tg_id int64) error {
	res, err := pg.db.ExecContext(ctx, `
DELETE FROM students WHERE tg_id=$1
`, tg_id)
	if err != nil {
		return err
	}

	n, err := res.RowsAffected()
	if n == 0 {
		return errors.New("not found")
	}

	return nil
}
