import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import settings from '@/settings'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

// 路由变化 - 判断权限
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置页面标题
  let pageTitle = settings.title
  if (to.meta.title) {
    pageTitle = `${to.meta.title} - ${settings.title}`
  }
  document.title = pageTitle

  const token = store.getters['token']
  if (token) { // 有 token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoutes = store.getters['permission/routes'] && store.getters['permission/routes'].length > 0
      if (!hasRoutes) {
        store.dispatch('permission/generateRoutes').then(() => {
          next(to)
        })
      } else {
        next()
      }
    }
  } else { // 没有 token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
