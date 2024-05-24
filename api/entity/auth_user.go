package entity

import (
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type AuthUser struct {
	ID          string    `json:"id" gorm:"primaryKey,not null"`
	UserID      string    `json:"userId" gorm:"not null"`
	AccessToken string    `json:"accessToken" gorm:"not null"`
	LastLoginAt time.Time `json:"lastLoginAt" gorm:"not null"`
	CreatedAt   time.Time `json:"createdAt" gorm:"not null"`
	UpdatedAt   time.Time `json:"updatedAt" gorm:"not null"`
}

func (u *AuthUser) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}
