from pydantic import BaseModel

class ModelAnswerResponse(BaseModel):
    ai_answer: str
