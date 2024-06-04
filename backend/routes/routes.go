package routes

import (
	"github.com/gorilla/mux"
	"backend/handlers"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	// Здесь можно добавить больше маршрутов и обработчиков
	return r
}
