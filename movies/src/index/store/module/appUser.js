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
        var deviceId = ''
//注册事件监听
        function connectWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
          } else {
            document.addEventListener(
              'WebViewJavascriptBridgeReady'
              , function() {
                callback(WebViewJavascriptBridge)
              },
              false
            );
          }
        }
//注册回调函数，第一次连接时调用 初始化函数
        connectWebViewJavascriptBridge(function(bridge) {
          bridge.init(function(message, responseCallback) {
            console.log('JS got a message',message);
            var data = {
              'Javascript Responds': 'Wee!'
            };
            console.log('JS responding with', data);
            responseCallback(data);
          });

          bridge.registerHandler("getDeviceId", function(data, responseCallback) {
            const deviceId = data
            commit('setDeviceId', deviceId)
            dispatch('getUserInfo',deviceId)
            var responseData = "Javascript Says Right back aka!";
            responseCallback(responseData);
          });
        })
      })
    },
    getUserInfo({ commit }, deviceId){
      return !deviceId ? '' : new Promise((resolve, reject) => {
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
