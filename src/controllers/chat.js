const chatModel = require('../models/chat')
const responseStatus = require('../helpers/responseStatus')
const nextLink = require('../helpers/nextLink')
const prevLink = require('../helpers/prevLink')
const { APP_URL } = process.env

exports.sendMessage = async (req, res) => {
  const senderId = req.userData.id
  const { receipentId } = req.query
  const { message } = req.body
  const dataMessage = {
    senderId,
    receipentId,
    message
  }
  try {
    const result = await chatModel.inputMessage(dataMessage)
    if (result.affectedRows > 0) {
      req.socket.emit(receipentId, result)
      res.status(200).json({
        success: true,
        message: 'Chat sended !'
      })
    }
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.chatHistoryReceipent = async (req, res) => {
  const senderId = req.userData.id
  const cond = req.query
  const { receipentId } = req.params
  const data = {
    senderId,
    receipentId
  }
  cond.search = cond.search || ''
  cond.page = Number(cond.page) || 1
  cond.limit = Number(cond.limit) || 10
  cond.dataLimit = cond.limit * cond.page
  cond.offset = (cond.page - 1) * cond.limit
  cond.sort = cond.sort || 'createdAt'
  cond.order = cond.order || 'DESC'
  try {
    const history = await chatModel.historyChatByReceipentId(data, cond)
    const totalData = await chatModel.totalDataChatByCondition(data, cond)
    res.status(200).json({
      success: true,
      message: 'History message',
      result: history,
      pageInfo: {
        totalData: totalData.length,
        totalDataInCurrentPage: history.length,
        totalPage: Math.ceil(totalData.length / cond.limit),
        currentPage: cond.page,
        nextLink: nextLink.nextChatHistory(receipentId, cond, totalData, APP_URL),
        prevLink: prevLink.prevChatHistory(receipentId, cond, totalData, APP_URL)
      }
    })
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.historyInteractions = async (req, res) => {
  const idUser = req.userData.id
  try {
    const historyInteraction = await chatModel.interactionHistory(idUser)
    const people = historyInteraction.filter(item => item.history !== idUser)
    people.reverse()
    const results = await Promise.all(people.map(item => chatModel.latestChatHistory({ senderId: idUser, receipentId: item.history })))
    const dataFinnaly = []
    for (let index = 0; index < results.length; index++) {
      const data = {
        id_chat: results[index][0].id_chat,
        senderId: results[index][0].senderId,
        senderEmail: results[index][0].senderEmail,
        senderPhoneNumber: results[index][0].senderPhoneNumber,
        senderName: results[index][0].senderName,
        senderPhoto: `${APP_URL}/${results[index][0].senderPhoto}`,
        receipentId: results[index][0].receipentId,
        receipentEmail: results[index][0].receipentEmail,
        receipentPhoneNumber: results[index][0].receipentPhoneNumber,
        receipentName: results[index][0].receipentName,
        receipentPhoto: `${APP_URL}/${results[index][0].receipentPhoto}`,
        message: results[index][0].message,
        createdAt: results[index][0].createdAt,
        updatedAt: results[index][0].updatedAt
      }
      dataFinnaly.push(data)
    }
    res.status(200).json({
      success: true,
      message: 'history interactions',
      results: dataFinnaly
    })
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.deleteMessage = async (req, res) => {
  const { id } = req.body
  try {
    await chatModel.deleteMessage(id)
    return res.status(200).json({
      success: true,
      message: 'Deleted chat'
    })
  } catch (err) {
    responseStatus.serverError(res)
  }
}
