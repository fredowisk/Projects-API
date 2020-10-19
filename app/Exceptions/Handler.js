'use strict'

const Raven = require('raven')
const Config = use('Config')

const Env = use('Env')
const Youch = use('Youch')
const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (Env.get('NODE_ENV') === 'development') {
      // o youch é um formatador de erros
      const youch = new Youch(error, request.request)
      const errorJSON = await youch.toJSON()
      return response.status(error.status).send(errorJSON)
    }

    return response.status(error.status)
  }

  async report (error, { request }) {
    // pegando as configurações do DSN
    Raven.config(Config.get('services.sentry.dsn'))
    // pegando o erro
    Raven.captureException(error)
  }
}

module.exports = ExceptionHandler
