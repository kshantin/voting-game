package routes

import (
	"backend/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()
	//auth and register
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	// profile page
	r.HandleFunc("/api/profile", handlers.GetUserProfileHandler).Methods("GET")
	r.HandleFunc("/api/voting/votes", handlers.GetVotesHandler).Methods("GET")
	// gameHandler
	r.HandleFunc("/api/games", handlers.CreateGameHandler).Methods("POST")
	r.HandleFunc("/api/games", handlers.GetGamesHandler).Methods("GET")
	r.HandleFunc("/api/games/{gameId}", handlers.GetGameHandler).Methods("GET")
	r.HandleFunc("/api/games/join", handlers.JoinGameHandler).Methods("POST")
	// voting
	r.HandleFunc("/api/voting/criteria", handlers.GetCriteria).Methods("GET")
	r.HandleFunc("/api/voting/participants", handlers.GetParticipants).Methods("GET")
	r.HandleFunc("/api/voting/vote", handlers.SubmitVote).Methods("POST")
	r.HandleFunc("/api/voting/status", handlers.GetVotingStatus).Methods("GET")
	r.HandleFunc("/api/voting/close", handlers.CloseVoting).Methods("POST")

	return r
}
