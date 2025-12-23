package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	// File writing
	content := "Hello, Go File Operations!\nThis is a test file.\n"
	
	// Write to a file
	err := ioutil.WriteFile("example.txt", []byte(content), 0644)
	if err != nil {
		log.Fatal("Error writing file:", err)
	}
	fmt.Println("File 'example.txt' written successfully!")

	// File reading
	data, err := ioutil.ReadFile("example.txt")
	if err != nil {
		log.Fatal("Error reading file:", err)
	}
	fmt.Printf("\nFile content:\n%s", string(data))

	// Append to file
	f, err := os.OpenFile("example.txt", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal("Error opening file for appending:", err)
	}
	defer f.Close()

	if _, err := f.WriteString("This line was appended.\n"); err != nil {
		log.Fatal("Error appending to file:", err)
	}
	fmt.Println("\nText appended to file!")

	// Read again to show appended content
	data, err = ioutil.ReadFile("example.txt")
	if err != nil {
		log.Fatal("Error reading file after append:", err)
	}
	fmt.Printf("\nUpdated file content:\n%s", string(data))

	// File information
	fileInfo, err := os.Stat("example.txt")
	if err != nil {
		log.Fatal("Error getting file info:", err)
	}
	fmt.Printf("\nFile information:\n")
	fmt.Printf("Name: %s\n", fileInfo.Name())
	fmt.Printf("Size: %d bytes\n", fileInfo.Size())
	fmt.Printf("Modified: %s\n", fileInfo.ModTime())
}