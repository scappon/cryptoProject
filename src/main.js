// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { firestorePlugin } from 'vuefire'
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)

Vue.config.productionTip = false
Vue.use(firestorePlugin)

      new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
   })
  
/* eslint-disable no-new */
