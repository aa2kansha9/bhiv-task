package main

import (
	"encoding/json"
	"fmt"
	"log"
)

// Define a struct to match the JSON structure
type Person struct {
	Name    string `json:"name"`
	Age     int    `json:"age"`
	City    string `json:"city"`
	Country string `json:"country"`
}

func main() {
	// Example JSON string
	jsonStr := `{"name":"Alice","age":30,"city":"New York","country":"USA"}`

	// Parse JSON into Person struct
	var person Person
	err := json.Unmarshal([]byte(jsonStr), &person)
	if err != nil {
		log.Fatal("Error parsing JSON:", err)
	}

	// Print the parsed data
	fmt.Printf("Parsed JSON:\n")
	fmt.Printf("Name: %s\n", person.Name)
	fmt.Printf("Age: %d\n", person.Age)
	fmt.Printf("City: %s\n", person.City)
	fmt.Printf("Country: %s\n", person.Country)

	// Convert struct back to JSON
	jsonData, err := json.MarshalIndent(person, "", "  ")
	if err != nil {
		log.Fatal("Error converting to JSON:", err)
	}

	fmt.Printf("\nConverted back to JSON:\n%s\n", string(jsonData))
}