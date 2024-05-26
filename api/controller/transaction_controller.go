package controller

import (
	"encoding/csv"
	"net/http"
	"strconv"
	"time"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/naufaldymahas/bnc/api/dto"
	"github.com/naufaldymahas/bnc/api/service"
)

type TransactionController struct {
	transactionSvc service.TransactionSvc
}

func NewTransactionController(e *echo.Echo, transactionSvc service.TransactionSvc) {
	ctr := TransactionController{
		transactionSvc: transactionSvc,
	}

	e.GET("/v1/transaction", ctr.FindTransaction, echojwt.WithConfig(jwtMiddlewareConfig()))
	e.GET("/v1/transaction/overview", ctr.TransactionOverview, echojwt.WithConfig(jwtMiddlewareConfig()))
	e.POST("/v1/transaction/audit", ctr.AuditTransaction, echojwt.WithConfig(jwtMiddlewareConfig()))
	e.GET("/v1/transaction/:transactionId", ctr.FindTransactionDetail, echojwt.WithConfig(jwtMiddlewareConfig()))
	e.GET("/v1/transaction/transfer-template", ctr.TransferTemplate)
	e.POST("/v1/transaction/upload/validation", ctr.UploadTransactionValidation, echojwt.WithConfig(jwtMiddlewareConfig()))
	e.POST("/v1/transaction/upload/batch-create", ctr.UploadBatchCreateTransaction, echojwt.WithConfig(jwtMiddlewareConfig()))
}

func (ctr *TransactionController) TransferTemplate(c echo.Context) error {
	return c.Attachment("assets/transfer_template.csv", "transfer_template.csv")
}

func (ctr *TransactionController) UploadTransactionValidation(c echo.Context) error {
	totalRecordStr := c.FormValue("totalRecord")
	if totalRecordStr == "" {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: "totalRecord is mandatory",
		})
	}

	totalAmountStr := c.FormValue("totalAmount")
	if totalAmountStr == "" {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: "totalAmount is mandatory",
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	f, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	defer f.Close()

	totalAmount, _ := strconv.Atoi(totalAmountStr)
	totalRecord, err := strconv.Atoi(totalRecordStr)
	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1 // Allow variable number of fields

	response, err := ctr.transactionSvc.UploadTransactionValidation(dto.UploadTransactionValidationRequestDto{
		TotalRecord: totalRecord,
		TotalAmount: totalAmount,
		Reader:      reader,
		AccessToken: getAccessToken(c),
	})

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: response,
	})
}

func (ctr *TransactionController) UploadBatchCreateTransaction(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	f, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}
	defer f.Close()

	instructionType := c.FormValue("instructionType")
	transferDate := c.FormValue("transferDate")
	parseTime, err := time.Parse("2006-01-02T15:04:05.999999999Z", transferDate)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1 // Allow variable number of fields

	response, err := ctr.transactionSvc.CreateUploadTransactions(dto.CreateUploadTransactionsRequestDto{
		Reader:          reader,
		InstructionType: instructionType,
		TransferDate:    parseTime,
		AccessToken:     getAccessToken(c),
	})

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: response,
	})
}

func (ctr *TransactionController) FindTransaction(c echo.Context) error {
	var request dto.FilterPaginationTransaction
	err := c.Bind(&request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	response, count, err := ctr.transactionSvc.FindTransaction(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data:      response,
		TotalData: count,
	})
}

func (ctr *TransactionController) FindTransactionDetail(c echo.Context) error {
	var request dto.FilterPaginationTransactionDetail
	err := c.Bind(&request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	response, count, err := ctr.transactionSvc.FindTransactionDetail(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data:      response,
		TotalData: count,
	})
}

func (ctr *TransactionController) AuditTransaction(c echo.Context) error {
	var request dto.AuditTransactionDto
	err := c.Bind(&request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	err = ctr.transactionSvc.AuditTransaction(request, getAccessToken(c))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: map[string]bool{
			"status": true,
		},
	})
}

func (ctr *TransactionController) TransactionOverview(c echo.Context) error {
	response, err := ctr.transactionSvc.TransactionOverview(getAccessToken(c))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: response,
	})
}
