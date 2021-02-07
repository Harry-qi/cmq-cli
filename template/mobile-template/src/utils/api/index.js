import request from '../axios/index'
export default {
  searchData( params) {
    return request({
      method: 'get',
      url: 'xxx',
      params
    })
  }
}
