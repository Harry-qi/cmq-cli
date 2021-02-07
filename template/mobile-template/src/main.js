import Vue from 'vue'
import App from './App'
import { router } from './router'

import 'amfe-flexible'
import '@/assets/style/index.scss'

import components from '@/component'
Vue.use(components)

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
