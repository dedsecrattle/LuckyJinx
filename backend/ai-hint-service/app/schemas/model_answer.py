from pydantic import BaseModel

class ModelAnswerResponse(BaseModel):
    model_answer: str
