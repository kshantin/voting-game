package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "time"
    "backend/models"
    "backend/database"
    "golang.org/x/crypto/bcrypt"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
    var user models.User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Хэширование пароля
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Failed to hash password", http.StatusInternalServerError)
        return
    }
    user.Password = string(hashedPassword)

    // Подключение к базе данных
    conn := database.GetDB()

    // Вставка нового пользователя
    _, err = conn.Exec(context.Background(),
        "INSERT INTO users (email, username, password, created_at) VALUES ($1, $2, $3, $4)",
        user.Email, user.Username, user.Password, time.Now())

    if err != nil {
        http.Error(w, "Failed to register user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}