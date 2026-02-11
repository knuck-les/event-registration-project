// package models

// import (
// 	"errors"

// 	"example.com/rest-api/db"
// 	"example.com/rest-api/utils"
// )

// type User struct {
// 	ID       int64
// 	Email    string `binding:"required"`
// 	Password string `binding:"required"`
// }

// func (u User) Save() error {
// 	query := "INSERT INTO users(email, password) VALUES (?, ?)"
// 	stmt, err := db.DB.Prepare(query)

// 	if err != nil {
// 		return err
// 	}

// 	defer stmt.Close()

// 	hashedPassword, err := utils.HashPassword(u.Password)

// 	if err != nil {
// 		return err
// 	}

// 	result, err := stmt.Exec(u.Email, hashedPassword)

// 	if err != nil {
// 		return err
// 	}

// 	userId, err := result.LastInsertId()

// 	u.ID = userId
// 	return err
// }

// func (u *User) ValidateCredentials() error {
// 	query := "SELECT id, password FROM users WHERE email = ?"
// 	row := db.DB.QueryRow(query, u.Email)

// 	var retrievedPassword string
// 	err := row.Scan(&u.ID, &retrievedPassword)

// 	if err != nil {
// 		return errors.New("Credentials invalid")
// 	}

// 	passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)

// 	if !passwordIsValid {
// 		return errors.New("Credentials invalid")
// 	}

// 	return nil
// }

package models

import (
    "database/sql"
    "errors"
    "fmt"

    "example.com/rest-api/db"
    "example.com/rest-api/utils"

    "github.com/lib/pq"
)

type User struct {
    ID       int64
    Email    string `binding:"required"`
    Password string `binding:"required"`
}

// Save inserts the user into Postgres and fills u.ID with the generated id.
// Uses RETURNING id because LastInsertId is not supported by Postgres drivers.
func (u *User) Save() error {
    // Hash the password first
    hashedPassword, err := utils.HashPassword(u.Password)
    if err != nil {
        return err
    }

    query := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`
    // QueryRow + Scan will return the generated id into u.ID
    if err := db.DB.QueryRow(query, u.Email, hashedPassword).Scan(&u.ID); err != nil {
        // Optional: detect unique constraint violation for friendly error
        if pgErr, ok := err.(*pq.Error); ok {
            if pgErr.Code == "23505" { // unique_violation
                return fmt.Errorf("email already exists")
            }
        }
        return err
    }

    return nil
}

// ValidateCredentials looks up the user by email and compares hashed passwords.
// Expects u.Password to contain the plaintext password to validate.
// On success u.ID will be set to the found user's id.
func (u *User) ValidateCredentials() error {
    query := `SELECT id, password FROM users WHERE email = $1`
    row := db.DB.QueryRow(query, u.Email)

    var retrievedPassword string
    err := row.Scan(&u.ID, &retrievedPassword)
    if err != nil {
        if err == sql.ErrNoRows {
            return errors.New("credentials invalid")
        }
        return err
    }

    passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)
    if !passwordIsValid {
        return errors.New("credentials invalid")
    }

    return nil
}
