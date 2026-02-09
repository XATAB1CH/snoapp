package models

import (
	"errors"
)

type Student struct {
	TGID         int64   `json:"tg_id"`
	TGName       string  `json:"tg_name"`
	FirstName    string  `json:"first_name"`
	LastName     string  `json:"last_name"`
	VKURL        *string `json:"vk_url"`
	ProfileImg   string  `json:"profile_img"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
	Balance      float64 `json:"balance"`
	TotalBalance float64 `json:"total_balance"`
}

func CreateStudent(tgId int64, tgName string) *Student {
	return &Student{
		TGID:   tgId,
		TGName: tgName,
	}
}

func (s *Student) SetStartBalance() {
	s.Balance = 0
	s.TotalBalance = 0
}

func (s *Student) UpdateBalance(balance float64) error {
	if s.Balance+balance < 0 {
		return errors.New("not enough balance")
	}

	s.Balance += balance
	s.TotalBalance += balance

	return nil
}
