package dto

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/naufaldymahas/bnc/api/constant"
)

type LoginDto struct {
	CorporateAccountNumber string `json:"corporateAccountNumber"`
	UserID                 string `json:"userId"`
	Password               string `json:"password"`
}

type RegisterDto struct {
	CorporateAccountNumber string            `json:"corporateAccountNumber"`
	CorporateName          string            `json:"corporateName"`
	UserID                 string            `json:"userId"`
	UserName               string            `json:"userName"`
	UserRole               constant.UserRole `json:"userRole"`
	UserPhoneNumber        string            `json:"userPhoneNumber"`
	UserEmail              string            `json:"userEmail"`
	Password               string            `json:"password"`
	OTP                    string            `json:"otp"`
}

type AuthResponseDto struct {
	User        UserDto      `json:"user"`
	Corporate   CorporateDto `json:"corporate"`
	AccessToken string       `json:"accessToken"`
	LastLoginAt time.Time    `json:"lastLoginAt"`
}

type JwtCustomClaims struct {
	Name string `json:"name"`
	jwt.RegisteredClaims
}

type SendOTPDto struct {
	Email string `json:"email"`
}
