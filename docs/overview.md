# Full-Stack Modular Project

This full-stack repository is organized into six independent modules, each representing a specific system layer. The structure follows modularity, separation of concerns, and multi-language architecture.

## Project Structure

- **`ui-components`** — Reusable React + Tailwind component library
- **`api`** — React application containing secure API wrapper
- **`service`** — Express.js microservice with validation + logging
- **`golang-basics`** — Four Go programs demonstrating core Go concepts
- **`logic-engine`** — Zero-dependency rule-evaluation engine
- **`data-layer`** — Unified storage wrapper for Node.js + Browser

---

## 1. ui-components

### Purpose
Component library with five reusable React components + demo preview.

### Tech Stack
- React 18
- Tailwind CSS
- Vite 5

### Important Files
- `Button.jsx` — Variants + styles
- `Input.jsx` — Validation-ready
- `Card.jsx` — Layout container
- `Modal.jsx` — Dialog component
- `ListRenderer.jsx` — Dynamic list renderer
- `App.jsx` — Preview UI

### Setup
```bash
cd ui-components
npm install
npm run dev

## 2. api

### Purpose
Demonstrates a secure API wrapper with **token injection**, **retry logic**, and **structured error handling**. Includes a form workflow that submits data to public APIs and displays responses.

### Tech Stack
- **React 18**
- **Vite** (Build tool)
- **JavaScript ES6+**
- **CSS** (Inline styles)

### Important Files
- `src/api/fetchWrapper.js` — Main API wrapper class with interceptors
- `src/components/FormComponent.jsx` — Form component with API integration
- `src/App.jsx` — Main application component
- `tests/wrapper-tests.md` — Test documentation
- `PROJECT_DAY2.md` — Project documentation

### Setup
```bash
cd api
npm install
npm run dev
# Server runs on http://localhost:5173

## 3. service

### Purpose
A simple Express.js backend illustrating **REST fundamentals**, **validation**, and **logging**.

### Tech Stack
- **Node.js**
- **Express.js**
- **Joi**

### Important Files
- `index.js` — Server setup
- `routes.js` — Endpoints + logging
- `validation.js` — Request validation
- `requests.log.json` — Log history

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service check |
| POST | `/submit` | Add new item |
| GET | `/items` | Fetch all items |
| GET | `/logs` | View logs |

### Setup
```bash
cd service
npm install
npm start

## 4. golang-basics

### Purpose
Four Go modules demonstrating **core features**: JSON, file operations, HTTP server, and combined logic.

### Tech Stack
- **Go 1.16+** (Standard Library)

### Components
- `json-parser/main.go` — **Struct → JSON + JSON → Struct**
- `file-ops/main.go` — **Read, write, append**
- `http-server/main.go` — **HTTP server** (port 8080)
- `summary.go` — **Combined server** (port 9090)

### Setup
```bash
cd golang-basics/json-parser
go run main.go

## 5. logic-engine

### Purpose
Standalone **rule engine** for evaluating input objects against **dynamic rules**.

### Highlights
- **Pure JavaScript** (no dependencies)
- **Threshold checks**, **keyword matches**, **custom logic**
- Returns **tags**, **alerts**, **execution metadata**

### Important Files
- `engine.js` — **Main class**
- `tests.json` — **Rule test cases**
- `test-runner.js` — **Automated testing**
- `example-usage.js` — **Usage example**

### Run
```bash
cd logic-engine
node test-runner.js 

## 6. data-layer

### Purpose
**Abstracted storage wrapper** for both **browser + Node.js** environments.

### Features
- **CRUD operations**
- **Node.js backend** uses JSON files
- **Browser** uses localStorage

### Important Files
- `storage.js` — **Core class**
- `sample-usage.md` — **Docs**
- `storage.test.js` — **Tests**
- `simple-test.html` — **Browser demo**

### Run Tests
```bash
cd data-layer
node storage.test.js