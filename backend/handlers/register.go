package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"backend/database"
	"backend/models"

	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	// userID, err := getUserIDFromToken(r)
	// if err != nil {
	// 	http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
	// 	return
	// }
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	userTest := models.User{
		ID:       2,
		Email:    "oleg@mail.ru",
		Username: "oleg",
		Password: "1234",
	}

	// Хэширование пароля
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	hashedPasswordTest, _ := bcrypt.GenerateFromPassword(
		[]byte(userTest.Password),
		bcrypt.DefaultCost,
	)

	user.Password = string(hashedPassword)
	userTest.Password = string(hashedPasswordTest)

	// Подключение к базе данных
	conn := database.GetDB()

	// Вставка нового пользователя
	_, err = conn.Exec(context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		user.ID, user.Email, user.Username, user.Password, time.Now())

	if err != nil {
		log.Printf("Error inserting user into database: %v", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}
	// Тестовый пользователь
	_, err = conn.Exec(context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		userTest.ID, userTest.Email, userTest.Username, userTest.Password, time.Now())

	if err != nil {
		log.Printf("Error inserting user into database: %v", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	log.Printf("User registered successfully: %v", user.Email)
	log.Printf("TEST User registered successfully: %v", userTest.Email)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}
