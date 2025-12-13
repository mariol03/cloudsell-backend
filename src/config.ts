export const BACKEND_PORT: number = parseInt(process.env.BACKEND_PORT ?? "3000", 10);

// RabbitMQ Configuration
export const RABBITMQ_URL: string = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
export const RABBITMQ_EXCHANGE: string = process.env.RABBITMQ_EXCHANGE ?? "cloudsell.events";
export const RABBITMQ_EXCHANGE_TYPE: string = process.env.RABBITMQ_EXCHANGE_TYPE ?? "topic";
export const RABBITMQ_RETRY_ATTEMPTS: number = parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS ?? "5", 10);
export const RABBITMQ_RETRY_DELAY: number = parseInt(process.env.RABBITMQ_RETRY_DELAY ?? "3000", 10);
