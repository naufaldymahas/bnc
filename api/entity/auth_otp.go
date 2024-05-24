package entity

import (
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type AuthOTP struct {
	ID        string    `json:"id" gorm:"primaryKey;not null"`
	OTP       string    `json:"otp" gorm:"index:idx_otp;not null"`
	Email     string    `json:"email" gorm:"index:idx_otp;not null"`
	ValidAt   time.Time `json:"validAt" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"not null"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"not null"`
}

func (u *AuthOTP) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}
