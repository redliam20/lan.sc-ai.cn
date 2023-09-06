import httpRequest from '@/utils/httpRequest'
// Adam 返回值的生命周期问题，此函数不能用。
export const getDicts = (code) => {
  httpRequest({
    url: httpRequest.adornUrl('/dict/dicts'),
    method: 'get',
    params: httpRequest.adornParams({code: code})
  })
  .then(({ data }) => {
    if (data && data.code === 0) {
      console.log('返回值的生命周期问题，会出错 ' + data.data)
      return data.data
    } else {
      console.log(data.msg)
      // _this.$message.error(data.msg)
    }
  })
}
