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

(async () => {
  await db.sync({ force: true });
})();

process.on('unhandledRejection', (err) => {
  logger.error(err.name, err.message);
  logger.error('UNHANDLER REJECTION! Shutting down...');
  app.close(() => {
    process.exit(1);
  });
});
