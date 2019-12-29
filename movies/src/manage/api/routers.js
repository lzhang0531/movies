import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: '/mock/get_router',
    params: {
      access
    },
    method: 'get'
  })
}
