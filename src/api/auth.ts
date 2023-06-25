import { resolveToken } from './utils'

export default [

  {
    url: '/api/auth/refreshToken',
    method: 'post',
    response: ({ headers }) => {
      return {
        code: 200,
        data: {
          token: resolveToken(headers?.authorization),
        },
      }
    },
  },
]
