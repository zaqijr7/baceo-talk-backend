exports.emailIsExist = (res) => {
  return res.status(400).json({
    success: false,
    message: 'Registered failed, email already exist'
  })
}

exports.serverError = (res) => {
  return res.status(500).json({
    success: false,
    message: 'Server Error'
  })
}

exports.errorUploadPoster = (res) => {
  return res.status(400).json({
    success: false,
    message: 'Only .png, .jpg and .jpeg format allowed!'
  })
}
