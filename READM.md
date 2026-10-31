# WildFind

WildFind is a full-stack web app for outdoor explorers. Snap a photo of a plant, animal, insect, or fungus and get an AI-powered identification with safety info, then check live alerts and road events for U.S. National Parks before you head out.

**Live demo:** https://deseraem.pythonanywhere.com

<!-- Add screenshots here, e.g. ![Home page](screenshots/home.png) -->

## Features

- **Species identification:** upload a photo and Claude's vision model returns the common name, scientific name, description, origin, safety precautions, and a fun fact.
- **Discovery log:** every scan is saved to a database so users can browse their past finds.
- **Park safety dashboard:** search National Parks and view current alerts and road events from the National Park Service (NPS) API.
- **Single deployment:** the Flask backend serves the built React frontend, so the whole app runs from one site.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite |
| Backend | Python, Flask, Flask-CORS |
| Database | SQLite (`wildfind.db`) |
| APIs | Anthropic Claude API (vision), National Park Service API |
| Hosting | PythonAnywhere |

## Project Structure

```
SEO--Week-4-Project/
├── backend/
│   ├── app.py            # Flask app and API routes
│   ├── database.py       # SQLite helpers
│   ├── services/
│   │   ├── vision_api.py # Claude image analysis
│   │   └── nps_api.py    # NPS parks, alerts, road events
│   ├── tests/
│   └── dist/             # Built frontend served by Flask
├── frontend/             # React + Vite source
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)
- An [NPS API key](https://www.nps.gov/subjects/developer/get-started.htm)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/SEO--Week-4-Project.git
cd SEO--Week-4-Project
```

### 2. Set up the backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv requests anthropic
```

Create a file named `.env` inside the `backend/` folder:

```
ANTHROPIC_API_KEY=your_anthropic_key
NPS_API_KEY=your_nps_key
```

Start the server:

```bash
cd backend
python3 app.py
```

The backend runs at `http://localhost:5001`.

### 3. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### 4. Build for production

```bash
cd frontend
npm run build
rm -rf ../backend/dist
cp -r dist ../backend/dist
```

Flask serves everything in `backend/dist` at the site root.

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Check that the backend is running |
| POST | `/api/scan` | Send a base64 image, get a species identification and save it |
| GET | `/api/discoveries` | List all saved discoveries |
| POST | `/api/discoveries` | Save a discovery manually |
| GET | `/api/discoveries/<username>` | List discoveries for one user |
| GET | `/api/parks` | List National Parks for searching |
| GET | `/api/dashboard?park=XXXX` | Alerts and road events for a park (4-letter NPS code) |

## Deployment (PythonAnywhere)

1. Clone the repo in a PythonAnywhere Bash console.
2. Create a virtualenv and install the dependencies listed above.
3. Create `backend/.env` with your API keys.
4. On the **Web** tab, add a manual-configuration web app (Python 3.10) with source code set to `.../SEO--Week-4-Project/backend` and your virtualenv path.
5. Point the WSGI file at the app:
   ```python
   import sys
   path = '/home/YOUR_USERNAME/SEO--Week-4-Project/backend'
   if path not in sys.path:
       sys.path.insert(0, path)

   from app import app as application
   ```
6. Click **Reload**.

Note: free PythonAnywhere accounts can only make outbound requests to a whitelist of sites, so NPS API calls may require a paid account.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Used by the species-identification feature |
| `NPS_API_KEY` | Used to fetch park data from the NPS API |

Never commit your `.env` file. It is listed in `.gitignore`.

## Author

Built by **YOUR NAME** as part of the SEO program.

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
