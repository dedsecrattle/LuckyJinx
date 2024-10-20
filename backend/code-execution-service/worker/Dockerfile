FROM python:3.10

WORKDIR /app

RUN apt-get update \
    # javascript
    && apt-get install -y nodejs \
    # tsc
    && apt-get install -y npm \
    && npm install -g typescript \
    # java
    && apt-get install -y default-jre \
    && apt-get install -y default-jdk \
    # c
    && apt-get install -y gcc \
    # c++
    && apt-get install -y g++

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-m", "rabbitmq"]
