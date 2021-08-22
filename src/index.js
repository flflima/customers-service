require('./kafka');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = require('./app');
const logger = require('./config/logger');

require('dotenv').config();

const port = process.env.PORT || 3000;

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`Server started at port:${port}`);
});

const db = require('./db');
const { consumer } = require('./kafka');
const { updateStatus } = require('./services/customers.service');

(async () => {
  await db.sync({ force: true });
})();

consumer.on('message', async (message) => {
  if (message) {
    const customer = JSON.parse(message.value);
    console.log(customer.name);
    console.log(customer.cpf);
    console.log(customer.status);

    await updateStatus(customer.cpf, customer.status);

    console.log(`${JSON.stringify(customer)} atualizado`);
  }
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('UNHANDLER REJECTION! Shutting down...');
  app.close(() => {
    process.exit(1);
  });
});
