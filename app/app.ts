import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const topic = 'my-topic';
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'timeConsumer'  });
const run = async () => {
    // Producing
    await producer.connect();
    setInterval(async () => {
        await producer.send({
            topic,
            messages: [
                { value: `${Math.random().toString(36).substring(2, 15).toLowerCase()}.json` },
            ],
        });
        // Removed the console.log for sent messages
    }, 10000);


    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value ? message.value.toString() : null,
            });
        },
    });
}

run().catch(console.error);

