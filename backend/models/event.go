// package models

// import (
// 	"time"

// 	"example.com/rest-api/db"
// )

// type Event struct {
// 	ID          int64
// 	Name        string    `binding:"required"`
// 	Description string    `binding:"required"`
// 	Location    string    `binding:"required"`
// 	DateTime    time.Time `binding:"required"`
// 	UserID      int64
// }

// var events = []Event{}

// func (e *Event) Save() error {
// 	query := `
// 	INSERT INTO events(name, description, location, dateTime, user_id) 
// 	VALUES (?, ?, ?, ?, ?)`
// 	stmt, err := db.DB.Prepare(query)
// 	if err != nil {
// 		return err
// 	}
// 	defer stmt.Close()
// 	result, err := stmt.Exec(e.Name, e.Description, e.Location, e.DateTime, e.UserID)
// 	if err != nil {
// 		return err
// 	}
// 	id, err := result.LastInsertId()
// 	e.ID = id
// 	return err
// }

// func GetAllEvents() ([]Event, error) {
// 	query := "SELECT * FROM events"
// 	rows, err := db.DB.Query(query)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var events []Event

// 	for rows.Next() {
// 		var event Event
// 		err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)

// 		if err != nil {
// 			return nil, err
// 		}

// 		events = append(events, event)
// 	}

// 	return events, nil
// }

// func GetEventByID(id int64) (*Event, error) {
// 	query := "SELECT * FROM events WHERE id = ?"
// 	row := db.DB.QueryRow(query, id)

// 	var event Event
// 	err := row.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &event, nil
// }

// func (event Event) Update() error {
// 	query := `
// 	UPDATE events
// 	SET name = ?, description = ?, location = ?, dateTime = ?
// 	WHERE id = ?
// 	`
// 	stmt, err := db.DB.Prepare(query)

// 	if err != nil {
// 		return err
// 	}

// 	defer stmt.Close()

// 	_, err = stmt.Exec(event.Name, event.Description, event.Location, event.DateTime, event.ID)
// 	return err
// }

// func (event Event) Delete() error {
// 	query := "DELETE FROM events WHERE id = ?"
// 	stmt, err := db.DB.Prepare(query)

// 	if err != nil {
// 		return err
// 	}

// 	defer stmt.Close()

// 	_, err = stmt.Exec(event.ID)
// 	return err
// }

// func (e Event) Register(userId int64) error {
// 	query := "INSERT INTO registrations(event_id, user_id) VALUES (?, ?)"
// 	stmt, err := db.DB.Prepare(query)

// 	if err != nil {
// 		return err
// 	}

// 	defer stmt.Close()

// 	_, err = stmt.Exec(e.ID, userId)

// 	return err
// }

// func (e Event) CancelRegistration(userId int64) error {
// 	query := "DELETE FROM registrations WHERE event_id = ? AND user_id = ?"
// 	stmt, err := db.DB.Prepare(query)

// 	if err != nil {
// 		return err
// 	}

// 	defer stmt.Close()

// 	_, err = stmt.Exec(e.ID, userId)

// 	return err
// }

// func GetEventsForUser(userId int64) ([]Event, error) {
// 	query := `
// 	SELECT e.id, e.name, e.description, e.location, e.dateTime, e.user_id
// 	FROM events e
// 	INNER JOIN registrations r ON e.id = r.event_id
// 	WHERE r.user_id = ?`
// 	rows, err := db.DB.Query(query, userId)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var events []Event

// 	for rows.Next() {
// 		var event Event
// 		err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)

// 		if err != nil {
// 			return nil, err
// 		}

// 		events = append(events, event)
// 	}

// 	return events, nil
// }

package models

import (
    "time"

    "example.com/rest-api/db"
)

type Event struct {
    ID          int64
    Name        string    `binding:"required"`
    Description string    `binding:"required"`
    Location    string    `binding:"required"`
    DateTime    time.Time `binding:"required"`
    UserID      int64
}

// Save inserts the event into Postgres and sets e.ID to the generated id.
func (e *Event) Save() error {
    query := `
    INSERT INTO events (name, description, location, dateTime, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `

    // QueryRow + Scan returns the generated id
    if err := db.DB.QueryRow(query, e.Name, e.Description, e.Location, e.DateTime, e.UserID).Scan(&e.ID); err != nil {
        return err
    }

    return nil
}

func GetAllEvents() ([]Event, error) {
    query := `SELECT id, name, description, location, dateTime, user_id FROM events`
    rows, err := db.DB.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []Event
    for rows.Next() {
        var ev Event
        if err := rows.Scan(&ev.ID, &ev.Name, &ev.Description, &ev.Location, &ev.DateTime, &ev.UserID); err != nil {
            return nil, err
        }
        events = append(events, ev)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return events, nil
}

func GetEventByID(id int64) (*Event, error) {
    query := `SELECT id, name, description, location, dateTime, user_id FROM events WHERE id = $1`
    row := db.DB.QueryRow(query, id)

    var ev Event
    if err := row.Scan(&ev.ID, &ev.Name, &ev.Description, &ev.Location, &ev.DateTime, &ev.UserID); err != nil {
        return nil, err
    }

    return &ev, nil
}

func (event Event) Update() error {
    query := `
    UPDATE events
    SET name = $1, description = $2, location = $3, dateTime = $4
    WHERE id = $5
    `
    _, err := db.DB.Exec(query, event.Name, event.Description, event.Location, event.DateTime, event.ID)
    return err
}

func (event Event) Delete() error {
    query := "DELETE FROM events WHERE id = $1"
    _, err := db.DB.Exec(query, event.ID)
    return err
}

func (e Event) Register(userId int64) error {
    query := "INSERT INTO registrations (event_id, user_id) VALUES ($1, $2)"
    _, err := db.DB.Exec(query, e.ID, userId)
    return err
}

func (e Event) CancelRegistration(userId int64) error {
    query := "DELETE FROM registrations WHERE event_id = $1 AND user_id = $2"
    _, err := db.DB.Exec(query, e.ID, userId)
    return err
}

func GetEventsForUser(userId int64) ([]Event, error) {
    query := `
    SELECT e.id, e.name, e.description, e.location, e.dateTime, e.user_id
    FROM events e
    INNER JOIN registrations r ON e.id = r.event_id
    WHERE r.user_id = $1
    `
    rows, err := db.DB.Query(query, userId)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []Event
    for rows.Next() {
        var ev Event
        if err := rows.Scan(&ev.ID, &ev.Name, &ev.Description, &ev.Location, &ev.DateTime, &ev.UserID); err != nil {
            return nil, err
        }
        events = append(events, ev)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return events, nil
}
