package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"backend/database"
	"backend/models"
)

// Получить критерии голосования
func GetCriteria(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for criteria")

	conn := database.GetDB()
	rows, err := conn.Query(context.Background(), "SELECT id, name FROM criteria")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var criteria []models.Criterion
	for rows.Next() {
		var criterion models.Criterion
		if err := rows.Scan(&criterion.ID, &criterion.Name); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		criteria = append(criteria, criterion)
	}

	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(criteria)
	fmt.Println("Sending criteria response:", string(response)) // Логирование отправляемого JSON
	w.Write(response)
}

// Получить участников игры
func GetParticipants(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for participants")
	gameId := r.URL.Query().Get("gameId")

	fmt.Println("Game ID:", gameId)
	conn := database.GetDB()
	rows, err := conn.Query(
		context.Background(),
		"SELECT id, username FROM users WHERE id IN (SELECT userId FROM registrations WHERE gameId=$1)",
		gameId,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var participants []models.Participant
	for rows.Next() {
		var participant models.Participant
		if err := rows.Scan(&participant.ID, &participant.Username); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		participants = append(participants, participant)
	}

	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(participants)
	fmt.Println(
		"Sending participants response:",
		string(response),
	) // Логирование отправляемого JSON
	w.Write(response)
}

// Принять голос
func SubmitVote(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request for submitting votes")

	var votes []models.Vote
	if err := json.NewDecoder(r.Body).Decode(&votes); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	conn := database.GetDB()
	for _, vote := range votes {
		_, err := conn.Exec(
			context.Background(),
			"INSERT INTO votes (gameId, voterId, participantId, criterionId) VALUES ($1, $2, $3, $4)",
			vote.GameID,
			vote.VoterID,
			vote.ParticipantID,
			vote.CriterionID,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Println("Votes submitted successfully")
}
