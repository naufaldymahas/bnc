package service

import (
	"regexp"
	"strconv"
	"time"

	"github.com/naufaldymahas/bnc/api/constant"
	"github.com/naufaldymahas/bnc/api/dto"
	"github.com/naufaldymahas/bnc/api/entity"
	"github.com/naufaldymahas/bnc/api/repository"
	"github.com/oklog/ulid/v2"
)

type TransactionSvc struct {
	userRepo        repository.UserRepository
	authUserRepo    repository.AuthUserRepository
	transactionRepo repository.TransactionRepository
}

func NewTransactionSvc(
	userRepo repository.UserRepository,
	authUserRepo repository.AuthUserRepository,
	transactionRepo repository.TransactionRepository,
) TransactionSvc {
	return TransactionSvc{
		userRepo:        userRepo,
		authUserRepo:    authUserRepo,
		transactionRepo: transactionRepo,
	}
}

func (svc *TransactionSvc) UploadTransactionValidation(request dto.UploadTransactionValidationRequestDto) (dto.UploadTransactionValidationResponseDto, error) {
	data, err := request.Reader.ReadAll()
	response := dto.UploadTransactionValidationResponseDto{
		Status:            false,
		ActualTotalRecord: 0,
		ActualTotalAmount: 0,
		SameAccountNumber: 0,
	}
	if err != nil {
		return response, err
	}

	authUser, err := svc.authUserRepo.FindByAccessToken(request.AccessToken)
	if err != nil {
		return response, err
	}

	user, err := svc.userRepo.FindById(authUser.UserID)
	if err != nil {
		return response, err
	}

	for i, row := range data {
		if i == 0 {
			continue
		}

		amount, err := strconv.Atoi(row[3])
		if err == nil {
			response.ActualTotalAmount += amount
		}

		accountNumber := row[1]
		if !svc.validateAccountNumber(accountNumber) {
			response.InvalidAccountNumber += 1
		}

		if accountNumber == user.CorporateAccountNumber {
			response.SameAccountNumber += 1
		}

		response.ActualTotalRecord += 1
	}

	response.Status = request.TotalAmount == response.ActualTotalAmount &&
		request.TotalRecord == response.ActualTotalRecord &&
		response.SameAccountNumber == 0 &&
		response.InvalidAccountNumber == 0

	return response, nil
}

func (svc *TransactionSvc) CreateUploadTransactions(request dto.CreateUploadTransactionsRequestDto) (dto.CreateUploadTransactionsResponseDto, error) {
	response := dto.CreateUploadTransactionsResponseDto{
		Status:            false,
		TransactionID:     "",
		FromAccountNumber: "",
		ActualTotalRecord: 0,
		ActualTotalAmount: 0,
	}

	data, err := request.Reader.ReadAll()
	if err != nil {
		return response, err
	}

	authUser, err := svc.authUserRepo.FindByAccessToken(request.AccessToken)
	if err != nil {
		return response, err
	}

	user, err := svc.userRepo.FindById(authUser.UserID)
	if err != nil {
		return response, err
	}

	transaction := entity.Transaction{
		ID:                  ulid.Make().String(),
		TotalTransferAmount: 0,
		TotalTransferRecord: 0,
		FromAccountNumber:   user.CorporateAccountNumber,
		MakerID:             user.ID,
		MakerName:           user.Name,
		MakerEmail:          user.Email,
		MakerPhoneNumber:    user.PhoneNumber,
		InstructionType:     constant.TransactionInstructionTypeImmediate,
		TransferDate:        time.Time{},
		Status:              constant.TransactionStatusAwaitingApproval,
	}

	err = svc.transactionRepo.CreateTransaction(&transaction)
	if err != nil {
		return response, err
	}

	totalAmount := 0
	totalRecord := 0

	batch := 1000
	details := []*entity.TransactionDetail{}

	for i, row := range data {
		if i == 0 {
			continue
		}

		amount, err := strconv.Atoi(row[3])
		if err != nil {
			continue
		}

		toAccountNumber := row[1]
		if toAccountNumber == user.CorporateAccountNumber {
			continue
		}

		details = append(details, &entity.TransactionDetail{
			ID:                ulid.Make().String(),
			TransactionID:     transaction.ID,
			FromAccountNumber: user.CorporateAccountNumber,
			ToAccountNumber:   toAccountNumber,
			ToAccountName:     row[2],
			ToAccountBank:     row[0],
			TransferAmount:    float64(amount),
			Description:       "",
			Status:            constant.TransactionStatusAwaitingApproval,
		})

		if len(details) == batch {
			svc.transactionRepo.BatchCreateTransactionDetail(details)
			details = []*entity.TransactionDetail{}
		}

		totalAmount += amount
		totalRecord += 1
	}

	if len(details) > 0 {
		svc.transactionRepo.BatchCreateTransactionDetail(details)
	}

	transaction.TotalTransferAmount = float64(totalAmount)
	transaction.TotalTransferRecord = uint(totalRecord)
	err = svc.transactionRepo.UpdateTransactionTotalRecordAndTotalAmount(&transaction)
	if err != nil {
		return response, err
	}

	response.Status = true
	response.TransactionID = transaction.ID
	response.ActualTotalAmount = transaction.TotalTransferAmount
	response.ActualTotalRecord = transaction.TotalTransferRecord
	response.FromAccountNumber = user.CorporateAccountNumber

	return response, nil
}

func (svc *TransactionSvc) validateAccountNumber(val string) bool {
	numberRegex := `^[0-9]*$`

	re := regexp.MustCompile(numberRegex)

	return re.Find([]byte(val)) != nil
}
