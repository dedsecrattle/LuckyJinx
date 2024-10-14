import pika
import os
import json
from dotenv import load_dotenv

load_dotenv()

from execute import execute
from redis_model import start_task, finish_task

connection = pika.BlockingConnection(pika.ConnectionParameters(
    host=os.environ.get('RABBITMQ_HOST'), port=os.environ.get('RABBITMQ_PORT'), heartbeat=30))
channel = connection.channel()

channel.queue_declare(queue='code-execution', durable=True)

def callback(ch, method, properties, body):
    data = json.loads(body)
    print(data)
    start_task(data["id"])
    output, error = execute(data["code"], data["lang"], data["input"], int(data["timeout"]))
    finish_task(data["id"], output, error)
    print(output, error)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='code-execution',
                          on_message_callback=callback)
    print('Ready to receive messages')
    channel.start_consuming()


if __name__ == "__main__":
    main()
