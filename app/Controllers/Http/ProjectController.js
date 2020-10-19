'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ request }) {
    // pegando apenas o parâmetro page do .get que retorna os parametros da rota
    const { page } = request.get()
    // criando uma query para trazer as informações do user, o .paginate carrega a página inicial
    const projects = await Project.query().with('user').paginate(page)

    return projects
  }

  async store ({ request, auth }) {
    const data = request.only(['title', 'description'])

    // passando o titulo, a descrição, e o id do usuário logado
    const project = await Project.create({ ...data, user_id: auth.user.id })

    return project
  }

  async show ({ params }) {
    const project = await Project.findOrFail(params.id)

    // carregando as tabelas user e tasks para trazer as informações junto com a tabela project
    await project.load('user')
    await project.load('tasks')

    return project
  }

  async update ({ params, request }) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['title', 'description'])

    // colocando as informações que vem na requisição dentro da variavel project
    project.merge(data)

    await project.save()

    return project
  }

  async destroy ({ params }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()
  }
}

module.exports = ProjectController
