package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type AuthUserRepository struct {
	db *gorm.DB
}

func NewAuthUserRepo(db *gorm.DB) AuthUserRepository {
	return AuthUserRepository{db: db}
}

func (r *AuthUserRepository) Create(u *entity.AuthUser) error {
	return r.db.Create(u).Error
}