const kafka = require('kafka-node');
const { PENDING_TOPIC } = require('./constants');

// kafka client
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:29092' }); // FIXME: env file

const topicsToCreate = [
  {
    topic: PENDING_TOPIC,
    partitions: 1,
    replicationFactor: 1,
  },
];

client.createTopics(topicsToCreate, (error, result) => {
  console.error(error);
  console.log(result);
});

exports.producer = new kafka.Producer(client);
