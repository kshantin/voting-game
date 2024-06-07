package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend/database"
	"backend/models"
)

func CreateGameHandler(w http.ResponseWriter, r *http.Request) {
	var gameCreate models.GameCreate // отсюда получаем строки Data и Time

	err := json.NewDecoder(r.Body).Decode(&gameCreate)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Printf("Data: %v\n", gameCreate.Date)
	fmt.Printf("Time: %v\n", gameCreate.Time)

	date, err := time.Parse("2006-01-02", gameCreate.Date)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid date format: %v", err), http.StatusBadRequest)
		return
	}

	timeValue, err := time.Parse("15:04", gameCreate.Time)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid time format: %v", err), http.StatusBadRequest)
		return
	}

	// gameCreate.Date = date.Format("2006-01-02")
	// gameCreate.Time = timeValue.Format("15:04")

	fmt.Printf("date: %v qwer\n", date)
	fmt.Printf("timeValue: %v\n\n", timeValue)

	fmt.Printf("gameCreate.Date: %v qwer\n", gameCreate.Date)
	fmt.Printf("gameCreate.time: %v\n\n", gameCreate.Time)

	// gameDateTime := time.Date(
	// 	date.Year(),
	// 	date.Month(),
	// 	date.Day(),
	// 	timeValue.Hour(),
	// 	timeValue.Minute(),
	// 	0,
	// 	0,
	// 	date.Location(),
	// )

	// fmt.Printf("dateTime: %v", gameDateTime)
	conn := database.GetDB()
	_, err = conn.Exec(
		context.Background(),
		"INSERT INTO games (gameName, numberOfPlayers, currentPlayers, description, date, time, createdBy, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		gameCreate.GameName,
		gameCreate.NumberOfPlayers,
		gameCreate.CurrentPlayers,
		gameCreate.Description,
		date,
		timeValue,
		gameCreate.CreatedBy,
		time.Now(),
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Database insert error: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "game created"})
}

func GetGamesHandler(w http.ResponseWriter, r *http.Request) {
	conn := database.GetDB()
	rows, err := conn.Query(
		context.Background(),
		"SELECT id, gameName, numberOfPlayers, currentPlayers, description, date, time, createdBy, createdAt FROM games",
	)
	if err != nil {
		http.Error(w, fmt.Sprintf("Database query error: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var games []models.Game
	for rows.Next() {
		var game models.Game
		err := rows.Scan(
			&game.ID,
			&game.GameName,
			&game.NumberOfPlayers,
			&game.CurrentPlayers,
			&game.Description,
			&game.Date,
			&game.Time,
			&game.CreatedBy,
			&game.CreatedAt,
		)
		if err != nil {
			http.Error(
				w,
				fmt.Sprintf("Error scanning row: %v", err),
				http.StatusInternalServerError,
			)
			return
		}
		games = append(games, game)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, fmt.Sprintf("Row iteration error: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(games); err != nil {
		http.Error(w, fmt.Sprintf("JSON encoding error: %v", err), http.StatusInternalServerError)
	}
}

func JoinGameHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := getUserIDFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var reqBody struct {
		GameID int `json:"gameId"`
	}

	err = json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	conn := database.GetDB()

	var currentPlayers, numberOfPlayers int
	err = conn.QueryRow(context.Background(), "SELECT currentPlayers, numberOfPlayers FROM games WHERE id=$1", reqBody.GameID).
		Scan(&currentPlayers, &numberOfPlayers)
	if err == sql.ErrNoRows {
		http.Error(w, "Game not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if currentPlayers >= numberOfPlayers {
		http.Error(w, "Game is full", http.StatusConflict)
		return
	}

	_, err = conn.Exec(
		context.Background(),
		"UPDATE games SET currentPlayers = currentPlayers + 1 WHERE id=$1",
		reqBody.GameID,
	)
	if err != nil {
		http.Error(w, "Failed to join game", http.StatusInternalServerError)
		return
	}

	_, err = conn.Exec(
		context.Background(),
		"INSERT INTO registrations (userId, gameId) VALUES ($1, $2)",
		userID,
		reqBody.GameID,
	)
	if err != nil {
		http.Error(w, "Failed to register user for game", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
