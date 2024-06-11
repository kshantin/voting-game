package routes

import (
	"backend/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	// profile page
	r.HandleFunc("/api/profile", handlers.GetUserProfileHandler).Methods("GET")
	r.HandleFunc("/api/voting/votes", handlers.GetVotesHandler).Methods("GET")

	r.HandleFunc("/api/games", handlers.CreateGameHandler).Methods("POST")
	r.HandleFunc("/api/games", handlers.GetGamesHandler).Methods("GET")
	r.HandleFunc("/api/games/join", handlers.JoinGameHandler).Methods("POST")

	r.HandleFunc("/api/voting/criteria", handlers.GetCriteria).Methods("GET")
	r.HandleFunc("/api/voting/participants", handlers.GetParticipants).Methods("GET")
	r.HandleFunc("/api/voting/vote", handlers.SubmitVote).Methods("POST")

	// Здесь можно добавить больше маршрутов и обработчиков2
	return r
}
