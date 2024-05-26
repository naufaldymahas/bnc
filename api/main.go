package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/naufaldymahas/bnc/api/controller"
	"github.com/naufaldymahas/bnc/api/db"
	"github.com/naufaldymahas/bnc/api/repository"
	"github.com/naufaldymahas/bnc/api/service"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}

	db, err := db.NewDB()
	if err != nil {
		log.Fatal("error connect to database")
	}

	e := echo.New()
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	userRepo := repository.NewUserRepo(db)
	corporateRepo := repository.NewCorporateRepo(db)
	authOTPRepo := repository.NewAuthOTPRepo(db)
	authUserRepo := repository.NewAuthUserRepo(db)
	transactionRepo := repository.NewTransactionRepo(db)

	authSvc := service.NewAuthSvc(userRepo, corporateRepo, authOTPRepo, authUserRepo)
	transactionSvc := service.NewTransactionSvc(userRepo, authUserRepo, transactionRepo)

	controller.NewAuthController(e, authSvc)
	controller.NewTransactionController(e, transactionSvc)

	e.Logger.Fatal(e.Start(":1323"))
}
