# File Upload & Malware Scanning App

This project is a full-stack application that allows users to upload files for malware scanning. The backend accepts files, stores metadata, simulates malware scanning in the background, and provides APIs to query scan status. The frontend provides an intuitive UI to upload files, monitor scan progress, and view scan results.

---

## Features

- **File Upload API** supporting `.pdf`, `.docx`, `.jpg`, `.png` files up to 5MB.
- Stores uploaded files locally in `/uploads` directory.
- Saves file metadata (filename, path, status, timestamps, result) in MongoDB.
- Background worker simulates malware scanning by checking file content for dangerous keywords.
- Scan statuses: `pending`, `scanned` with results `clean` or `infected`.
- Frontend React app:
  - Drag & drop or file input upload modal with progress indicator.
  - Dashboard displaying uploaded files with scan status and timestamps.
  - Filters by status and scan result.
  - Color-coded statuses.
  - Toast notifications on scan completion.
- Optional webhook or Slack alerts for infected files (can be extended).

---

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript, MongoDB, RabbitMQ (or custom queue), Multer
- **Frontend:** React, TypeScript, Tailwind CSS (optional), React-Toastify
- **Others:** Axios for HTTP requests

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) running locally or accessible via URI
- [RabbitMQ](https://www.rabbitmq.com/download.html) running locally (or modify worker to use custom queue)
- Optional: Yarn or npm package manager

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/mechanicm56/docware.git
cd docware
```

### 2. Backend SSetup

```bash
cd backend
npm install
```

### 3. Configure environment variables by creating a .env file

```ini
MONGO_URI=mongodb://localhost:27017/fileupload
RABBITMQ_URL=amqp://localhost
PORT=4000
```

### 4. Start backend server:

```bash
npm run dev
```

### 5. Start Malware Scanning Worker

```bash
cd backend
npm run worker
```
(Make sure RabbitMQ server is running before starting the worker.)

### 6. Frontend Setup 

```bash
cd frontend
npm install
npm start
```

## Further Enhancement

- This project simulates malware scanning by checking for certain keywords in uploaded files and waiting 2-5 seconds.
- To extend for production, integrate real malware scanning software or APIs.
- **RabbitMQ** is used for decoupling upload and scanning workers, but can be replaced with other queueing mechanisms.
- **Webhook** or Slack alerting for infected files can be added in the scanning worker.

