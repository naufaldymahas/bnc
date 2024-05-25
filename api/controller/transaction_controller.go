package controller

import (
	"log"

	"github.com/labstack/echo/v4"
)

type TransactionController struct {
}

func NewTransactionController(e *echo.Echo) {
	ctr := TransactionController{}

	e.GET("/v1/transaction/transfer-template", ctr.TransferTemplate)
}

func (ctr *TransactionController) TransferTemplate(c echo.Context) error {
	log.Println("masuk?")
	return c.Attachment("assets/transfer_template.csv", "transfer_template.csv")
}
