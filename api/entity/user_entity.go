package entity

import (
	"time"

	"github.com/naufaldymahas/bnc/api/constant"
)

type User struct {
	ID                     string            `json:"id" gorm:"primaryKey;not null"`
	Name                   string            `json:"name" gorm:"not null"`
	Role                   constant.UserRole `json:"role" gorm:"not null"`
	PhoneNumber            string            `json:"phoneNumber" gorm:"uniqueIndex;not null"`
	Email                  string            `json:"email" gorm:"uniqueIndex;not null"`
	Password               string            `json:"password" gorm:"not null"`
	CorporateAccountNumber string            `json:"corporateAccountNumber" gorm:"not null"`
	CreatedAt              time.Time         `json:"createdAt" gorm:"not null"`
	UpdatedAt              time.Time         `json:"updatedAt" gorm:"not null"`
}
