package handlers

import (
	"encoding/json"
	"net/http"
	"backend/models"
)

type Response struct {
	Message string `json:"message"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds models.Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// Замените на вашу логику проверки учетных данных
	if creds.Email == "test@example.com" && creds.Password == "password123" {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Response{Message: "Login successful"})
	} else {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
	}
}
