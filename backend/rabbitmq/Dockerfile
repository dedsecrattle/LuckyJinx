# Use the official RabbitMQ image as the base
FROM rabbitmq:4-management

# Set environment variable to enable the plugin
ENV RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS="-rabbitmq_management load_definitions \"/etc/rabbitmq/definitions.json\""

# Install wget and unzip
RUN apt-get update && apt-get install -y wget unzip

# Download and install the plugin
RUN wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.0.2/rabbitmq_delayed_message_exchange-4.0.2.ez && \
    mv rabbitmq_delayed_message_exchange-4.0.2.ez plugins/

# Enable the plugin
RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*