import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Management',
    name: 'Management',
    component: () => import('../views/Management.vue')
  },
  {
    path: '/Calculator',
    name: 'Calculator',
    component: () => import('../views/Calculator.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
