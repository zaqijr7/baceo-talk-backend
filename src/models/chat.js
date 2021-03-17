const db = require('../helpers/db')

exports.inputMessage = (data) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
        INSERT INTO chathistory
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

exports.historyChatByReceipentId = (data, cond) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
    SELECT * FROM chathistory WHERE senderId=${data.senderId} AND receipentId=${data.receipentId} OR senderId=${data.receipentId} AND receipentId=${data.senderId}
    ORDER BY ${cond.sort} ${cond.order}
    LIMIT ${cond.limit} OFFSET ${cond.offset}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.totalDataChatByCondition = (data, cond) => {
  return new Promise((resolve, reject) => {
    db.query(`
    SELECT * FROM chathistory WHERE senderId=${data.senderId} AND receipentId=${data.receipentId} OR senderId=${data.receipentId} AND receipentId=${data.senderId} 
    AND message LIKE "%${cond.search}%"
    ORDER BY ${cond.sort} ${cond.order}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.latestChatHistory = (data, cond) => {
  return new Promise((resolve, reject) => {
    db.query(`
    SELECT chathistory.id_chat, sender.id_user AS senderId, sender.email AS senderEmail, sender.phoneNumber AS senderPhoneNumber,
    sender.name AS senderName, sender.photo AS senderPhoto, receipent.id_user AS receipentId, receipent.email AS receipentEmail, 
    receipent.phoneNumber AS receipentPhoneNumber, receipent.name AS receipentName,
    receipent.photo AS receipentPhoto, chathistory.message, chathistory.createdAt, chathistory.updatedAt FROM chathistory
    INNER JOIN users sender ON sender.id_user=chathistory.senderId
    INNER JOIN users receipent ON receipent.id_user=chathistory.receipentId
    WHERE senderId=${data.senderId} AND receipentId=${data.receipentId} 
    OR 
    senderId=${data.receipentId} AND receipentId=${data.senderId} ORDER BY createdAt DESC LIMIT 1
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.interactionHistory = (data) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
    SELECT DISTINCT senderId as history FROM chathistory  WHERE 
    receipentId=${data} OR senderId=${data} UNION SELECT DISTINCT receipentId FROM chathistory  WHERE 
    receipentId=${data} OR senderId=${data}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}

exports.deleteMessage = (data) => {
  return new Promise((resolve, reject) => {
    const q = db.query(`
    DELETE FROM chathistory
    WHERE id_chat IN (${data.join()});
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(q.sql)
  })
}
