from fastapi import APIRouter, HTTPException
from ..services.openai_service import generate_model_answer
from ..schemas.model_answer import ModelAnswerResponse
from typing import Optional

router = APIRouter()

@router.get("/{question_id}", response_model=ModelAnswerResponse)
async def get_model_answer(question_id: int):
    """
    Generate a model answer for the given question ID.
    """
    # Placeholder: Fetch question description from the question service
    question_description = fetch_question_description(question_id)
    if not question_description:
        raise HTTPException(status_code=404, detail="Question not found.")
    
    try:
        model_answer = generate_model_answer(question_description, language="python")  # Adjust language as needed
        return ModelAnswerResponse(model_answer=model_answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_question_description(question_id: int) -> Optional[str]:
    # Implement the logic to fetch question description from the question service
    import requests
    QUESTION_SERVICE_URL = "http://question:3002"
    try:
        response = requests.get(f"{QUESTION_SERVICE_URL}/{question_id}")
        if response.status_code == 200:
            data = response.json()
            return data.get("description")
        else:
            return None
    except Exception as e:
        return None
