const { producer } = require('../kafka');
const logger = require('../config/logger');
const CustomerAlreadyExistsException = require('../exceptions/customer-already-exists.exception');
const {
  findCustomerByEmail,
  saveCustomer,
  findCustomerByCpf,
  updateCustomerStatus,
} = require('../repositories/customer.repository');
const { PENDING_TOPIC } = require('../constants');

exports.createCustomer = async (customer) => {
  logger.info(
    `Checking if customer is registered with email: ${customer.email}`,
  );

  const customerByEmail = await findCustomerByEmail(customer.email);
  if (customerByEmail) {
    throw new CustomerAlreadyExistsException(
      `${customer.email} already registered!`,
    );
  }

  logger.info(`Saving ${JSON.stringify(customer)}`);

  const newCustomer = await saveCustomer({
    name: customer.name,
    cpf: customer.cpf,
    email: customer.email,
  });

  // FIXME: mock
  producer.send(
    [
      {
        topic: PENDING_TOPIC,
        messages: `{ "name": "${newCustomer.name}", "cpf": "${newCustomer.cpf}" }`,
      },
    ],
    (error, data) => {
      console.log(data);
      console.error(error);
    },
  );

  return newCustomer;
};

exports.updateStatus = async (cpf, approved) => {
  const customer = await findCustomerByCpf(cpf);

  if (!customer) {
    throw new Error(`Customer with cpf ${cpf} was not found!`);
  }

  customer.approved = approved;

  console.log(customer.dataValues);

  logger.info(`Updating status`);

  await updateCustomerStatus(approved, cpf);
};
