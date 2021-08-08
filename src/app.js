const express = require('express');

const customersRouter = require('./routes/customers.router');

const app = express();

app.use(express.json());
app.use('/customers', customersRouter);

module.exports = app;
