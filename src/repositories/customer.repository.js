const Customer = require('../models/customer.model');

exports.saveCustomer = async (customer) => {
  const entity = await Customer.create(customer);
  await entity.save();
  return entity;
};

exports.findCustomerByEmail = async (email) => {
  const entity = await Customer.findOne({
    where: {
      email: email,
    },
  });
  return entity;
};
