package dto

import "encoding/csv"

type UploadTransactionRequestDto struct {
	TotalRecord int
	TotalAmount int
	Reader      *csv.Reader
	AccessToken string
}

type UploadTransactionResponseDto struct {
	Status            bool `json:"status"`
	ActualTotalRecord int  `json:"actualTotalRecord"`
	ActualTotalAmount int  `json:"actualTotalAmount"`
	SameAccountNumber int  `json:"sameAccountNumber"`
}
