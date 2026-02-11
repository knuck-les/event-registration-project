package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"
	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	fmt.Println("Connecting to DB with DSN:", os.Getenv("DB_HOST"))
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to open DB:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(" Failed to connect to DB:", err)
	}

	log.Println("Connected to AWS RDS (PostgreSQL)")

	// Set package-level DB so other code (models, migrations) can use it like the sqlite version does.
	DB = db

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	createTablesUsingPostgres()
	return db
}

func createTablesUsingPostgres() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);
	`

	if _, err := DB.Exec(createUsersTable); err != nil {
		panic("Could not create users table: " + err.Error())
	}

	createEventsTable := `
	CREATE TABLE IF NOT EXISTS events (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		location TEXT NOT NULL,
		dateTime TIMESTAMP NOT NULL,
		user_id INTEGER REFERENCES users(id)
	);
	`

	if _, err := DB.Exec(createEventsTable); err != nil {
		panic("Could not create events table: " + err.Error())
	}

	createRegistrationsTable := `
	CREATE TABLE IF NOT EXISTS registrations (
		id SERIAL PRIMARY KEY,
		event_id INTEGER REFERENCES events(id),
		user_id INTEGER REFERENCES users(id)
	);
	`

	if _, err := DB.Exec(createRegistrationsTable); err != nil {
		panic("Could not create registrations table: " + err.Error())
	}

	fmt.Println("all tables created")
}
