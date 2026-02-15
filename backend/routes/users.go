package routes

import (
	"net/http"
	"time"

	"example.com/rest-api/models"
	"example.com/rest-api/utils"
	"github.com/gin-gonic/gin"
)

func signup(context *gin.Context) {
	var user models.User

	err := context.ShouldBindJSON(&user)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
		return
	}

	err = user.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save user."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"code": 200, "data": gin.H{"message": "User created successfully"}})
}

func login(context *gin.Context) {
	var user models.User

	err := context.ShouldBindJSON(&user)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
		return
	}

	err = user.ValidateCredentials()

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Could not authenticate user."})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user."})
		return
	}

	maxAge := 7 * 24 * 60 * 60
	secure := false
	if r := context.Request; r != nil {
	if r.TLS != nil || r.Header.Get("X-Forwarded-Proto") == "https" {
		secure = true
	}
	}
	sameSite := http.SameSiteLaxMode
	if secure { sameSite = http.SameSiteNoneMode }

	cookie := &http.Cookie{
	Name:     "token",
	Value:    token,
	Path:     "/",
	Expires:  time.Now().Add(time.Duration(maxAge) * time.Second),
	MaxAge:   maxAge,
	HttpOnly: true,
	Secure:   secure,
	SameSite: sameSite,
	}
	http.SetCookie(context.Writer, cookie)

	context.JSON(http.StatusOK, gin.H{"code": 200, "data": gin.H{"message": "Login successful!"}})
}
