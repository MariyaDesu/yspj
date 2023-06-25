import request from '@/utils/http'

export default {
  getUser: () => request.get('/user/getCurrentUser'),
  // getRouter: () => request.get('/menu/getList'),
  refreshToken: () => request.post('/auth/refreshToken'),
}
