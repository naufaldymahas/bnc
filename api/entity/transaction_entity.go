package entity

import (
	"time"

	"github.com/naufaldymahas/bnc/api/constant"
	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type Transaction struct {
	ID                  string                              `json:"id" gorm:"primaryKey;not null"`
	TotalTransferAmount float64                             `json:"totalTransferAmount" gorm:"not null"`
	TotalTransferRecord uint                                `json:"totalTransferRecord" gorm:"not null"`
	FromAccountNumber   string                              `json:"fromAccountNumber" gorm:"index;index:idx_acc_num_status;not null"`
	MakerID             string                              `json:"makerID" gorm:"not null"`
	MakerName           string                              `json:"makerName" gorm:"not null"`
	MakerEmail          string                              `json:"makerEmail" gorm:"not null"`
	MakerPhoneNumber    string                              `json:"makerPhoneNumber" gorm:"not null"`
	InstructionType     constant.TransactionInstructionType `json:"instructionType" gorm:"not null"`
	TransferDate        time.Time                           `json:"transferDate" gorm:"not null"`
	Status              constant.TransactionStatus          `json:"status" gorm:"index;index:idx_acc_num_status;not null"`
	CreatedAt           time.Time                           `json:"createdAt" gorm:"not null"`
	UpdatedAt           time.Time                           `json:"updatedAt" gorm:"not null"`
}

type TransactionDetail struct {
	ID                string                     `json:"id" gorm:"primaryKey;not null"`
	TransactionID     string                     `json:"transactionId" gorm:"index;not null"`
	FromAccountNumber string                     `json:"fromAccountNumber" gorm:"not null"`
	ToAccountNumber   string                     `json:"toAccountNumber" gorm:"not null"`
	ToAccountName     string                     `json:"toAccountName" gorm:"not null"`
	ToAccountBank     string                     `json:"toAccountBank" gorm:"not null"`
	TransferAmount    float64                    `json:"transferAmount" gorm:"not null"`
	Description       string                     `json:"description"`
	Status            constant.TransactionStatus `json:"status" gorm:"index;not null"`
	CreatedAt         time.Time                  `json:"createdAt" gorm:"not null"`
	UpdatedAt         time.Time                  `json:"updatedAt" gorm:"not null"`
}

func (u *TransactionDetail) BeforeCreate(tx *gorm.DB) error {
	u.ID = ulid.Make().String()
	return nil
}
