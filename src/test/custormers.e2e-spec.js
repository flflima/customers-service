const request = require('supertest');
const faker = require('faker');
const cpf = require('node-cpf');
const app = require('../app');
const db = require('../db');
const customerRepo = require('../repositories/customer.repository');

describe('customers', () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterAll(async () => {
    await db.drop();
  });

  it('should create a new customer', async () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = cpf.generate();
    const customerEmail = faker.internet.email();
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          data: {
            id: 1,
            email: customerEmail,
          },
          status: 'success',
        });

        expect(response.statusCode).toBe(201);
      });
  });

  it('should return BAD REQUEST for invalid "name"', async () => {
    const documentNumber = cpf.generate();
    const customerEmail = faker.internet.email();
    await request(app)
      .post('/customers')
      .send({
        name: '',
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: ["Field 'name' must have at least length 2"],
          status: 'Invalid Request',
        });

        expect(response.statusCode).toBe(400);
      });
  });

  it('should return BAD REQUEST for invalid "cpf" length', async () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = 999;
    const customerEmail = faker.internet.email();
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: ["Field 'cpf' must have length 11"],
          status: 'Invalid Request',
        });

        expect(response.statusCode).toBe(400);
      });
  });

  it('should return BAD REQUEST for invalid "cpf" characters', async () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = 'aaaaaaaaaaa';
    const customerEmail = faker.internet.email();
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: ["Field 'cpf' must have only numerics"],
          status: 'Invalid Request',
        });

        expect(response.statusCode).toBe(400);
      });
  });

  it('should return BAD REQUEST for invalid missing "email"', async () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = cpf.generate();
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: ["Field 'email' must be valid"],
          status: 'Invalid Request',
        });

        expect(response.statusCode).toBe(400);
      });
  });

  it('should return BAD REQUEST for invalid invalid "email"', async () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = cpf.generate();
    const customerEmail = 'invalid-email';
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: ["Field 'email' must be valid"],
          status: 'Invalid Request',
        });

        expect(response.statusCode).toBe(400);
      });
  });

  it('should return error when email already registered', async () => {
    const customerEmail = faker.internet.email();
    customerRepo.saveCustomer({
      name: faker.name.firstName(),
      cpf: cpf.generate(),
      email: customerEmail,
    });

    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const documentNumber = cpf.generate();
    await request(app)
      .post('/customers')
      .send({
        name: fullName,
        cpf: documentNumber,
        email: customerEmail,
      })
      .then((response) => {
        expect(response.body).toStrictEqual({
          errors: [`${customerEmail} already registered!`],
          status: 'Error',
        });

        expect(response.statusCode).toBe(409);
      });
  });
});
