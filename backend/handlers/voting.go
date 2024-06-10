package handlers

import (
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"net/http"
)

// GetCriteriaHandler handles the request to get voting criteria
func GetCriteriaHandler(w http.ResponseWriter, r *http.Request) {
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
	json.NewEncoder(w).Encode(criteria)
}

// GetParticipantsHandler handles the request to get participants of a game
func GetParticipantsHandler(w http.ResponseWriter, r *http.Request) {
	conn := database.GetDB()
	gameID := r.URL.Query().Get("gameId")
	if gameID == "" {
		http.Error(w, "gameId is required", http.StatusBadRequest)
		return
	}

	rows, err := conn.Query(context.Background(), `
		SELECT u.id, u.username
		FROM users u
		JOIN registrations r ON u.id = r.userId
		WHERE r.gameId = $1`, gameID)
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
	json.NewEncoder(w).Encode(participants)
}

// VoteHandler handles the request to submit votes
func VoteHandler(w http.ResponseWriter, r *http.Request) {
	var votes []models.Vote
	if err := json.NewDecoder(r.Body).Decode(&votes); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	conn := database.GetDB()

	for _, vote := range votes {
		_, err := conn.Exec(context.Background(), `
			INSERT INTO votes (gameId, voterId, participantId, criterionId)
			VALUES ($1, $2, $3, $4)`, vote.GameID, vote.VoterID, vote.ParticipantID, vote.CriterionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
