const userModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env
// const profileModel = require('../models/profile')
const responseStatus = require('../helpers/responseStatus')
const { sendEmail } = require('../helpers/sendMail')

// <-------------CONTROLLERS--------->
exports.register = async (req, res) => {
  const { email, phoneNumber } = req.body
  try {
    const emailExist = await userModel.getUsersByConditionAsync({ email })
    console.log(emailExist, '<<<<<<<< ini email')
    if (emailExist.length > 0) {
      const lengthPin = 5
      const pin = Math.floor(Math.pow(10, lengthPin - 1) + Math.random() * 9 * Math.pow(10, lengthPin - 1))
      const salt = await bcrypt.genSalt()
      const encryptedPin = await bcrypt.hash(pin.toString(), salt)
      const updatePin = await userModel.updateProfile(emailExist[0].id_user, { pin: encryptedPin })
      console.log(updatePin)
      const data = {
        email: email,
        subject: 'Pin Verification',
        html: ` <div>
      <h1>Pin Verification</h1>
      <h3>${pin}<h3>
      </div>`
      }
      sendEmail(data)
      const result = await userModel.getUserById(emailExist[0].id_user)
      console.log(result, 'ini data user')
      const dataUser = {
        email: result[0].email,
        phoneNumber: result[0].phoneNumber
      }
      return res.status(200).json({
        success: true,
        message: 'Please check email to get PIN verification',
        result: dataUser
      })
    }
    const lengthPin = 5
    const pin = Math.floor(Math.pow(10, lengthPin - 1) + Math.random() * 9 * Math.pow(10, lengthPin - 1))

    const salt = await bcrypt.genSalt()
    const encryptedPin = await bcrypt.hash(pin.toString(), salt)
    const createUser = await userModel.createUserAsync({ email, phoneNumber: phoneNumber, pin: encryptedPin })
    if (createUser.affectedRows > 0) {
      const data = {
        email: email,
        subject: 'Pin Verification',
        html: ` <div>
      <h1>Pin Verification</h1>
      <h3>${pin}<h3>
      </div>`
      }
      sendEmail(data)
      const result = await userModel.getUserById(createUser.insertId)
      const dataUser = {
        email: result[0].email,
        phoneNumber: result[0].phoneNumber
      }
      return res.status(200).json({
        success: true,
        message: 'Please check email to get PIN verification',
        result: dataUser
      })
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Please try again leter'
    })
  }
}

exports.login = async (req, res) => {
  const { email, pin, tokenNotif } = req.body
  try {
    const existingUser = await userModel.getUsersByConditionAsync({ email })
    if (existingUser.length > 0) {
      const compare = await bcrypt.compare(pin, existingUser[0].pin)
      if (compare) {
        const id = existingUser[0].id_user
        const token = jwt.sign({ id, email: email }, APP_KEY)
        await userModel.updateProfile(id, { tokenNotif })
        return res.status(200).json({
          success: true,
          message: 'Login Successfully',
          results: {
            email: existingUser[0].email,
            token
          }

        })
      }
    }
    return res.status(404).json({
      success: false,
      message: 'PIN is Wrong'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: responseStatus.serverError(res)
    })
  }
}

exports.logout = async (req, res) => {
  const { id } = req.query
  console.log(id, 'ini id')
  try {
    await userModel.deleteTokenNotif(id)
    return res.status(200).json({
      success: true,
      message: 'Logut Successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: responseStatus.serverError(res)
    })
  }
}
