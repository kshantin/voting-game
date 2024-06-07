package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"backend/database"
	"backend/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey []byte

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))
}

type Claims struct {
	UserID int `json:"userId"`
	jwt.StandardClaims
}

type Response struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
}

func getUserIDFromToken(r *http.Request) (int, error) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		return 0, fmt.Errorf("no token found")
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(
		tokenString,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		},
	)
	if err != nil || !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}

	return claims.UserID, nil
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

	conn := database.GetDB()

	var storedUser models.User
	err = conn.QueryRow(context.Background(), "SELECT id, email, username, password FROM users WHERE email=$1", creds.Email).
		Scan(
			&storedUser.ID,
			&storedUser.Email,
			&storedUser.Username,
			&storedUser.Password,
		)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(creds.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: storedUser.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Response{Message: "Login successful", Token: tokenString})
}
