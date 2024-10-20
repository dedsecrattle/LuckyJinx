import subprocess
from subprocess import CompletedProcess
import os

compile_shell = os.environ.get("COMPILE_SHELL") == "True"

def execute(code: str, lang: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    match lang:
        case "python":
            return _execute_python(code, input, timeout)
        case "javascript":
            return _execute_javascript(code, input, timeout)
        case "typescript":
            return _execute_typescript(code, input, timeout)
        case "java":
            return _execute_java(code, input, timeout)
        case "c":
            return _execute_c(code, input, timeout)
        case "c++":
            return _execute_cpp(code, input, timeout)

def _handle_compile_error(result: CompletedProcess[bytes]) -> tuple[str | None, str | None]:
    if result.stderr:
        return None, result.stderr.decode()
    else:
        return None, result.stdout.decode()

def _execute_python(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
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
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"

def _execute_javascript(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/solution.js", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["node", "temp/solution.js"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"

def _execute_typescript(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/solution.ts", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["tsc", "temp/solution.ts"],
                                capture_output=True,
                                shell=compile_shell,
                                )
        if result.returncode != 0:
            return _handle_compile_error(result)
        result = subprocess.run(["node", "temp/solution.js"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"

def _execute_java(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/Solution.java", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["javac", "temp/Solution.java"],
                                capture_output=True,
                                shell=compile_shell,
                                )
        if result.returncode != 0:
            return _handle_compile_error(result)
        result = subprocess.run(["java", "-cp", "temp", "Solution"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"

def _execute_c(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/solution.c", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["gcc", "temp/solution.c", "-o", "temp/solution"],
                                capture_output=True,
                                shell=compile_shell,
                                )
        if result.returncode != 0:
            return _handle_compile_error(result)
        result = subprocess.run(["temp/solution"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"

def _execute_cpp(code: str, input: str, timeout: int) -> tuple[str | None, str | None]:
    if not os.path.exists("temp"):
        os.mkdir("temp")
    with open("temp/solution.cpp", "w") as f:
        f.write(code)
    
    try:
        result = subprocess.run(["g++", "temp/solution.cpp", "-o", "temp/solution"],
                                capture_output=True,
                                shell=compile_shell,
                                )
        if result.returncode != 0:
            return _handle_compile_error(result)
        result = subprocess.run(["temp/solution"],
                                input=input.encode(),
                                capture_output=True,
                                timeout=timeout,
                                )
        return result.stdout.decode(), result.stderr.decode()
    except subprocess.TimeoutExpired:
        return None, "Timeout"
