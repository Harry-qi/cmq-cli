// 部分引入 vant 组件
import { Tab, Tabs, List, PullRefresh } from 'vant'
import searchInput from '@/component/SearchInput'
export default {
  install(Vue) {
    Vue.component('searchInput', searchInput)
    Vue.use(Tab)
    Vue.use(Tabs)
    Vue.use(List)
    Vue.use(PullRefresh)
  }
}
