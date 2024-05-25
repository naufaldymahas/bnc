package controller

import (
	"encoding/csv"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type TransactionController struct {
}

func NewTransactionController(e *echo.Echo) {
	ctr := TransactionController{}

	e.GET("/v1/transaction/transfer-template", ctr.TransferTemplate)
	e.POST("/v1/transaction/upload", ctr.UploadTransaction)
}

func (ctr *TransactionController) TransferTemplate(c echo.Context) error {
	log.Println("masuk?")
	return c.Attachment("assets/transfer_template.csv", "transfer_template.csv")
}

func (ctr *TransactionController) UploadTransaction(c echo.Context) error {
	file, err := c.FormFile("file")

	f, err := file.Open()

	defer f.Close()

	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1 // Allow variable number of fields
	data, err := reader.ReadAll()
	if err != nil {
		return c.String(http.StatusBadRequest, err.Error())
	}

	// Print the CSV data
	for _, row := range data {
		for _, col := range row {
			log.Printf("%s,", col)
		}
		log.Println()
	}

	return c.String(http.StatusOK, "ok")
}
