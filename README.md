HealthShield Bharat 🛡️

HealthShield Bharat is a smart digital health companion prototype designed to improve citizens' understanding of their health information and their engagement with India's digital health ecosystem.

The project combines a modern web interface with an AI-powered assistant to provide accessible, conversational health guidance and support.

🎯 Problem

Health information can be difficult to understand, especially when users receive medical reports, health-related information, or digital-health services without sufficient guidance.

HealthShield Bharat aims to make health information easier to understand through a simple, accessible and conversational interface.

💡 Solution

HealthShield Bharat provides a web-based health companion with:

- AI-powered conversational assistance
- Health-related information and guidance
- Medical report explanation support
- A citizen-friendly interface
- Support for English, Hindi and conversational Hinglish
- Integration with Google's Gemini AI through a server-side API

The AI assistant is designed to provide understandable information while encouraging users to consult a qualified medical professional for formal medical decisions.

🏗️ Architecture

The prototype uses a client-server architecture.

User
  │
  ▼
React + TypeScript Frontend
  │
  ▼
Express.js Server
  │
  ├── Health / Configuration APIs
  │
  └── Gemini AI API
          │
          ▼
     AI-generated response

Main technologies

- React
- TypeScript
- Vite
- Express.js
- Google Gemini API
- Tailwind CSS
- Recharts
- Lucide React
- Motion

📁 Project Structure

abd-smart-health-companion/
├── src/                  # Frontend source code
├── server.ts             # Express server and API endpoints
├── index.html            # Application entry point
├── package.json          # Dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── .gitignore

⚙️ Setup

Requirements

- Node.js
- npm
- A Google Gemini API key for AI functionality

Install dependencies

npm install

Configure the Gemini API

Create a ".env" file in the project root:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

Do not commit your API key to GitHub.

Run the development server

npm run dev

The development server runs on port "3000".

Build the project

npm run build

Start the production build

npm start

Type checking

npm run lint

🤖 AI Assistant

HealthShield Bharat includes an AI assistant named AABHA.

The assistant is designed to:

- Explain health-related information in accessible language
- Support English, Hindi and Hinglish conversations
- Help users understand medical information
- Encourage consultation with qualified doctors for formal medical decisions

The application uses the Google Gemini API through the server rather than exposing the API key directly in the frontend.

🔐 Security

API credentials should be stored in environment variables and must never be committed to the repository.

The ".env" file should remain excluded from Git using ".gitignore".

🧪 Sample Data / Testing

The prototype includes API endpoints that can be used for basic application checks.

Health check:

GET /api/health

Configuration status:

GET /api/config-status

The health endpoint can be used to verify that the server is running correctly.

📈 Impact & Scalability

The concept can be extended to support:

- Wider citizen access to understandable health information
- Additional Indian languages
- More health-data integrations
- Additional digital-health services
- Improved health-literacy tools
- Larger-scale deployment through cloud infrastructure

⚠️ Disclaimer

HealthShield Bharat is a prototype created for the hackathon and is not a substitute for professional medical diagnosis or treatment.

Users should consult qualified healthcare professionals for medical decisions.

🤖 AI Usage Disclosure

AI tools were used during the development process for assistance with software development, ideation, debugging, documentation and/or generation of parts of the prototype.

The final implementation was reviewed and integrated by the project team.

The exact extent and proportion of AI assistance should be stated in the accompanying hackathon presentation according to the team's actual development process.

📄 License

This project is intended to be released as open-source under the MIT License.
