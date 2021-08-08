const customersService = require('./customers.service');

jest.mock('../repositories/customer.repository');
const customersRepo = require('../repositories/customer.repository');

jest.mock('sequelize');

describe('customers', () => {
  beforeAll(() => {});

  it('should create a new customer', async () => {
    const body = {
      name: 'John',
      cpf: '99999999999',
      email: 'john@email.com',
    };

    customersRepo.findCustomerByEmail.mockReturnValue(undefined);
    customersRepo.saveCustomer.mockReturnValue({
      id: 1,
      name: body.name,
      cpf: body.cpf,
      email: body.email,
    });

    const customer = await customersService.createCustomer(body);

    expect(customer).toBeDefined();
    expect(customer).toStrictEqual({
      id: 1,
      name: 'John',
      cpf: '99999999999',
      email: 'john@email.com',
    });
    expect(customersRepo.findCustomerByEmail).toBeCalledTimes(1);
    expect(customersRepo.saveCustomer).toBeCalledTimes(1);
  });
});
