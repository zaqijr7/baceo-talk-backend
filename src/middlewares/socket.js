module.exports = (io) => {
  return (req, res, next) => {
    console.log('cek 1')
    req.socket = io
    next()
  }
}
