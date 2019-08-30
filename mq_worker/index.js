const mqClient = require("amqplib");

const mqUrl = process.env.CLOUDAMQP_URL || "amqp://localhost";
const queue = "tasks";

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let waitTime = 1000;

(async () => {
  const mqConn = await mqClient.connect(mqUrl);
  const chan = await mqConn.createChannel();
  await chan.assertQueue(queue);

  await chan.consume(queue, async message => {
    console.log(`Consuming ${message.content.toString()}`)
    waitTime = Math.min(Math.ceil(waitTime * 1.1), Number.MAX_SAFE_INTEGER - 1)
    console.log(`Waiting ${waitTime}`)
    await wait(waitTime)
    chan.ack(message);
    console.log(`Acknowledged ${message.content.toString()}`)
  });
})();
