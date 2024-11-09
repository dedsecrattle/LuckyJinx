from fastapi import APIRouter, HTTPException
from ..services.openai_service import generate_hint
from ..schemas.hint import HintResponse
from typing import Optional

router = APIRouter()

@router.get("/{question_id}", response_model=HintResponse)
async def get_hint(question_id: int):
    """
    Generate a hint for the given question ID.
    """
    # Placeholder: Fetch question description from the question service
    # You need to integrate with your question service's API to get the description
    question_description = fetch_question_description(question_id)
    if not question_description:
        raise HTTPException(status_code=404, detail="Question not found.")
    
    try:
        hint = generate_hint(question_description)
        return HintResponse(hint=hint)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fetch_question_description(question_id: int) -> Optional[str]:
    # Implement the logic to fetch question description from the question service
    # For example, make an HTTP request to the question service's API
    import requests
    QUESTION_SERVICE_URL = "http://localhost/api/questions"
    QUESTION_SERVICE_URL = "http://question:3002"
    try:
        link = f"{QUESTION_SERVICE_URL}/{question_id}"
        print(link)
        response = requests.get(link)
        print(response)
        if response.status_code == 200:
            data = response.json()
            return data.get("description")
        else:
            return None
    except Exception as e:
        return None
