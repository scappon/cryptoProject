import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import Home from '@/components/home/Home'
import UserProfile from '@/components/profile/UserProfile'
import firebase from 'firebase'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
     
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})


// route guarding
router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login
      next({name: 'Login'})
    }
  } else {
    next()
  }
})

export default router
