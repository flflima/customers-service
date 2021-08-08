const { validationResult } = require('express-validator');
const { createCustomer } = require('../services/customers.service');

exports.createCostumer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'Invalid Request',
      errors: errors.array().map((e) => `Field '${e.param}' ${e.msg}`),
    });
  } else {
    await createCustomer(req.body)
      .then((customer) => {
        res.status(201).json({
          status: 'success',
          data: {
            id: customer.id,
            email: customer.email,
          },
        });
      })
      .catch((error) => {
        res.status(error.statusCode() || 500).json({
          status: 'Error',
          errors: [error.message],
        });
      });
  }
  next();
};
