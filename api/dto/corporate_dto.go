package dto

import "time"

type CorporateDto struct {
	AccountNumber string    `json:"accountNumber"`
	Name          string    `json:"name"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}
