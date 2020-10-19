'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  // o concurrency determina quantos Jobs eu quero processar simultaneamente
  static get concurrency () {
    return 1
  }

  // a key é gerada automaticamente para cada job
  static get key () {
    return 'NewTaskMail-job'
  }

  async handle ({ email, username, title, file }) {
    // enviando um e-mail
    await Mail.send(
    // o .new_task é o template do e-mail
      ['emails.new_task', 'emails.new_task-text'],
      { username, title, hasAttachment: !!file },
      (message) => {
        message
          .to(email)
          .from('diego@rocketseat.com.br', 'Diego | Rocketseat')
          .subject('Nova tarefa pra você')
        // se existir um arquivo
        if (file) {
        // faça anexo dele no e-mail passando o local onde ele está salvo
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          // coloque o nome original que foi usado antes do upload, e não o nome gerado automaticamente
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
