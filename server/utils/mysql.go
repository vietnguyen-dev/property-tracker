package utils

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func MySql() *sql.DB {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	fmt.Println(os.Getenv("user"))
	// Path to your CA certificate file
	caCertPath := "cert/ca-certificate.crt" // <-- update this path

	// Load CA cert
	caCert, err := ioutil.ReadFile(caCertPath)
	if err != nil {
		fmt.Println("Error reading CA cert:", err)
		return nil
	}

	// Create a cert pool and add the CA cert
	rootCAs := x509.NewCertPool()
	if ok := rootCAs.AppendCertsFromPEM(caCert); !ok {
		fmt.Println("Failed to append CA cert")
		return nil
	}

	// Register TLS config with a name, e.g., "digitalocean"
	tlsConfig := &tls.Config{
		RootCAs: rootCAs,
	}

	err = mysql.RegisterTLSConfig("digitalocean", tlsConfig)
	if err != nil {
		fmt.Println("Error registering TLS config:", err)
		return nil
	}

	// Build DSN with tls=digitalocean
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?tls=digitalocean",
		os.Getenv("username"),
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
