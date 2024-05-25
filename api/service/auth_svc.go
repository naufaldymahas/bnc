package service

import (
	"errors"
	"fmt"
	"math/rand"
	"net/mail"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/naufaldymahas/bnc/api/constant"
	"github.com/naufaldymahas/bnc/api/dto"
	"github.com/naufaldymahas/bnc/api/entity"
	"github.com/naufaldymahas/bnc/api/repository"
	"github.com/oklog/ulid/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthSvc struct {
	userRepo      repository.UserRepository
	corporateRepo repository.CorporateRepository
	authOTPRepo   repository.AuthOTPRepository
	authUserRepo  repository.AuthUserRepository
}

func NewAuthSvc(
	userRepo repository.UserRepository,
	corporateRepo repository.CorporateRepository,
	authOTPRepo repository.AuthOTPRepository,
	authUserRepo repository.AuthUserRepository,
) AuthSvc {
	return AuthSvc{
		userRepo:      userRepo,
		corporateRepo: corporateRepo,
		authOTPRepo:   authOTPRepo,
		authUserRepo:  authUserRepo,
	}
}

func (svc *AuthSvc) Login(request dto.LoginDto) (response dto.AuthResponseDto, err error) {
	corporate, err := svc.corporateRepo.FindByAccountNumber(request.CorporateAccountNumber)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return response, errors.New("corporate not found")
		}

		return response, err
	}

	user, err := svc.userRepo.FindById(request.UserID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return response, errors.New("userId invalid")
		}

		return response, err
	}

	if !svc.CheckPasswordHash(request.Password, user.Password) {
		return response, errors.New("userId invalid")
	}

	accessToken, err := svc.GenerateJwt(user)
	if err != nil {
		return response, err
	}

	authUser := entity.AuthUser{
		ID:          ulid.Make().String(),
		UserID:      user.ID,
		AccessToken: accessToken,
		LastLoginAt: time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	svc.authUserRepo.Create(&authUser)

	response = dto.AuthResponseDto{
		User: dto.UserDto{
			ID:                     user.ID,
			Name:                   user.Name,
			Role:                   constant.UserRoleMaker,
			PhoneNumber:            user.PhoneNumber,
			Email:                  user.Email,
			CorporateAccountNumber: user.CorporateAccountNumber,
			CreatedAt:              user.CreatedAt,
			UpdatedAt:              user.UpdatedAt,
		},
		Corporate: dto.CorporateDto{
			AccountNumber: corporate.AccountNumber,
			Name:          corporate.Name,
			CreatedAt:     corporate.CreatedAt,
			UpdatedAt:     corporate.UpdatedAt,
		},
		AccessToken: accessToken,
		LastLoginAt: authUser.UpdatedAt,
	}

	return response, nil
}

