from fastapi import FastAPI, status, HTTPException
from models import CodeExecutionRequest
import json
from dotenv import load_dotenv

load_dotenv()

from rabbitmq import send_message


app = FastAPI()


@app.post("/")
async def execute_code(body: CodeExecutionRequest):
    if body.lang not in ["python"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid language")
    send_message(json.dumps({
        "code": body.code,
        "input": body.input,
        "timeout": body.timeout,
        "lang": body.lang,
    }))
    return {"message": "Code execution queued"}
