from fastapi import FastAPI, status, HTTPException
from models import CodeExecutionRequest
import json
from dotenv import load_dotenv

load_dotenv()

from rabbitmq import send_message
from redis_model import register_task


app = FastAPI()


@app.post("/")
async def execute_code(body: CodeExecutionRequest):
    if body.lang not in ["python"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid language")
    id = register_task()
    send_message(json.dumps({
        "id": id,
        "code": body.code,
        "input": body.input,
        "timeout": body.timeout,
        "lang": body.lang,
    }))
    return {"id": id}
