import { TopPage } from './components/TopPage.js';
import { Signup } from "./components/Signup.js";
import { SessionPage } from "./components/SessionPage.js";

import { auth } from "./store.js";

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'TopPage',
            component: TopPage,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup,
            meta: {
                requiresAuth: false,
                onlyNotLogin: true,
            },
        },
        {
            path: '/session/:sessionId',
            name: 'Session',
            component: SessionPage,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
})

// check login
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const onlyNotLogin = to.matched.some(record => record.meta.onlyNotLogin)

    auth.onAuthStateChanged(function (user) {
        if (user) {
            if (requiresAuth) {
                next()
            } else {
                if (onlyNotLogin) {
                    next('/')
                }
            }
        } else {

            if (requiresAuth) {
                next({ name: 'Signup' })
            } else {
                next()
            }
        }
    })

})

Vue.use(VueRouter)

export { router };