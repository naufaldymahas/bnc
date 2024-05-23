package entity

import (
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type AuditTransaction struct {
	ID              string    `json:"id" gorm:"primaryKey,not null"`
	Action          string    `json:"action" gorm:"not null"`
	TransactionID   string    `json:"transactionId" gorm:"not null"`
	UserID          string    `json:"userId" gorm:"not null"`
	UserName        string    `json:"userName" gorm:"not null"`
	UserEmail       string    `json:"userEmail" gorm:"not null"`
	UserPhoneNumber string    `json:"userPhoneNumber" gorm:"not null"`
	CreatedAt       time.Time `json:"createdAt" gorm:"not null"`
	UpdatedAt       time.Time `json:"updatedAt" gorm:"not null"`
}

func (u *AuditTransaction) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}
