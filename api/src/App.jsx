import React from 'react';
import './App.css';
import FormComponent from './components/FormComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>API Wrapper & Form Workflow - Day 2</h1>
        <p>Testing secure API wrapper with retry logic and token injection</p>
      </header>
      
      <main>
        <div className="container">
          <div className="instructions">
            <h2>Project Overview</h2>
            <p>This demonstrates a secure API wrapper with:</p>
            <ul>
              <li>✅ Automatic token injection</li>
              <li>✅ Error handling with retry logic (3 attempts)</li>
              <li>✅ Exponential backoff on failures</li>
              <li>✅ Support for GET, POST, PUT, DELETE methods</li>
              <li>✅ Form submission workflow</li>
            </ul>
          </div>
          
          <FormComponent />
          
          <div className="wrapper-info">
            <h3>FetchWrapper Features:</h3>
            <ul>
              <li><strong>Retry Logic:</strong> Automatically retries failed requests (except 4xx errors)</li>
              <li><strong>Token Management:</strong> Automatically injects Bearer tokens</li>
              <li><strong>Error Handling:</strong> Comprehensive error catching and reporting</li>
              <li><strong>Flexible:</strong> Works with any REST API</li>
              <li><strong>Type Safe:</strong> Handles both JSON and text responses</li>
            </ul>
            
            <h4>Testing Instructions:</h4>
            <ol>
              <li>Open browser Developer Tools (F12)</li>
              <li>Go to Console tab to see retry attempts</li>
              <li>Submit form to test POST request</li>
              <li>Click "Test GET Request" to test GET</li>
              <li>Try disabling internet to see error handling</li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer>
        <p>Check <code>src/api/fetchWrapper.js</code> for the wrapper implementation</p>
        <p>View test documentation in <code>tests/wrapper-tests.md</code></p>
      </footer>
    </div>
  );
}

export default App;