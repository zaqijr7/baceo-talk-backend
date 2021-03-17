const express = require('express')
const BodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

// <-------------config------------->

dotenv.config()
const { APP_PORT } = process.env
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', () => {
  console.log('a user connected')
})

const socket = require('./src/middlewares/socket')
app.use(socket(io))

app.use(BodyParser.urlencoded())
app.use(morgan('dev'))
app.use(cors('*'))
app.use('/uploads', express.static('uploads'))

// <----------ROUTER---------->
app.use('/auth', require('./src/routers/auth'))
app.use('/chat', require('./src/routers/chat'))
app.use('/history', require('./src/routers/history'))
app.use('/profile', require('./src/routers/profile'))
app.use('/allUser', require('./src/routers/users'))

// <----------URL PORT---------->
app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend running!'
  })
})

server.listen(APP_PORT, () => {
  console.log(`Application is running opn port ${APP_PORT}`)
})
