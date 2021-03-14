exports.nextChatHistory = (receipentId, cond, totalData, url) => {
  if (cond.dataLimit < totalData.length) {
    return `${url}/chat/${receipentId}?search=${cond.search}&page=${cond.page + 1}&limit=${cond.limit}&sort=${cond.sort}&order=${cond.order}`
  } else {
    return null
  }
}
