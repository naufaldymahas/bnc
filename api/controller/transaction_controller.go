package controller

import (
	"encoding/csv"
	"net/http"
	"strconv"

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

	e.GET("/v1/transaction/transfer-template", ctr.TransferTemplate)
	e.POST("/v1/transaction/upload/validation", ctr.UploadTransactionValidation, echojwt.WithConfig(jwtMiddlewareConfig()))
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

	response, err := ctr.transactionSvc.UploadTransactionValidation(dto.UploadTransactionRequestDto{
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
