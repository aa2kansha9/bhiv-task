package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	// Define routes
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/time", timeHandler)
	http.HandleFunc("/data", dataHandler)

	// Start the server
	port := ":8080"
	fmt.Printf("Starting HTTP server on port %s\n", port)
	fmt.Printf("Open your browser and visit:\n")
	fmt.Printf("  http://localhost%s\n", port)
	fmt.Printf("  http://localhost%s/hello\n", port)
	fmt.Printf("  http://localhost%s/time\n", port)
	fmt.Printf("  http://localhost%s/data\n", port)
	fmt.Println("Press Ctrl+C to stop the server")

	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	html := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Go HTTP Server</title>
		<style>
			body { font-family: Arial, sans-serif; margin: 40px; }
			h1 { color: #333; }
			li { margin: 10px 0; }
			a { color: #0066cc; text-decoration: none; }
			a:hover { text-decoration: underline; }
		</style>
	</head>
	<body>
		<h1>Welcome to Go HTTP Server</h1>
		<p>Available endpoints:</p>
		<ul>
			<li><a href="/hello">/hello</a> - Simple greeting</li>
			<li><a href="/time">/time</a> - Current server time</li>
			<li><a href="/data">/data</a> - JSON data</li>
		</ul>
	</body>
	</html>
	`
	fmt.Fprint(w, html)
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "Guest"
	}
	fmt.Fprintf(w, "Hello, %s! Welcome to the Go HTTP server.", name)
}

func timeHandler(w http.ResponseWriter, r *http.Request) {
	currentTime := time.Now().Format("Monday, January 2, 2006 15:04:05 MST")
	fmt.Fprintf(w, "Current server time: %s", currentTime)
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
	// Set content type to JSON
	w.Header().Set("Content-Type", "application/json")
	
	jsonData := `{
		"status": "success",
		"message": "Data from Go server",
		"timestamp": "` + time.Now().Format(time.RFC3339) + `",
		"endpoints": [
			"/",
			"/hello",
			"/time",
			"/data"
		]
	}`
	
	fmt.Fprint(w, jsonData)
}