const routes = require('express').Router()
const usersController = require('../controllers/users')

routes.get('/', usersController.getAllProfile)

module.exports = routes
