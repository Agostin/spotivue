import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'

const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const UploadManagerView = () => import('@/views/UploadManagerView.vue')
const SongView = () => import('@/views/SongView.vue')

const routes = [
  {
    path: '/',
    component: HomeView,
    name: 'home'
  },
  {
    path: '/about',
    component: AboutView,
    name: 'about'
  },
  {
    path: '/manage',
    component: UploadManagerView,
    name: 'manage',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/song/:id',
    component: SongView,
    name: 'song'
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  } else {
    const store = useUserStore()
    const view = !store.userLoggedIn ? { name: 'home' } : undefined

    next(view)
    return
  }
})

export default router
