'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      // quando for necessário pegar apenas um campo da requisição, podemos utilizar o "input"
      const email = request.input('email')
      // pegando apenas um unico registro, se não encontrar devolve um erro
      const user = await User.findByOrFail('email', email)

      // criando um token com 10 bytes e do tipo string hexadecimal
      user.token = crypto.randomBytes(10).toString('hex')
      // salvando no horário atual
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        (message) => {
          message
            .to(user.email)
            .from('diego@rocketseat.com.br', 'Diego | Rocketseat')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'E-mail não cadastrado' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      // procurando um usuário que tenha o mesmo token que o informado
      const user = await User.findByOrFail('token', token)

      // retirando 2 dias da data atual do token, e verificando se for maior que a data
      // em que ele criou o token, então isso quer dizer que já fazem 2 dias que o token existe
      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'O token de recuperação expirou!' } })
      }
      // setando os tokens como nulos
      user.token = null
      user.token_created_at = null
      // pegando a nova senha, e salvando
      user.password = password

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar sua senha!' } })
    }
  }
}

module.exports = ForgotPasswordController
