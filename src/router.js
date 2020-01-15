import Vue
  from 'vue'
import Router
  from 'vue-router'
import Login
  from "./views/Login";
import {auth} from './firebase-config'
import HelloWorld
  from "@/components/HelloWorld";

Vue.use(Router)

const routes = [
  {
    path: '*',
    redirect: '/login',
  },
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: HelloWorld,
    name: 'Home',
    meta: {
      requiresAuth: true
    }
  }
]

const router = new Router({routes})

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('Login')
  else if (!requiresAuth && !!currentUser) next('Home')
  else next()

})

export default router
