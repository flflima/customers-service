class CustomerDTO {
  constructor(name, cpf, email, approved = false) {
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.approved = approved;
  }
}

module.exports = CustomerDTO;
