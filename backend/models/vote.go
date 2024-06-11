package models

import "time"

type Criterion struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Participant struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
}

// Vote represents a single vote
type Vote struct {
	GameID        int       `json:"gameId"`
	VoterID       int       `json:"voterId"`
	ParticipantID int       `json:"participantId"`
	CriterionID   int       `json:"criterionId"`
	CreatedAt     time.Time `json:"createdAt"`
}
