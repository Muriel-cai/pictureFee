import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  // console.log(to, from, next)
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  const hasToken = getToken() // 判断是否获取到 token
  // console.log(hasToken, ' 确定用户是否已登录', store)
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      // 这里根据自己的情况来判断 是否已保存用户信息  我用的是name 已经判断 路由的长度
      next()
      //   } else {
      //     try {
      //       // get user info

      //       const routerData = await store.dispatch('user/getInfo') // 获取用户信息 包括 侧边导航和用户名等信息
      //       const accessRoutes = await store.dispatch('permission/generateRoutes', routerData) // 传动态导航
      //       // console.log("1111111+++++++++++++++",accessRoutes)
      //       router.addRoutes(accessRoutes) // 动态添加可访问路由
      //       // next({
      //       //   ...to,
      //       //   replace: true
      //       // })

    //       next({
    //         ...to
    //       })
    //     } catch (error) {
    //       console.log(error)
    //       // remove token and go to login page to re-login
    //       await store.dispatch('user/resetToken')
    //       Message.error(error + 'premission' + to.path || 'Has Error')
    //       next(`/login?redirect=${to.path}`)
    //       NProgress.done()
    //     }
    //   }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
