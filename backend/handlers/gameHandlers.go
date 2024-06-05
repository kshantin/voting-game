package handlers

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "time"
    "strconv"
    
    "backend/database"
    "backend/models"
)

func CreateGameHandler(w http.ResponseWriter, r *http.Request) {
    userID, err := getUserIDFromToken(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    var game models.Game
    err = json.NewDecoder(r.Body).Decode(&game)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    date, err := time.Parse("2006-01-02", game.Date)
    if err != nil {
        http.Error(w, fmt.Sprintf("Invalid date format: %v", err), http.StatusBadRequest)
        return
    }

    timeValue, err := time.Parse("15:04:05", game.Time)
    if err != nil {
        http.Error(w, fmt.Sprintf("Invalid time format: %v", err), http.StatusBadRequest)
        return
    }

    game.Date = date.Format("2006-01-02")
    game.Time = timeValue.Format("15:04:05")
    game.CreatedBy = userID

    db := database.GetDB()
    _, err = db.Exec(context.Background(), "INSERT INTO games (game_name, number_of_players, current_players, description, date, time, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        game.GameName, game.NumberOfPlayers, game.CurrentPlayers, game.Description, game.Date, game.Time, game.CreatedBy)
    if err != nil {
        http.Error(w, fmt.Sprintf("Unable to create game: %v", err), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Game created successfully"})
}


func GetGamesHandler(w http.ResponseWriter, r *http.Request) {
    conn := database.GetDB()
    rows, err := conn.Query(context.Background(), "SELECT id, game_name, number_of_players, current_players, description, date, time, created_by, created_at FROM games")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var games []models.Game
    for rows.Next() {
        var game models.Game
        err := rows.Scan(&game.ID, &game.GameName, &game.NumberOfPlayers, &game.CurrentPlayers, &game.Description, &game.Date, &game.Time, &game.CreatedBy)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        games = append(games, game)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(games)
}

func JoinGameHandler(w http.ResponseWriter, r *http.Request) {
    userID := r.FormValue("user_id")
    gameID := r.FormValue("game_id")

    userIDInt, err := strconv.Atoi(userID)
    if err != nil {
        http.Error(w, "Invalid user_id", http.StatusBadRequest)
        return
    }

    gameIDInt, err := strconv.Atoi(gameID)
    if err != nil {
        http.Error(w, "Invalid game_id", http.StatusBadRequest)
        return
    }

    conn := database.GetDB()

    var currentPlayers, numberOfPlayers int
    err = conn.QueryRow(context.Background(), "SELECT current_players, number_of_players FROM games WHERE id=$1", gameIDInt).Scan(&currentPlayers, &numberOfPlayers)
    if err != nil {
        http.Error(w, "Game not found", http.StatusNotFound)
        return
    }

    if currentPlayers >= numberOfPlayers {
        http.Error(w, "Game is full", http.StatusConflict)
        return
    }

    _, err = conn.Exec(context.Background(), "UPDATE games SET current_players = current_players + 1 WHERE id=$1", gameIDInt)
    if err != nil {
        http.Error(w, "Failed to join game", http.StatusInternalServerError)
        return
    }

    _, err = conn.Exec(context.Background(), "INSERT INTO registrations (user_id, game_id) VALUES ($1, $2)", userIDInt, gameIDInt)
    if err != nil {
        http.Error(w, "Failed to register user for game", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}
