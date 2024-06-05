package database

import (
    "context"
    "fmt"
    "log"
    "os"
    "github.com/jackc/pgx/v4/pgxpool"
)

var db *pgxpool.Pool

func InitDB() {
    url := os.Getenv("DATABASE_URL")
    if url == "" {
        log.Fatal("DATABASE_URL environment variable is required but not set")
    }

    var err error
    db, err = pgxpool.Connect(context.Background(), url)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }

    err = db.Ping(context.Background())
    if err != nil {
        log.Fatalf("Unable to ping database: %v\n", err)
    }

    fmt.Println("Database connected!")
}

func GetDB() *pgxpool.Pool {
    return db
}
