const Customer = require('../models/customer.model');

exports.saveCustomer = async (customer) => {
  const entity = await Customer.create(customer);
  await entity.save();
  return entity;
};

exports.updateCustomerStatus = async (approved, cpf) => {
  await Customer.update({ approved: approved }, { where: { cpf: cpf } });
};

exports.findCustomerByEmail = async (email) => {
  const entity = await Customer.findOne({
    where: {
      email: email,
    },
  });
  return entity;
};

exports.findCustomerByCpf = async (cpf) => {
  const entity = await Customer.findOne({
    where: {
      cpf: cpf,
    },
  });
  return entity;
};
