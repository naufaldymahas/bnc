package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type CorporateRepository struct {
	db *gorm.DB
}

func NewCorporateRepo(db *gorm.DB) CorporateRepository {
	return CorporateRepository{db: db}
}

func (r *CorporateRepository) FindByAccountNumber(accountNumber string) (entity.Corporate, error) {
	var corporate entity.Corporate

	err := r.db.First(&corporate, "AccountNumber = ?", accountNumber).Error

	return corporate, err
}

func (r *CorporateRepository) Create(c *entity.Corporate) error {
	return r.db.Create(c).Error
}
