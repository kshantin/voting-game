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
	userID, err := getUserIDFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var game models.GameCreate
	err = json.NewDecoder(r.Body).Decode(&game)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	date, err := time.Parse("2006-01-02", game.Date)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid date format: %v", err), http.StatusBadRequest)
		return
	}

	timeValue, err := time.Parse("15:04:05", game.Time)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid time format: %v", err), http.StatusBadRequest)
		return
	}

	game.Date = date.Format("2006-01-02")
	game.Time = timeValue.Format("15:04:05")
	game.CreatedBy = userID

	db := database.GetDB()
	_, err = db.Exec(context.Background(), "INSERT INTO games (gameName, numberOfPlayers, currentPlayers, description, date, time, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		game.GameName, game.NumberOfPlayers, game.CurrentPlayers, game.Description, game.Date, game.Time, game.CreatedBy)
	if err != nil {
		http.Error(w, fmt.Sprintf("Unable to create game: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Game created successfully"})
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
