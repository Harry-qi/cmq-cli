import request from '@/utils/request'
const index = {
  // 登
  login(data) {
    return request.post('/api/manage/user/login', data)
  }
}
export {
  index
}
