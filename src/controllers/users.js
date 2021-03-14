const userModel = require('../models/users')
const { APP_URL } = process.env
const responseStatus = require('../helpers/responseStatus')
const bcrypt = require('bcrypt')
const upload = require('../helpers/uploads').single('photo')
const multer = require('multer')

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
  try {
    const result = await userModel.getAllUser()
    return res.status(200).json({
      success: true,
      message: 'All Users',
      results: result
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
      return res.status(200).json({
        success: true,
        message: 'All Users',
        results: resultFinnaly
      })
    } else {
      const result = await userModel.updateProfile(id, data)
      console.log(result)
      const resultFinnaly = await userModel.getUserById(id)
      return res.status(200).json({
        success: true,
        message: 'All Users',
        results: resultFinnaly
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
