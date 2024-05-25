package service

import (
	"strconv"

	"github.com/naufaldymahas/bnc/api/dto"
	"github.com/naufaldymahas/bnc/api/repository"
)

type TransactionSvc struct {
	userRepo     repository.UserRepository
	authUserRepo repository.AuthUserRepository
}

func NewTransactionSvc(
	userRepo repository.UserRepository,
	authUserRepo repository.AuthUserRepository,
) TransactionSvc {
	return TransactionSvc{
		userRepo:     userRepo,
		authUserRepo: authUserRepo,
	}
}

func (svc *TransactionSvc) UploadTransactionValidation(request dto.UploadTransactionRequestDto) (dto.UploadTransactionResponseDto, error) {
	data, err := request.Reader.ReadAll()
	response := dto.UploadTransactionResponseDto{
		Status:            false,
		ActualTotalRecord: 0,
		ActualTotalAmount: 0,
		SameAccountNumber: 0,
	}
	if err != nil {
		return response, err
	}

	authUser, err := svc.authUserRepo.FindByAccessToken(request.AccessToken)
	user, err := svc.userRepo.FindById(authUser.UserID)

	for i, row := range data {
		if i == 0 {
			continue
		}

		amount, err := strconv.Atoi(row[3])
		if err == nil {
			response.ActualTotalAmount += amount
		}

		accountNumber := row[1]
		if accountNumber == user.CorporateAccountNumber {
			response.SameAccountNumber += 1
		}

		response.ActualTotalRecord += 1
	}

	response.Status = request.TotalAmount == response.ActualTotalAmount &&
		request.TotalRecord == response.ActualTotalRecord &&
		response.SameAccountNumber == 0

	return response, nil
}
