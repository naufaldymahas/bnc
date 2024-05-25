package controller

import (
	"strings"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/naufaldymahas/bnc/api/dto"
)

func jwtMiddlewareConfig() echojwt.Config {
	return echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(dto.JwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
}

func getAccessToken(c echo.Context) string {
	authorization := c.Request().Header.Get("Authorization")

	return strings.ReplaceAll(authorization, "Bearer ", "")
}
