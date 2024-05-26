package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type AuditTrailRepository struct {
	db *gorm.DB
}

func NewAuditTrailRepo(db *gorm.DB) AuditTrailRepository {
	db.AutoMigrate(&entity.AuditTransaction{})

	return AuditTrailRepository{db: db}
}

func (r *AuditTrailRepository) CreateAuditTransaction(u *entity.AuditTransaction) error {
	return r.db.Create(u).Error
}
