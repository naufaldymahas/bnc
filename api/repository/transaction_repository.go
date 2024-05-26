package repository

import (
	"github.com/naufaldymahas/bnc/api/constant"
	"github.com/naufaldymahas/bnc/api/dto"
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

func (r *TransactionRepository) UpdateTransactionTotalRecordAndTotalAmount(transaction *entity.Transaction) error {
	return r.db.Model(transaction).Updates(entity.Transaction{
		TotalTransferAmount: transaction.TotalTransferAmount,
		TotalTransferRecord: transaction.TotalTransferRecord,
	}).Error
}

func (r *TransactionRepository) FindTransaction(request dto.FilterPaginationTransaction) ([]entity.Transaction, error) {
	var res []entity.Transaction

	if request.Page <= 0 {
		request.Page = 1
	}

	if request.Limit <= 0 {
		request.Limit = 10
	}

	offset := (request.Page - 1) * request.Limit

	db := r.db.Offset(offset).Limit(request.Limit)

	if request.Status != "" {
		db = db.Where("status = ?", request.Status)
	}

	if request.FromAccountNumber != "" {
		db = db.Where("from_account_number = ?", request.FromAccountNumber)
	}

	err := db.Order("created_at DESC").Find(&res).Error
	return res, err
}

func (r TransactionRepository) CountFindTransaction(request dto.FilterPaginationTransaction) (int64, error) {
	var count int64

	db := r.db.Model(&entity.Transaction{})

	if request.Status != "" {
		db = db.Where("status = ?", request.Status)
	}

	if request.FromAccountNumber != "" {
		db = db.Where("from_account_number = ?", request.FromAccountNumber)
	}

	err := db.Count(&count).Error
	return count, err
}

func (r *TransactionRepository) FindTransactionDetailByTransactionId(request dto.FilterPaginationTransactionDetail) ([]entity.TransactionDetail, error) {
	var res []entity.TransactionDetail
	if request.Page <= 0 {
		request.Page = 1
	}

	if request.Limit <= 0 {
		request.Limit = 10
	}

	offset := (request.Page - 1) * request.Limit

	db := r.db.Offset(offset).Limit(request.Limit)

	if request.TransactionID != "" {
		db = db.Where("transaction_id = ?", request.TransactionID)
	}

	err := db.Find(&res).Error
	return res, err
}

func (r *TransactionRepository) CountFindTransactionDetailByTransactionId(request dto.FilterPaginationTransactionDetail) (int64, error) {
	var res int64

	db := r.db.Model(&entity.TransactionDetail{})

	if request.TransactionID != "" {
		db = db.Where("transaction_id = ?", request.TransactionID)
	}

	err := db.Count(&res).Error
	return res, err
}

func (r *TransactionRepository) CountTransactionByStatusAndFromAccountNumber(status constant.TransactionStatus, fromAccountNumber string) (int64, error) {
	var res int64
	err := r.db.Model(&entity.Transaction{}).Where("status = ? AND from_account_number = ?", status, fromAccountNumber).Count(&res).Error

	return res, err
}

func (r *TransactionRepository) CountTransactionByStatus(status constant.TransactionStatus) (int64, error) {
	var res int64
	err := r.db.Model(&entity.Transaction{}).Where("status = ?", status).Count(&res).Error

	return res, err
}

func (r *TransactionRepository) UpdateTransactionStatusByID(transactionId string, status constant.TransactionStatus) error {
	tx := r.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	err := tx.Error
	if err != nil {
		return err
	}

	err = tx.Model(&entity.Transaction{}).Where("id = ?", transactionId).Update("status", status).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.Model(&entity.TransactionDetail{}).Where("transaction_id = ?", transactionId).Update("status", status).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
