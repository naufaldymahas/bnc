package dto

import "encoding/csv"

type UploadTransactionValidationRequestDto struct {
	TotalRecord int
	TotalAmount int
	Reader      *csv.Reader
	AccessToken string
}

type UploadTransactionValidationResponseDto struct {
	Status               bool `json:"status"`
	ActualTotalRecord    int  `json:"actualTotalRecord"`
	ActualTotalAmount    int  `json:"actualTotalAmount"`
	SameAccountNumber    int  `json:"sameAccountNumber"`
	InvalidAccountNumber int  `json:"invalidAccountNumber"`
}

type CreateUploadTransactionsRequestDto struct {
	Reader      *csv.Reader
	AccessToken string
}

type CreateUploadTransactionsResponseDto struct {
	Status            bool    `json:"status"`
	TransactionID     string  `json:"transactionId"`
	FromAccountNumber string  `json:"fromAccountNumber"`
	ActualTotalRecord uint    `json:"actualTotalRecord"`
	ActualTotalAmount float64 `json:"actualTotalAmount"`
}
