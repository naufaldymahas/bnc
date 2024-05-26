package service

import (
	"regexp"
	"strconv"

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
		Status:               false,
		ActualTotalRecord:    0,
		ActualTotalAmount:    0,
		SameAccountNumber:    0,
		InvalidAccountNumber: 0,
	}
	if err != nil {
		return response, err
	}

	user, err := svc.findUserByAccessToken(request.AccessToken)

	for i, row := range data {
		if i == 0 {
			continue
		}

		amount, err := strconv.Atoi(row[3])
		if err == nil {
			response.ActualTotalAmount += amount
		}

		if row[0] == "" {
			response.InvalidBankname += 1
		}

		if row[2] == "" {
			response.InvalidAccountName += 1
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
		response.InvalidAccountNumber == 0 &&
		response.InvalidBankname == 0 &&
		response.InvalidAccountName == 0

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

	user, err := svc.findUserByAccessToken(request.AccessToken)

	transaction := entity.Transaction{
		ID:                  ulid.Make().String(),
		TotalTransferAmount: 0,
		TotalTransferRecord: 0,
		FromAccountNumber:   user.CorporateAccountNumber,
		MakerID:             user.ID,
		MakerName:           user.Name,
		MakerEmail:          user.Email,
		MakerPhoneNumber:    user.PhoneNumber,
		InstructionType:     constant.TransactionInstructionType(request.InstructionType),
		TransferDate:        request.TransferDate,
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

		if row[0] == "" {
			continue
		}

		if row[2] == "" {
			continue
		}

		toAccountNumber := row[1]
		if !svc.validateAccountNumber(toAccountNumber) {
			continue
		}

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
	response.InstructionType = transaction.InstructionType.String()
	response.TransferDate = transaction.TransferDate

	return response, nil
}

func (svc *TransactionSvc) FindTransaction(request dto.FilterPaginationTransaction, accessToken string) ([]entity.Transaction, int64, error) {
	user, err := svc.findUserByAccessToken(accessToken)
	if err != nil {
		return []entity.Transaction{}, 0, err
	}

	if user.Role == constant.UserRoleMaker {
		request.FromAccountNumber = user.CorporateAccountNumber
	} else if user.Role == constant.UserRoleApprover {
		request.Status = constant.TransactionStatusAwaitingApproval
	}

	transactions, err := svc.transactionRepo.FindTransaction(request)
	if err != nil {
		return []entity.Transaction{}, 0, err
	}

	count, err := svc.transactionRepo.CountFindTransaction(request)
	if err != nil {
		return []entity.Transaction{}, 0, err
	}

	return transactions, count, nil
}

func (svc *TransactionSvc) FindTransactionDetail(request dto.FilterPaginationTransactionDetail) ([]entity.TransactionDetail, int64, error) {
	details, err := svc.transactionRepo.FindTransactionDetailByTransactionId(request)
	if err != nil {
		return []entity.TransactionDetail{}, 0, err
	}

	count, err := svc.transactionRepo.CountFindTransactionDetailByTransactionId(request)
	if err != nil {
		return []entity.TransactionDetail{}, 0, err
	}

	return details, count, nil
}

func (svc *TransactionSvc) validateAccountNumber(val string) bool {
	numberRegex := `^[0-9]*$`

	re := regexp.MustCompile(numberRegex)

	return re.Find([]byte(val)) != nil
}

func (svc *TransactionSvc) findUserByAccessToken(accessToken string) (entity.User, error) {
	authUser, err := svc.authUserRepo.FindByAccessToken(accessToken)
	if err != nil {
		return entity.User{}, err
	}

	user, err := svc.userRepo.FindById(authUser.UserID)
	if err != nil {
		return entity.User{}, err
	}

	return user, nil
}
