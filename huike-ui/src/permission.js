import router from './router'
import store from './store'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => {
          store.dispatch('GenerateRoutes').then(accessRoutes => {
            if(accessRoutes && accessRoutes.length > 1){
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              let flag = false
              if(accessRoutes && accessRoutes.length>0){
                for(let i=0;i<accessRoutes.length;i++){
                  if(accessRoutes[i] && accessRoutes[i]?.children?.length>0){
                    for(let j=0;j<accessRoutes[i].children.length;j++){
                      console.log('accessRoutes[i].children[j].path',accessRoutes[i].children[j].path)
                      console.log('accessRoutes[i].children[j].path',accessRoutes[i].children[j].name)
                      if('/'+accessRoutes[i].children[j].path===to.path){
                        flag = true
                        break
                      }
                    }
                  }
                }
              }
              // 获取第一个动态路由为默认跳转
              next({ ...to, path: flag?to.path:accessRoutes[0].children[0].path, replace: true }) // hack方法 确保addRoutes已完成
            }else{
              store.dispatch('LogOut').then(() => {
                MessageBox.alert('您的用户暂无权限，请联系平台管理员！','提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    next({ path: '/login' })
                  }
                })
              })
            }
          })
        })
        .catch(err => {
          store.dispatch('FedLogOut').then(() => {
            // Message.error(err)
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login' }) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
