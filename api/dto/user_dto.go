package dto

import (
	"time"

	"github.com/naufaldymahas/bnc/api/constant"
)

type UserDto struct {
	ID                     string            `json:"id"`
	Name                   string            `json:"name"`
	Role                   constant.UserRole `json:"role"`
	PhoneNumber            string            `json:"phoneNumber"`
	Email                  string            `json:"email"`
	CorporateAccountNumber string            `json:"corporateAccountNumber"`
	CreatedAt              time.Time         `json:"createdAt"`
	UpdatedAt              time.Time         `json:"updatedAt"`
}
