
const admin = require('firebase-admin')

const serviceAccount = require('./baceo-talk-firebase-adminsdk-xac7g-7ffc214f23.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = firebase
