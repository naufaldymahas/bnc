package repository

import (
	"github.com/naufaldymahas/bnc/api/entity"
	"gorm.io/gorm"
)

type TransactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepo(db *gorm.DB) TransactionRepository {
	db.AutoMigrate(&entity.Transaction{})
	db.AutoMigrate(&entity.TransactionDetail{})

	return TransactionRepository{db: db}
}

func (r *TransactionRepository) CreateTransaction(transaction *entity.Transaction) error {
	return r.db.Create(transaction).Error
}

func (r *TransactionRepository) BatchCreateTransactionDetail(details []*entity.TransactionDetail) error {
	return r.db.Create(&details).Error
}

func (r TransactionRepository) UpdateTransactionTotalRecordAndTotalAmount(transaction *entity.Transaction) error {
	return r.db.Model(transaction).Updates(entity.Transaction{
		TotalTransferAmount: transaction.TotalTransferAmount,
		TotalTransferRecord: transaction.TotalTransferRecord,
	}).Error
}
