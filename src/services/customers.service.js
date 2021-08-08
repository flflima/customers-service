const CustomerAlreadyExistsException = require('../exceptions/customer-already-exists.exception');
const {
  findCustomerByEmail,
  saveCustomer,
} = require('../repositories/customer.repository');

exports.createCustomer = async (customer) => {
  console.log(
    `Checking if customer is registered with email: ${customer.email}`,
  );

  const customerByEmail = await findCustomerByEmail(customer.email);
  if (customerByEmail) {
    throw new CustomerAlreadyExistsException(
      `${customer.email} already registered!`,
    );
  }

  console.log(`Saving ${JSON.stringify(customer)}`);

  return saveCustomer({
    name: customer.name,
    cpf: customer.cpf,
    email: customer.email,
  });
};
