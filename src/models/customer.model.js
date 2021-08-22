const { DataTypes } = require('sequelize');
const database = require('../db');

const Customer = database.define('customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    default: false,
  },
});

module.exports = Customer;
