package utils

import (
	"database/sql"
	"fmt"
	"os"
)

func MySql() *sql.DB {
	// Build DSN with tls=custom
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?tls=digitalocean",
		os.Getenv("user"),
		os.Getenv("password"),
		os.Getenv("host"),
		os.Getenv("port"),
		os.Getenv("database"),
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println("Error opening database:", err)
		return nil
	}

	// Test connection
	if err := db.Ping(); err != nil {
		fmt.Println("Unable to ping database:", err)
		return nil
	}

	fmt.Println("Connected successfully with SSL!")
	return db
}
