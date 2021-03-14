const routes = require('express').Router()
const usersController = require('../controllers/users')
const authMiddleware = require('../middlewares/auth')

routes.get('/:id', usersController.getProfile)
routes.get('/', usersController.getAllProfile)
routes.patch('/', authMiddleware.authCheck, usersController.updateProfile)
routes.put('/', authMiddleware.authCheck, usersController.updatePhoto)

module.exports = routes
