package repository

import (
	"time"

	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type AuthOTPRepository struct {
	db *gorm.DB
}

func NewAuthOTPRepo(db *gorm.DB) AuthOTPRepository {
	db.AutoMigrate(&entity.AuthOTP{})

	return AuthOTPRepository{db: db}
}

func (r *AuthOTPRepository) Create(u *entity.AuthOTP) error {
	return r.db.Create(u).Error
}

func (r *AuthOTPRepository) FindByOTPAndEmailAndStillValid(otp, email string, validAt time.Time) entity.AuthOTP {
	var authOTP entity.AuthOTP

	r.db.Where("otp = ? AND email = ? AND valid_at >= ?", otp, email, validAt).Find(&authOTP)

	return authOTP
}
