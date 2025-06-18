# Mental Health Support Application

A comprehensive mental health support application built with FastAPI and React, featuring EFT tapping sessions, progress tracking, and crisis support resources.

## Features

- **EFT Tapping Sessions**: Guided emotional freedom technique sessions with AI-generated setup statements and reminder phrases
- **Progress Tracking**: Visualize mood, anxiety, and depression scores over time
- **Crisis Support**: Access to emergency hotlines and resources
- **User Authentication**: Secure login and registration system
- **Assessment Tools**: Mental health assessments and tracking

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic for migrations
- OpenAI API integration

### Frontend
- React
- TailwindCSS
- Chart.js for data visualization
- React Router for navigation

## Setup

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
LLM_API_KEY=your_openai_api_key
```

4. Run migrations:
```bash
alembic upgrade head
```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables in `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm run dev
```

## Deployment

The application is configured for deployment on Render:

1. Backend: Web service with Python environment
2. Database: PostgreSQL instance
3. Frontend: Static site deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 