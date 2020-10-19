'use strict'

const Route = use('Route')

// passsando o validator para a rota
Route.post('/users', 'UserController.store').validator('User')
// criando validação para o login
Route.post('/sessions', 'SessionController.store').validator('Session')

Route.post('/passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('/passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('/files/:id', 'FileController.show')

// Rotas para quando o usuário estiver logado
Route.group(() => {
  Route.post('/files', 'FileController.store')

  // dizendo que isso vai ser uma api, excluindo os metodos create e edit
  Route.resource('/projects', 'ProjectController')
    .apiOnly()
    // passando qual metodo será validado, e qual validator vai validar ele
    .validator(new Map([[['/projects.store'], ['Project']]]))

  Route.resource('/projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['/projects.tasks.store'], ['Task']]]))
}).middleware(['auth'])
