package models

import "time"

type Game struct {
	ID              int       `json:"id"`
	GameName        string    `json:"gameName"`
	NumberOfPlayers int       `json:"numberOfPlayers"`
	CurrentPlayers  int       `json:"currentPlayers"`
	Description     string    `json:"description"`
	Date            time.Time `json:"date"`
	Time            time.Time `json:"time"`
	CreatedBy       int       `json:"createdBy"`
	CreatedAt       time.Time `json:"createdAt"`
}

type GameCreate struct {
	ID              int       `json:"id"`
	GameName        string    `json:"gameName"`
	NumberOfPlayers int       `json:"numberOfPlayers"`
	CurrentPlayers  int       `json:"currentPlayers"`
	Description     string    `json:"description"`
	Date            string    `json:"date"`
	Time            string    `json:"time"`
	CreatedBy       int       `json:"createdBy"`
	CreatedAt       time.Time `json:"createdAt"`
}
