from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router import auth, chat, assessment, eft, progress, crisis
from app.config import settings

app = FastAPI(
    title="EFT Anxiety Support API",
    description="API for the EFT Anxiety Support Chatbot",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(assessment.router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(eft.router, prefix="/api/eft", tags=["EFT"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(crisis.router, prefix="/api/crisis", tags=["Crisis Support"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to the EFT Anxiety Support API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 