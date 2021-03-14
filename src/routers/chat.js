const routes = require('express').Router()
const chatController = require('../controllers/chat')
// const { validationInputRegister, validationInput } = require('../middlewares/validationInput')
const authMiddleware = require('../middlewares/auth')

routes.post('/', authMiddleware.authCheck, chatController.sendMessage)
routes.delete('/', chatController.deleteMessage)
routes.get('/:receipentId', authMiddleware.authCheck, chatController.chatHistoryReceipent)

module.exports = routes
