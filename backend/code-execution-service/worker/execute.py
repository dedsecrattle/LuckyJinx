import subprocess
import os

def execute(code: str, lang: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    match lang:
        case "python":
            return execute_python(code, input, timeout)

def execute_python(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/solution.py", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["python", "temp/solution.py"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), None
    except subprocess.TimeoutExpired:
        return None, "Timeout"
