import VueRouter from 'vue-router'
import store from 'index/store'
import { getCookieUser,setCookieUser } from 'index/common/js/cache'
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/list/1'
    },
    {
      path: '/list/:type',
      name: 'list',
      component: () => import('./pages/List.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('./pages/User.vue')
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('./pages/Movie.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.deviceId) {
/*    const deviceId = getCookieUser();
    if(deviceId){
      store.commit('setDeviceId',deviceId)
    }else {
       store.dispatch('getDeviceId')
    }*/
    store.dispatch('getDeviceId')
  }
  next()
})
export default router
