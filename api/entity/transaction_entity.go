package entity

import (
	"time"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type TransactionStatus string

const (
	TransactionStatusAwaitingApproval = "awaiting_approval"
	TransactionStatusApproved         = "approved"
	TransactionStatusRejected         = "rejected"
)

type Transaction struct {
	ID                  string            `json:"id" gorm:"primaryKey,not null"`
	TotalTransferAmount float64           `json:"totalTransferAmount" gorm:"not null"`
	TotalTransferRecord uint              `json:"totalTransferRecord" gorm:"not null"`
	FromAccountNumber   string            `json:"fromAccountNumber" gorm:"not null"`
	MakerID             string            `json:"makerID" gorm:"not null"`
	MakerName           string            `json:"makerName" gorm:"not null"`
	MakerEmail          string            `json:"makerEmail" gorm:"not null"`
	MakerPhoneNumber    string            `json:"makerPhoneNumber" gorm:"not null"`
	TransferDate        time.Time         `json:"transferDate" gorm:"not null"`
	Status              TransactionStatus `json:"status" gorm:"index,not null"`
	CreatedAt           time.Time         `json:"createdAt" gorm:"not null"`
	UpdatedAt           time.Time         `json:"updatedAt" gorm:"not null"`
}

func (u *Transaction) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}

type TransactionDetail struct {
	ID                string            `json:"id" gorm:"primaryKey,not null"`
	FromAccountNumber string            `json:"fromAccountNumber" gorm:"not null"`
	ToAccountNumber   string            `json:"toAccountNumber" gorm:"not null"`
	ToAccountName     string            `json:"toAccountName" gorm:"not null"`
	ToAccountBank     string            `json:"toAccountBank" gorm:"not null"`
	TransferAmount    float64           `json:"transferAmount" gorm:"not null"`
	Description       string            `json:"description"`
	Status            TransactionStatus `json:"status" gorm:"index,not null"`
	CreatedAt         time.Time         `json:"createdAt" gorm:"not null"`
	UpdatedAt         time.Time         `json:"updatedAt" gorm:"not null"`
}

func (u *TransactionDetail) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}
