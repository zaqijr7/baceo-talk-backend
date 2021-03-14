const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env

exports.authCheck = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.substring(7)
      const data = jwt.verify(token, APP_KEY)
      if (data) {
        req.userData = data
        return next()
      }
    }
    return res.status(401).json({
      success: false,
      message: 'Authorization needed'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'There something is wrong'
    })
  }
}
