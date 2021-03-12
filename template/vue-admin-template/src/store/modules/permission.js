import router, { constantRoutes, asyncRoutes, resetRouter } from '@/router'
import user from './user'
import settings from "@/settings";
// 判断权限中是否有这个页面
function hasPermission(route) {
  // 判断设置中是否需要权限控制
  if(!settings.needAuthority){
    return true
  }
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(state.roles)
  } else {
    return true
  }
}

// 将路由过滤后得到权限对应的路由
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = route
    if (hasPermission(tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  roles: localStorage.getItem('roles') || []
}

const getters = {
  routes(state) {
    return state.routes
  },
  roles(state) {
    return state.roles
  }
}

const mutations = {
  setRoutes: (state, routes) => {
    state.routes = constantRoutes.concat(routes)
    router.addRoutes(routes)
  },
  setRoles: (state, roles) => {
    state.roles = roles
    localStorage.setItem('roles', roles)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes)
      commit('setRoutes', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  setRoles({ commit }, roles) {
    return new Promise(resolve => {
      commit('setRoles', roles)
      resolve()
    })
  },
  // 退出登录
  logout({ dispatch }) {
    resetRouter()
    return new Promise((resolve, reject) => {
      user.mutations.SET_TOKEN(user.state, null)
      dispatch('setRoles', '')
      localStorage.clear()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
