package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) UserRepository {
	return UserRepository{db: db}
}

func (r *UserRepository) FindById(id string) (entity.User, error) {
	var user entity.User

	err := r.db.First(&user, "id = ?", id).Error

	return user, err
}

func (r *UserRepository) Create(u *entity.User) error {
	return r.db.Create(u).Error
}

func (r *UserRepository) FindByEmail(email string) (entity.User, error) {
	var user entity.User

	err := r.db.Where("email = ?", email).Find(&user).Error

	return user, err
}

func (r *UserRepository) FindByPhoneNumber(phoneNumber string) (entity.User, error) {
	var user entity.User

	err := r.db.Where("PhoneNumber = ?", phoneNumber).Find(&user).Error

	return user, err
}
