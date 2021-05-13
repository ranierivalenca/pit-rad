import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { auth } from './firebase'

import '@/assets/css/tailwind.css'

Vue.config.productionTip = false

let app

auth.onAuthStateChanged(async user => {
  console.log('auth State changed')
  if (user) {
    console.log('has user')
    await store.dispatch('fetchData', user)
  }
  if (!app) {
    console.log('creating app')
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
