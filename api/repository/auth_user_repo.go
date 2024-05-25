package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type AuthUserRepository struct {
	db *gorm.DB
}

func NewAuthUserRepo(db *gorm.DB) AuthUserRepository {
	db.AutoMigrate(&entity.AuthUser{})

	return AuthUserRepository{db: db}
}

func (r *AuthUserRepository) Create(u *entity.AuthUser) error {
	return r.db.Create(u).Error
}

func (r *AuthUserRepository) DeleteByAccessToken(accessToken string) error {
	return r.db.Where("access_token = ?", accessToken).Delete(&entity.AuthUser{}).Error
}

func (r *AuthUserRepository) FindByAccessToken(accessToken string) (entity.AuthUser, error) {
	var res entity.AuthUser

	err := r.db.Where("access_token = ?", accessToken).Find(&res).Error

	return res, err
}