func (svc *AuthSvc) Register(request dto.RegisterDto) (response dto.AuthResponseDto, err error) {
	phoneNumber, isValid := svc.ValidatePhoneNumber(request.UserPhoneNumber)
	if !isValid {
		return response, errors.New("phone number invalid")
	}
	request.UserPhoneNumber = phoneNumber

	_, err = mail.ParseAddress(request.UserEmail)
	if err != nil {
		return response, errors.New("email invalid")
	}

	if len(request.UserID) == 0 {
		return response, errors.New("userId field is required")
	}

	if len(request.UserName) == 0 {
		return response, errors.New("userName field is required")
	}

	if len(request.UserRole) == 0 {
		return response, errors.New("userRole field is required")
	}

	if len(request.CorporateAccountNumber) == 0 {
		return response, errors.New("corporateAccountNumber field is required")
	}

	if len(request.CorporateName) == 0 {
		return response, errors.New("corporateName field is required")
	}

	authOtp := svc.authOTPRepo.FindByOTPAndEmailAndStillValid(request.OTP, request.UserEmail, time.Now())
	if authOtp.ID == "" {
		return response, errors.New("otp invalid")
	}

	existCorporate, _ := svc.corporateRepo.FindByAccountNumber(request.CorporateAccountNumber)
	if existCorporate.AccountNumber != "" {
		return response, errors.New("corporateAccountNumber already exist")
	}

	existUserId, _ := svc.userRepo.FindById(request.UserID)
	if existUserId.ID != "" {
		return response, errors.New("userId already exist")
	}

	existUserEmail, _ := svc.userRepo.FindByEmail(request.UserEmail)
	if existUserEmail.ID != "" {
		return response, errors.New("userEmail already exist")
	}

	existUserPhoneNumber, _ := svc.userRepo.FindByPhoneNumber(request.UserPhoneNumber)
	if existUserPhoneNumber.ID != "" {
		return response, errors.New("userPhoneNumber already exist")
	}

	request.Password, err = svc.HashPassword(request.Password)
	if err != nil {
		return response, err
	}

	corporate := entity.Corporate{
		AccountNumber: request.CorporateAccountNumber,
		Name:          request.CorporateName,
	}
	err = svc.corporateRepo.Create(&corporate)
	if err != nil {
		return response, err
	}

	user := entity.User{
		ID:                     request.UserID,
		Name:                   request.UserName,
		Role:                   request.UserRole,
		PhoneNumber:            request.UserPhoneNumber,
		Email:                  request.UserEmail,
		Password:               request.Password,
		CorporateAccountNumber: request.CorporateAccountNumber,
	}
	err = svc.userRepo.Create(&user)
	if err != nil {
		return response, err
	}

	accessToken, err := svc.GenerateJwt(user)
	if err != nil {
		return response, err
	}

	authUser := entity.AuthUser{
		ID:          ulid.Make().String(),
		UserID:      user.ID,
		AccessToken: accessToken,
		LastLoginAt: time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	svc.authUserRepo.Create(&authUser)

	response = dto.AuthResponseDto{
		User: dto.UserDto{
			ID:                     request.UserID,
			Name:                   request.UserName,
			Role:                   request.UserRole,
			PhoneNumber:            request.UserPhoneNumber,
			Email:                  request.UserEmail,
			CorporateAccountNumber: request.CorporateAccountNumber,
			CreatedAt:              user.CreatedAt,
			UpdatedAt:              user.UpdatedAt,
		},
		Corporate: dto.CorporateDto{
			AccountNumber: request.CorporateAccountNumber,
			Name:          request.CorporateName,
			CreatedAt:     corporate.CreatedAt,
			UpdatedAt:     corporate.UpdatedAt,
		},
		AccessToken: accessToken,
		LastLoginAt: authUser.UpdatedAt,
	}

	return response, nil
}

func (svc *AuthSvc) SendOTP(email string) error {
	otp := svc.generateOTP(6)

	err := svc.authOTPRepo.Create(&entity.AuthOTP{
		ID:      ulid.Make().String(),
		OTP:     otp,
		Email:   email,
		ValidAt: time.Now().Add(time.Minute * 5),
	})

	return err
}

func (svc *AuthSvc) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func (svc *AuthSvc) CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (svc *AuthSvc) GenerateJwt(u entity.User) (string, error) {
	claims := &dto.JwtCustomClaims{
		Name: u.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte("secret"))
}

func (svc *AuthSvc) ValidatePhoneNumber(phoneNumber string) (string, bool) {
	if len(phoneNumber) <= 1 {
		return phoneNumber, false
	}
	if phoneNumber[0:1] != "+" {
		phoneNumber = "+" + phoneNumber
	}

	e164Regex := `^\+[1-9]\d{1,14}$`
	re := regexp.MustCompile(e164Regex)
	phoneNumber = strings.ReplaceAll(phoneNumber, " ", "")
	phoneNumber = strings.ReplaceAll(phoneNumber, "-", "")

	isValid := re.Find([]byte(phoneNumber)) != nil

	return phoneNumber, isValid
}

func (Svc *AuthSvc) generateOTP(l int) string {
	result := ""

	r := rand.New(rand.NewSource(time.Now().UTC().UnixNano()))
	for i := 0; i < l; i++ {
		randomNumber := r.Intn(10)
		result += fmt.Sprintf("%d", randomNumber)
	}

	return result
}
