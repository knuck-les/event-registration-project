package main

import (
	"log"

	"example.com/rest-api/db"
	"example.com/rest-api/middlewares"
	"example.com/rest-api/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// db.InitDB()
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	database := db.Connect()

	if database != nil {
		log.Println("Database connection established successfully.")
	}
	server := gin.Default()
	server.Use(middlewares.CORSMiddleware())
	routes.RegisterRoutes(server)

	server.Run(":8080") // localhost:8080
}
