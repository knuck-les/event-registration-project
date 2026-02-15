package routes

import (
	"log"
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
	httpOnly := true

	// If the incoming request is over TLS, mark Secure=true and allow SameSite=None
	// (SameSite=None requires Secure=true in browsers). For local HTTP dev we use
	// SameSite=Lax so the cookie can be set without TLS.
	secure := false
	sameSite := http.SameSiteLaxMode
	if context.Request != nil && context.Request.TLS != nil {
		secure = true
		sameSite = http.SameSiteNoneMode
	}

	// Create cookie with explicit SameSite attribute
	cookie := &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Domain:   "", // optional: set if you need cross-subdomain cookies
		Expires:  time.Now().Add(time.Duration(maxAge) * time.Second),
		MaxAge:   maxAge,
		HttpOnly: httpOnly,
		Secure:   secure,
		SameSite: sameSite,
	}

	http.SetCookie(context.Writer, cookie)

	// Helpful debug log (remove in production): print human-readable SameSite
	sameSiteName := "Unknown"
	switch cookie.SameSite {
	case http.SameSiteDefaultMode:
		sameSiteName = "Default"
	case http.SameSiteLaxMode:
		sameSiteName = "Lax"
	case http.SameSiteStrictMode:
		sameSiteName = "Strict"
	case http.SameSiteNoneMode:
		sameSiteName = "None"
	}
	log.Printf("Set-Cookie: name=%s Secure=%v SameSite=%s\n", cookie.Name, cookie.Secure, sameSiteName)

	context.JSON(http.StatusOK, gin.H{"code": 200, "data": gin.H{"message": "Login successful!"}})
}
