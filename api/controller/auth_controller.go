package controller

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/naufaldymahas/bnc/api/dto"
	"github.com/naufaldymahas/bnc/api/service"
)

type AuthController struct {
	authSvc service.AuthSvc
}

func NewAuthController(e *echo.Echo, authSvc service.AuthSvc) {
	ctr := AuthController{
		authSvc: authSvc,
	}

	e.POST("/v1/auth/login", ctr.Login)
	e.POST("/v1/auth/otp/send", ctr.SendOTP)
}

func (ctr *AuthController) Login(c echo.Context) error {
	var request dto.LoginDto
	err := c.Bind(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	response, err := ctr.authSvc.Login(request)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return c.JSON(http.StatusNotFound, dto.ResponseBaseDto{
				ErrorMessage: err.Error(),
			})
		}

		if strings.Contains(err.Error(), "invalid") {
			return c.JSON(http.StatusForbidden, dto.ResponseBaseDto{
				ErrorMessage: err.Error(),
			})
		}

		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: response,
	})
}

func (ctr *AuthController) SendOTP(c echo.Context) error {
	var request dto.SendOTPDto

	err := c.Bind(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	err = ctr.authSvc.SendOTP(request.Email)
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

func (ctr *AuthController) Register(c echo.Context) error {
	var request dto.RegisterDto

	err := c.Bind(&request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	response, err := ctr.authSvc.Register(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ResponseBaseDto{
			ErrorMessage: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.ResponseBaseDto{
		Data: response,
	})
}
