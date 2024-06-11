package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"backend/database"
	"backend/models"
)

func GetUserProfileHandler(w http.ResponseWriter, r *http.Request) {
	// Получение userID из токена
	userID, err := getUserIDFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	conn := database.GetDB()
	// Получение информации о пользователе
	var user models.GetUser
	err = conn.QueryRow(context.Background(),
		"SELECT id, email, username, createdat FROM users WHERE id=$1", userID).Scan(
		&user.ID, &user.Email, &user.Username, &user.CreatedAt)
	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Error fetching user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Получение игр, на которые записан пользователь
	rows, err := conn.Query(
		context.Background(),
		`SELECT g.id, g.gameName, g.date, g.time FROM games g JOIN registrations r ON g.id = r.gameId WHERE r.userId=$1`,
		userID,
	)
	if err != nil {
		http.Error(w, "Error fetching games: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var games []models.GameGet
	for rows.Next() {
		var game models.GameGet
		err := rows.Scan(&game.ID, &game.GameName, &game.Date, &game.Time)
		if err != nil {
			http.Error(w, "Error scanning game: "+err.Error(), http.StatusInternalServerError)
			return
		}

		games = append(games, game)
	}
	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating over games: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Подсчет количества игр
	gameCount := len(games)

	// Формирование ответа
	profile := models.Profile{
		User:      user,
		GameCount: gameCount,
		Games:     games,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(profile)
	if err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func GetVotesHandler(w http.ResponseWriter, r *http.Request) {
	gameIds := r.URL.Query().Get("gameIds")
	if gameIds == "" {
		http.Error(w, "Missing gameIds parameter", http.StatusBadRequest)
		return
	}

	conn := database.GetDB()
	ids := strings.Split(gameIds, ",")

	query := `
		SELECT v.gameId, v.voterId, v.participantId, v.criterionId, v.createdAt
		FROM votes v
		WHERE v.gameId = ANY($1)
	`
	rows, err := conn.Query(context.Background(), query, ids)
	if err != nil {
		http.Error(w, "Error fetching votes: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var votes []models.Vote
	for rows.Next() {
		var vote models.Vote
		err := rows.Scan(
			&vote.GameID,
			&vote.VoterID,
			&vote.ParticipantID,
			&vote.CriterionID,
			&vote.CreatedAt,
		)
		if err != nil {
			http.Error(w, "Error scanning vote: "+err.Error(), http.StatusInternalServerError)
			return
		}
		votes = append(votes, vote)
	}
	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating over votes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(votes)
	if err != nil {
		http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
