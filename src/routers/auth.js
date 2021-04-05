const routes = require('express').Router()
const authController = require('../controllers/auth')
const { validationInputRegister, validationInput } = require('../middlewares/validationInput')

routes.post('/', validationInputRegister, validationInput, authController.register)
routes.patch('/', authController.login)
routes.delete('/', authController.logout)

module.exports = routes
