package storage

import (
    "errors"
    "sync"
    "backend/models"
)

var (
    games  = []models.Game{}
    gamesM sync.Mutex

    ErrGameFull     = errors.New("game is full")
    ErrGameNotFound = errors.New("game not found")
)

func GetAllGames() []models.Game {
    gamesM.Lock()
    defer gamesM.Unlock()

    return games
}

func JoinGame(gameID int) error {
    gamesM.Lock()
    defer gamesM.Unlock()

    for i := range games {
        if games[i].ID == gameID {
            if games[i].CurrentPlayers < games[i].NumberOfPlayers {
                games[i].CurrentPlayers++
                return nil
            } else {
                return ErrGameFull
            }
        }
    }

    return ErrGameNotFound
}