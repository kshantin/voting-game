package models

type Game struct {
	ID              int    `json:"id"`
	GameName        string `json:"game_name"`
	NumberOfPlayers int    `json:"number_of_players"`
	CurrentPlayers  int    `json:"current_players"`
	Description     string `json:"description"`
	Date            string `json:"date"`
	Time            string `json:"time"`
	CreatedBy       int    `json:"created_by"`
}