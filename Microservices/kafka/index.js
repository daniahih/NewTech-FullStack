import { Kafka } from "kafkajs";

// Kafka brokers are the Kafka servers that the app will connect to.
// In local development, this usually means "localhost:9092".
const BROKERS = (process.env.KAFKA_BROKERS || "localhost:9092")
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

// Kafka client instance shared by all services.
// It is responsible for creating producers and consumers.
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "microservices-app",
  brokers: BROKERS,
});

// Publish an event to a Kafka topic.
// This is the "async communication" part: one service produces an event,
// and another service can consume it without calling the other service directly.
export const publishEvent = async (topic, payload, key = "default") => {
  // Producer sends messages to Kafka topics.
  const producer = kafka.producer();

  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        {
          // key helps Kafka route messages with the same key to the same partition.
          key: String(key),
          // JSON payload is sent as a message value.
          value: JSON.stringify(payload),
        },
      ],
    });
    console.log(`Event published to ${topic}:`, payload);
  } catch (error) {
    console.error(`Kafka publish failed for ${topic}:`, error.message);
  } finally {
    await producer.disconnect();
  }
};

// Start a Kafka consumer that listens for events on a specific topic.
// This is how one service reacts to actions happening in another service.
export const startConsumer = async ({
  groupId,
  topic,
  onMessage,
  fromBeginning = false,
}) => {
  // A consumer belongs to a consumer group.
  // Multiple instances in the same group share messages.
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // Convert the Kafka message from bytes to a JavaScript object.
        const parsed = message.value ? JSON.parse(message.value.toString()) : null;

        // If a callback is passed, call it with the parsed event.
        if (onMessage) {
          await onMessage(parsed, message);
        }
      } catch (error) {
        console.error(`Kafka consumer error on ${topic}:`, error.message);
      }
    },
  });

  console.log(`Kafka consumer started for topic: ${topic}, group: ${groupId}`);
  return consumer;
};
