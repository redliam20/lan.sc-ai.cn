import moment from 'moment'

export const formatDateTime = function (date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatDate = function (date) {
  return moment(date).format('YYYY-MM-DD')
}

export const formatDateTimeWithoutBlank = function (date) {
  return moment(date).format('YYYYMMDDHHmmss')
}

export const formatDateTimeForFileName = function (date) {
  return moment(date).format('YYYY-MM-DD_HH.mm.ss')
}

export const timeStamp = function (date) {
  return moment.unix(date)
}

export const formatSecond = function (secondTime) {
  let time = parseInt(secondTime) + '秒'
  if (parseInt(secondTime) > 60) {
    const second = parseInt(secondTime) % 60
    let min = parseInt(secondTime / 60)
    time = min + '分' + second + '秒'

    if (min > 60) {
      min = parseInt(secondTime / 60) % 60
      let hour = parseInt(parseInt(secondTime / 60) / 60)
      time = hour + '小时' + min + '分' + second + '秒'

      if (hour > 24) {
        hour = parseInt(parseInt(secondTime / 60) / 60) % 24
        let day = parseInt(parseInt(parseInt(secondTime / 60) / 60) / 24)
        time = day + '天' + hour + '小时' + min + '分' + second + '秒'
      }
    }
  }
  return time
}
