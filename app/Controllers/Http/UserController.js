'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    // filtrando os campos que eu quero permitir
    const data = request.only(['username', 'email', 'password'])
    // pegando apenas uma informação do body
    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data, trx)

    // criando as relações automaticamente
    await user.addresses().createMany(addresses, trx)

    await trx.commit()

    return user
  }
}

module.exports = UserController
