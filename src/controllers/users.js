const userModel = require('../models/users')
const { APP_URL } = process.env
const responseStatus = require('../helpers/responseStatus')
const bcrypt = require('bcrypt')
const upload = require('../helpers/uploads').single('photo')
const multer = require('multer')
const nextLink = require('../helpers/nextLink')
const prevLink = require('../helpers/prevLink')

exports.getProfile = async (req, res) => {
  const { id } = req.params
  try {
    const data = await userModel.getUserById(id)
    const dataFinnally = {
      id_user: data[0].id_user,
      email: data[0].email,
      phoneNumber: data[0].phoneNumber,
      name: data[0].name,
      photo: `${APP_URL}/${data[0].photo}`
    }
    return res.status(200).json({
      success: true,
      message: 'User Match',
      results: dataFinnally
    })
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.getAllProfile = async (req, res) => {
  const cond = req.query
  cond.searchBy = cond.searchBy || 'name'
  cond.search = cond.search || ''
  cond.page = Number(cond.page) || 1
  cond.limit = Number(cond.limit) || 5
  cond.dataLimit = cond.limit * cond.page
  cond.offset = (cond.page - 1) * cond.limit
  cond.sort = cond.sort || 'id_user'
  cond.order = cond.order || 'DESC'
  try {
    const result = await userModel.getAllUser(cond)
    const dataFinnally = []
    for (let index = 0; index < result.length; index++) {
      if (result[index].id_user !== parseInt(cond.id_user)) {
        const data = {
          id_user: result[index].id_user,
          email: result[index].email,
          phoneNumber: result[index].phoneNumber,
          pin: result[index].pin,
          name: result[index].name,
          photo: `${APP_URL}/${result[index].photo}`,
          createdAt: result[index].createdAt,
          updatedAt: result[index].updatedAt
        }
        dataFinnally.push(data)
      }
    }
    // const totalData = await userModel.getAllUserWhitoutLimit(cond)
    return res.status(200).json({
      success: true,
      message: 'All Users',
      results: dataFinnally
      // pageInfo: {
      //   totalData: totalData.length,
      //   totalDataInCurrentPage: result.length,
      //   totalPage: Math.ceil(totalData.length / cond.limit),
      //   currentPage: cond.page,
      //   nextLink: nextLink.nextChatHistory(cond, totalData, APP_URL),
      //   prevLink: prevLink.prevChatHistory(receipentId, cond, totalData, APP_URL)
      // }
    })
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.updateProfile = async (req, res) => {
  const data = req.body
  const { id } = req.userData
  try {
    if (data.pin) {
      const salt = await bcrypt.genSalt()
      const encryptedPin = await bcrypt.hash(data.pin, salt)
      const dataFinnaly = { pin: encryptedPin }
      await userModel.updateProfile(id, dataFinnaly)
      const resultFinnaly = await userModel.getUserById(id)
      const dataFinnally = {
        id_user: resultFinnaly[0].id_user,
        email: resultFinnaly[0].email,
        phoneNumber: resultFinnaly[0].phoneNumber,
        name: resultFinnaly[0].name,
        photo: `${APP_URL}/${resultFinnaly[0].photo}`
      }
      return res.status(200).json({
        success: true,
        message: 'Update profile succesfully',
        results: dataFinnally
      })
    } else {
      await userModel.updateProfile(id, data)
      const resultFinnaly = await userModel.getUserById(id)
      const dataFinnally = {
        id_user: resultFinnaly[0].id_user,
        email: resultFinnaly[0].email,
        phoneNumber: resultFinnaly[0].phoneNumber,
        name: resultFinnaly[0].name,
        photo: `${APP_URL}/${resultFinnaly[0].photo}`
      }
      return res.status(200).json({
        success: true,
        message: 'Update profile succesfully',
        results: dataFinnally
      })
    }
  } catch (err) {
    responseStatus.serverError(res)
  }
}

exports.updatePhoto = async (req, res) => {
  upload(req, res, async err => {
    const { id } = req.userData
    console.log(id, '<<<<< ini id users')
    if (err instanceof multer.MulterError) {
      responseStatus.errorUploadPoster(res)
    } else if (err) {
      responseStatus.errorUploadPoster(res)
    }
    try {
      const finallyData = {
        id_user: id,
        photo: `${req.file.destination}/${req.file.filename}` || null
      }
      await userModel.updatePhotoProfile(finallyData)
      const data = await userModel.getUserById(id)
      const dataFinnally = {
        id_user: data[0].id_user,
        email: data[0].email,
        phoneNumber: data[0].phoneNumber,
        name: data[0].name,
        photo: `${APP_URL}/${data[0].photo}`
      }
      res.status(200).json({
        success: true,
        message: 'Update photo profile successfully',
        results: dataFinnally
      })
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "File Can't be Empty"
      })
    }
  })
}

exports.deletePhoto = async (req, res) => {
  const { id } = req.userData

  try {
    const finallyData = {
      id_user: id,
      photo: null
    }
    await userModel.updatePhotoProfile(finallyData)
    const data = await userModel.getUserById(id)
    const dataFinnally = {
      id_user: data[0].id_user,
      email: data[0].email,
      phoneNumber: data[0].phoneNumber,
      name: data[0].name,
      photo: `${APP_URL}/${data[0].photo}`
    }
    res.status(200).json({
      success: true,
      message: 'Photo profile deleted successfully',
      results: dataFinnally
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "File Can't be Empty"
    })
  }
}
