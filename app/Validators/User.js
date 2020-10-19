'use strict'

const Antl = use('Antl')

class User {
  // fazendo com que todos os campos sejam validados ao mesmo tempo
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // o username é obrigatório e deve ser único na tabela de usuários
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User
