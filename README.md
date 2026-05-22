# 🚀 NextRound AI

> **The Premier, FAANG-Level AI Mock Interview & B2B Assessment Operating System**

NextRound AI is an enterprise-grade platform engineered to simulate elite technical and behavioral interviews. Built on a robust MERN stack and powered by state-of-the-art AI, it provides candidates with a hyper-realistic interview environment. From a live Monaco Editor for DSA assessments to real-time emotional analysis and strict proctoring, NextRound AI represents the future of technical hiring and preparation.

---

## 📋 Table of Contents

- [✨ Features](#-features)
  - [🧠 AI Interview Engine](#-ai-interview-engine)
  - [💻 Technical Assessment IDE](#-technical-assessment-ide)
  - [👁️ Enterprise Proctoring](#️-enterprise-proctoring)
  - [📊 Analytics & Reporting](#-analytics--reporting)
- [🏛️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [🎯 Quick Start](#-quick-start)
- [🏗️ Proctoring System Guide](#️-proctoring-system-guide)
- [📊 Performance Analytics](#-performance-analytics)
- [📡 API Documentation](#-api-documentation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Production Deployment](#-production-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔮 Roadmap](#-roadmap)

---

## ✨ Features

### 🧠 AI Interview Engine
- **Real-time AI Voice Interviewer:** Dynamic, responsive conversational AI powered by OpenRouter/GPT-4o-mini integration.
- **Target Company Trait Matching:** Tailored interview personas focusing on specific corporate values (e.g., Amazon Leadership Principles, Googleyness).

### 💻 Technical Assessment IDE
- **Cinematic Dark Mode & Glassmorphism:** A stunning, FAANG-level UI designed with TailwindCSS and Framer Motion for a seamless, immersive experience.
- **Live Coding IDE:** Integrated Monaco Editor providing a true-to-life coding environment for Data Structures and Algorithms (DSA) questions.

### 👁️ Enterprise Proctoring
- **Real-time Emotional & Body Language Analysis:** Utilizes `face-api.js` to monitor candidate engagement and stress levels during the interview.
- **"Strict Mode" Security:** Advanced proctoring including tab-switch tracking, copy/paste prevention, and a mandatory webcam kill-switch to ensure assessment integrity.

### 📊 Analytics & Reporting
- **Automated PDF Report Generation:** Instantly generates comprehensive post-interview feedback and analytics reports.
- **Enterprise Billing:** Seamless credit and subscription management powered by Razorpay integration.

---

## 🏛️ Architecture

A scalable, decoupled MERN architecture designed for real-time performance and enterprise security.

```text
NextRound-AI/
├── client/                     # React Frontend
│   ├── public/                 # Static assets, face-api models
│   ├── src/
│   │   ├── assets/             # Icons, images
│   │   ├── components/         # Reusable UI components (Glassmorphism, Monaco, etc.)
│   │   ├── context/            # React Context (Auth, Interview State)
│   │   ├── hooks/              # Custom Hooks (useProctoring, useAudio)
│   │   ├── pages/              # Route views (Dashboard, Arena, Report)
│   │   ├── services/           # API clients (Axios, WebRTC/Sockets)
│   │   ├── utils/              # Helpers (face-api wrappers, metric calculators)
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js      # Styling configuration
│   └── package.json
│
├── server/                     # Node.js / Express Backend
│   ├── config/                 # DB connections, external API setups (Razorpay)
│   ├── controllers/            # Route logic (Auth, Interview, Payment)
│   ├── middleware/             # Auth guards, Proctoring event loggers
│   ├── models/                 # Mongoose schemas (User, Interview, Report)
│   ├── routes/                 # Express route definitions
│   ├── services/               # AI Engine (OpenRouter), PDF generation
│   ├── utils/                  # Utility functions
│   ├── server.js               # Application entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Razorpay Account (for billing)
- OpenRouter API Key

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   OPEN_ROUTER_API_KEY=your_openrouter_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

---

## 🎯 Quick Start

Get your first interview running in three easy steps:

1. **Step 1: Setup Profile**
   - Register a new user account.
   - Configure your target company (e.g., Meta, Stripe) and desired role (e.g., Frontend Engineer).

2. **Step 2: Start Interview Arena**
   - Enter the Arena. Grant camera and microphone permissions.
   - "Strict Mode" initiates automatically. Code your solution in the Monaco Editor while the AI conducts the interview.

3. **Step 3: Review Analytics**
   - Conclude the interview to trigger the processing pipeline.
   - Navigate to the Dashboard to download your PDF report and review performance metrics.

---

## 🏗️ Proctoring System Guide

NextRound AI employs a rigorous, enterprise-grade proctoring system designed to maintain the integrity of B2B assessments.

- **Strict Mode Lifecycle:** Activated upon entering the Arena. The session is immediately flagged if the user exits fullscreen or loses focus.
- **Tab-Switch Tracking:** The `visibilitychange` API monitors the active tab. Leaving the assessment window logs an infraction and warns the user.
- **Copy/Paste Prevention:** The Monaco Editor instance is configured to intercept and block `ctrl+c`/`ctrl+v` events to prevent plagiarism during coding rounds.
- **Mandatory Webcam Kill-Switch:** Continuous feed analysis via `face-api.js` ensures the candidate remains in-frame. If the camera is disabled or obstructed, the interview is automatically paused or terminated.

---

## 📊 Performance Analytics

Our proprietary engine analyzes multiple dimensions of the candidate's performance in real-time:

| Metric | Description | Data Source |
| :--- | :--- | :--- |
| **WPM (Words Per Minute)** | Speaking pace to gauge nervousness or fluency. | Audio Transcription |
| **Confidence Score** | Sentiment analysis of spoken responses and tone. | LLM Analysis |
| **Eye Contact & Posture** | Tracks gaze focus and physical engagement. | `face-api.js` |
| **Code Complexity** | Evaluates Big O notation and code quality in the IDE. | Custom AST Parser |

---

## 📡 API Documentation

Core endpoints powering the interview engine.

### Generate Interview Context
Initializes the AI persona based on target company parameters.
```http
POST /api/interview/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "targetCompany": "Google",
  "role": "Senior Full Stack Engineer",
  "focusAreas": ["System Design", "React Performance"]
}
```

### Submit Interview Round
Processes the candidate's code and spoken answer for evaluation.
```http
POST /api/interview/submit
Content-Type: application/json
Authorization: Bearer <token>

{
  "interviewId": "64a7b...",
  "codeSnapshot": "function twoSum(nums, target) { ... }",
  "transcription": "I decided to use a hash map to optimize the lookup time to O(1)...",
  "proctoringFlags": []
}
```

---

## ⚙️ Configuration

Crucial environment variables for the application:

- `OPEN_ROUTER_API_KEY`: Required for the core AI voice and NLP engine (GPT-4o-mini).
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Used to authenticate API requests for creating orders and verifying subscription payments.
- `MONGODB_URI`: Connection string for the primary database cluster.
- `JWT_SECRET`: Secret key for signing and verifying JSON Web Tokens for authentication.

---

## 🚀 Production Deployment

NextRound AI is optimized for modern cloud deployments.

- **Frontend (Vite/React):** 
  Build the production bundle using `npm run build`. Deploy the `dist` folder to Vercel, Netlify, or AWS S3/CloudFront for optimal edge caching.
- **Backend (Node.js/Express):** 
  Deploy to Render, Railway, or AWS EC2. Ensure environment variables are securely injected via the platform's secrets manager. Use PM2 for process management if deploying on a raw VM.

---

## 🤝 Contributing

We welcome contributions from the community to make NextRound AI even better!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code adheres to the existing style guidelines and passes all linting checks.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🔮 Roadmap

- [ ] **Excalidraw Whiteboarding:** Integrated system design drawing tool.
- [ ] **JD-to-Resume Matching:** Automated analysis of candidate fit before the interview begins.
- [ ] **Multi-language Support:** Localization for international markets and diverse talent pools.
- [ ] **GraphQL API:** Transitioning core data fetching to GraphQL for optimized client performance.
