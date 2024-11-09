# backend/ai-hint-service/app/main.py

from fastapi import FastAPI
from .routes import hint, code_analysis, model_answer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Hint Service",
    description="Provides AI-generated hints, code complexity analysis, and model answers.",
    version="1.0.0",
)

# CORS settings - adjust origins as needed
origins = [
    "http://localhost",
    "http://localhost:80",
    # Add other frontend URLs here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(hint.router, prefix="/api/hint", tags=["Hint"])
app.include_router(code_analysis.router, prefix="/api/code-analysis", tags=["Code Analysis"])
app.include_router(model_answer.router, prefix="/api/model-answer", tags=["Model Answer"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "AI Hint Service is up and running."}
