const routes = require('express').Router()
const chatController = require('../controllers/chat')
// const { validationInputRegister, validationInput } = require('../middlewares/validationInput')
const authMiddleware = require('../middlewares/auth')

routes.get('/', authMiddleware.authCheck, chatController.historyInteractions)

module.exports = routes
