package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDB() (*gorm.DB, error) {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		host,
		user,
		password,
		dbName,
		port,
	)

	var db *gorm.DB
	var err error
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("Attempt %d: Unable to connect to database: %v", i+1, err)
			time.Sleep(2 * time.Second)
			continue
		}

		sqlDB, err := db.DB()
		if err == nil {
			break
		}

		err = sqlDB.Ping()
		if err == nil {
			break
		}

		log.Printf("Attempt %d: Unable to connect to database: %v", i+1, err)
		time.Sleep(2 * time.Second)
	}

	if db != nil {
		db = db.Debug()
	}

	return db, err
}
