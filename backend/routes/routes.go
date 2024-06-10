package routes

import (
	"backend/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/profile", handlers.GetUserProfileHandler).Methods("GET")
	r.HandleFunc("/api/games", handlers.CreateGameHandler).Methods("POST")
	r.HandleFunc("/api/games", handlers.GetGamesHandler).Methods("GET")
	r.HandleFunc("/api/games/join", handlers.JoinGameHandler).Methods("POST")
	// r.HandleFunc("/api/players", handlers.GetPlayers).Methods("GET")
	r.HandleFunc("/api/voting/criteria", handlers.GetCriteriaHandler).Methods("GET")
	r.HandleFunc("/api/voting/participants", handlers.GetParticipantsHandler).Methods("GET")
	r.HandleFunc("/api/voting/vote", handlers.VoteHandler).Methods("POST")

	// Здесь можно добавить больше маршрутов и обработчиков2
	return r
}
