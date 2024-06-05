package routes

import (
	"github.com/gorilla/mux"
	"backend/handlers"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
    r.HandleFunc("/api/games", handlers.CreateGameHandler).Methods("POST")
    r.HandleFunc("/api/games", handlers.GetGamesHandler).Methods("GET")
    r.HandleFunc("/api/games/join", handlers.JoinGameHandler).Methods("POST")
	// Здесь можно добавить больше маршрутов и обработчиков2
	return r
}
