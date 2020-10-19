'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async (taskInstance) => {
  if (!taskInstance.user_id) return

  // pegando a classe user do Model, para saber qual usuário estamos selecionando
  const { email, username } = await taskInstance.user().fetch()
  // pegando o file se ele existir
  const file = await taskInstance.file().fetch()

  // pegando o titulo da task
  const { title } = taskInstance

  Kue.dispatch(Job.key, { email, username, title, file }, { attempts: 3 })
}

TaskHook.sendUpdatedTaskMail = async (taskInstance) => {
  // o dirty verifica se o campo foi atualizado recentemente, caso contrário ele retorna undefined
  if (!taskInstance.user_id || !taskInstance.dirty.user_id) return

  // pegando a classe user do Model, para saber qual usuário estamos selecionando
  const { email, username } = await taskInstance.user().fetch()
  // pegando o file se ele existir
  const file = await taskInstance.file().fetch()

  // pegando o titulo da task
  const { title } = taskInstance

  // passando a key do Job para a fila, os dados que irão no e-mail, e a
  // quantidade de tentativas caso ocorra um erro
  Kue.dispatch(Job.key, { email, username, title, file }, { attempts: 3 })
}
