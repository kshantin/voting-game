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
	userTestOleg := models.User{
		ID:       2,
		Email:    "oleg@mail.ru",
		Username: "Oleg",
		Password: "1234",
	}
	userTestMisha := models.User{
		ID:       3,
		Email:    "misha@mail.ru",
		Username: "Misha",
		Password: "1234",
	}
	userTestAnton := models.User{
		ID:       4,
		Email:    "anton@mail.ru",
		Username: "Anton",
		Password: "1234",
	}
	userTestJenia := models.User{
		ID:       5,
		Email:    "jenia@mail.ru",
		Username: "Jenia",
		Password: "1234",
	}

	// Хэширование пароля
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	hashedPasswordTestOleg, _ := bcrypt.GenerateFromPassword(
		[]byte(userTestOleg.Password),
		bcrypt.DefaultCost,
	)
	hashedPasswordTestMisha, _ := bcrypt.GenerateFromPassword(
		[]byte(userTestMisha.Password),
		bcrypt.DefaultCost,
	)
	hashedPasswordTestAnton, _ := bcrypt.GenerateFromPassword(
		[]byte(userTestAnton.Password),
		bcrypt.DefaultCost,
	)
	hashedPasswordTestJenia, _ := bcrypt.GenerateFromPassword(
		[]byte(userTestJenia.Password),
		bcrypt.DefaultCost,
	)

	user.Password = string(hashedPassword)
	userTestOleg.Password = string(hashedPasswordTestOleg)
	userTestMisha.Password = string(hashedPasswordTestMisha)
	userTestAnton.Password = string(hashedPasswordTestAnton)
	userTestJenia.Password = string(hashedPasswordTestJenia)

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
	conn.Exec(
		context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		userTestOleg.ID,
		userTestOleg.Email,
		userTestOleg.Username,
		userTestOleg.Password,
		time.Now(),
	)
	conn.Exec(
		context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		userTestMisha.ID,
		userTestMisha.Email,
		userTestMisha.Username,
		userTestMisha.Password,
		time.Now(),
	)
	conn.Exec(
		context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		userTestAnton.ID,
		userTestAnton.Email,
		userTestAnton.Username,
		userTestAnton.Password,
		time.Now(),
	)
	conn.Exec(
		context.Background(),
		"INSERT INTO users (id, email, username, password, createdAt) VALUES ($1, $2, $3, $4, $5)",
		userTestJenia.ID,
		userTestJenia.Email,
		userTestJenia.Username,
		userTestJenia.Password,
		time.Now(),
	)

	if err != nil {
		log.Printf("Error inserting user into database: %v", err)
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	log.Printf("User registered successfully: %v", user.Email)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}
