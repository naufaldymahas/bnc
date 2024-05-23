package entity

import (
	"time"
)

type Corporate struct {
	AccountNumber string    `json:"accountNumber" gorm:"primaryKey,not null"`
	Name          string    `json:"name" gorm:"not null"`
	CreatedAt     time.Time `json:"createdAt" gorm:"not null"`
	UpdatedAt     time.Time `json:"updatedAt" gorm:"not null"`
}
