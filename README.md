# Capstone Project Chatbot

This repository contains a chatbot application with separate **frontend** and **backend** components. The **frontend** is built using React and Vite, while the **backend** is built with Flask. The backend leverages the ElevenLabs Text-to-Speech API for audio synthesis.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or later) - Download and install from: https://nodejs.org/en/download/
- **Python** (v3.7 or later) - Download and install from: https://www.python.org/downloads/
- **npm** (comes with Node.js) 
- **pip** (Python package manager) - Run the following command on a terminal: py get-pip.py

---

### Installation and Setup

## Clone the Repository

```bash
git clone <repository-url>
cd capstone-project-chatbot
```

## Frontend Setup

Navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
npm install
```

## Start Development Server:

```bash
npm run dev
```

Access the application at http://localhost:5173.

## Backend Setup

```bash
cd ../backend
```

## Create a Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

## Install Python Dependencies
```bash
pip install flask flask-cors requests
```

## Run the Backend Server
```bash
python app.py
```