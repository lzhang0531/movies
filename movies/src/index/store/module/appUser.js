import Cookie from 'js-cookie'
import createLogger from 'vuex/dist/logger'
import axios from 'axios'

const COOKIE_NAME = 'movie_deviceId'
const getCookieUser = () => {
  return Cookie.get(COOKIE_NAME)
    ? JSON.parse(Cookie.get(COOKIE_NAME))
    : null
}
const setCookieUser =(info)  => {
  Cookie.set(COOKIE_NAME, info, { expires: 30 })
}

const debug = process.env.NODE_ENV !== 'production'

const appUser = {
  strict: debug,
  state: {
    deviceId: getCookieUser(),
    userInfo :{

    }
  },
  mutations:{
    setDeviceId (state, deviceId) {
      state.deviceId = deviceId;
      setCookieUser(deviceId);
    },
    setUserInfo (state, info) {
      state.userInfo = info;
    }
  },
  actions:{
    getDeviceId  ({ state, commit }) {
      return new Promise((resolve, reject) => {
        const deviceId = '12345'
        commit('setDeviceId', deviceId)
      })
    },
    getUserInfo({ commit }, deviceId){
      return new Promise((resolve, reject) => {
        axios.get('/manage/user/get-by-device-id',{params:{'deviceId':deviceId}}).then(res => {
          res = res.data
          if (res.res === 0) {
            const info = res.data;
            commit('setUserInfo', info)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  plugins: debug ? [createLogger()] : []
}

export default appUser
