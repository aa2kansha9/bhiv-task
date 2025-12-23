package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// Struct for our data
type SummaryData struct {
	ProgramsCompleted []string  `json:"programs_completed"`
	Timestamp         string    `json:"timestamp"`
	Message           string    `json:"message"`
}

func main() {
	fmt.Println("=== Go Fundamentals Summary ===")
	
	// 1. File Operation - Write summary to file
	summary := SummaryData{
		ProgramsCompleted: []string{
			"JSON Parser",
			"File Read/Write Operations", 
			"Simple HTTP Server",
		},
		Timestamp: time.Now().Format(time.RFC3339),
		Message:   "Successfully completed all 3 Go programs!",
	}
	
	// 2. JSON Operation - Convert struct to JSON
	jsonData, err := json.MarshalIndent(summary, "", "  ")
	if err != nil {
		log.Fatal("JSON marshaling error:", err)
	}
	
	// Write JSON to file
	err = ioutil.WriteFile("summary.json", jsonData, 0644)
	if err != nil {
		log.Fatal("File write error:", err)
	}
	fmt.Println("1. Created summary.json file")
	
	// Read and display the file
	data, err := ioutil.ReadFile("summary.json")
	if err != nil {
		log.Fatal("File read error:", err)
	}
	fmt.Printf("2. File content:\n%s\n", string(data))
	
	// 3. Start a simple HTTP server to serve this file
	fmt.Println("3. Starting HTTP server on port 9090...")
	fmt.Println("   Visit http://localhost:9090/summary")
	
	http.HandleFunc("/summary", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
	})
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		html := `<h1>Go Summary Server</h1>
		<p><a href="/summary">View JSON Summary</a></p>
		<p>Programs completed: JSON Parser, File Ops, HTTP Server</p>`
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, html)
	})
	
	fmt.Println("\nPress Ctrl+C to stop the server")
	log.Fatal(http.ListenAndServe(":9090", nil))
}