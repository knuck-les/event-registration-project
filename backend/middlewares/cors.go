package middlewares

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

// CORSMiddleware returns a Gin middleware that:
// - allows requests only from configured origins
// - allows credentials (cookies) to be sent
// - responds to preflight OPTIONS requests
func CORSMiddleware() gin.HandlerFunc {
    // Edit this list to include your frontend dev origin(s)
    allowedOrigins := []string{
        "http://localhost:5173", // Vite default
        "http://localhost:3000", // CRA default (if used)
    }

    // MaxAge in seconds (12 hours)
    const maxAge = 12 * 60 * 60 // 43200

    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")
        allowed := false
        for _, o := range allowedOrigins {
            if o == origin {
                allowed = true
                break
            }
        }

        // If the Origin is allowed, echo it back. Do NOT use "*" when allowing credentials.
        if allowed {
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
            // Tell caches that the response varies by Origin
            c.Writer.Header().Set("Vary", "Origin")
        }

        // Allow credentials so cookies (httpOnly) or other credentials can be sent
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

        // Allowed request headers and methods
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

        // Expose any headers the client might need
        c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")

        // How long the results of a preflight request can be cached (in seconds)
        c.Writer.Header().Set("Access-Control-Max-Age", "43200") // 12 hours

        // Respond to OPTIONS preflight quickly
        if c.Request.Method == http.MethodOptions {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}