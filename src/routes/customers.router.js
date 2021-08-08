const { body } = require('express-validator');
const express = require('express');
const { createCostumer } = require('../controllers/customers.controller');

const router = express.Router();
router
  .route('/')
  .post(
    body('name')
      .isLength({ min: 2 })
      .withMessage('must have at least length 2'),
    body('email').isEmail().withMessage('must be valid'),
    body('cpf')
      .isLength({ min: 11, max: 11 })
      .withMessage('must have length 11')
      .isNumeric()
      .withMessage('must have only numerics'),
    createCostumer,
  );

module.exports = router;
