const db = require('../helpers/db')

exports.createUserAsync = (data = {}) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
      INSERT INTO users
      (${Object.keys(data).join()})
      VALUES
      (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.getUsersByConditionAsync = (cond) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM users WHERE ${Object.keys(cond).map(item => `${item}="${cond[item]}"`).join(' AND ')}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
      SELECT * FROM users WHERE id_user=${id}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.getAllUser = (cond) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
      SELECT * FROM users WHERE name LIKE "%${cond.search}%" 
      OR email LIKE "%${cond.search}%" OR phoneNumber LIKE "%${cond.search}%"
      ORDER BY ${cond.sort} ${cond.order}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.getAllUserWhitoutLimit = (cond) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
      SELECT * FROM users WHERE name LIKE "%${cond.search}%" 
      OR email LIKE "%${cond.search}%" OR phoneNumber LIKE "%${cond.search}%"
      ORDER BY ${cond.sort} ${cond.order}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.updateProfile = (id, data) => {
  return new Promise((resolve, reject) => {
    const key = Object.keys(data)
    console.log(key)
    const value = Object.values(data)
    const q = db.query(`
    UPDATE users
    SET ${key.map((item, index) => `${item}="${value[index]}"`)}
    WHERE id_user=${id}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql, 'ini kuerynya')
  })
}

exports.updatePhotoProfile = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE users
      SET photo = '${data.photo}'
      WHERE id_user=${data.id_user}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}
