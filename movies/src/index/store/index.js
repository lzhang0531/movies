import appUser from './module/appUser'
import Vuex from 'vuex'
import Vue from 'vue'

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    appUser
  }
})
export default store
Vue.use(Vuex)
