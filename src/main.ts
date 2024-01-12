import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue from '@okta/okta-vue'
import OktaSignIn from '@okta/okta-signin-widget'

const oktaSignIn = new OktaSignIn({
    baseUrl: 'https://trial-2076293.okta.com',
    clientId: '0oaadn5lubc4rqI3Q697',
    redirectUri: window.location.origin + '/login/callback'
    ,
    authParams: {
        pkce: true,
        issuer: 'https://trial-2076293.okta.com/oauth2/default',
        display: 'page',
        scopes: ['openid', 'profile', 'email']
    },
    features: { registration: true },
    useInteractionCodeFlow: false,
    useClassicEngine: true,
})

const oktaAuth = new OktaAuth({
    issuer: 'https://trial-2076293.okta.com/oauth2/default',
    clientId: '0oaadn5lubc4rqI3Q697',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email']
})

const app = createApp(App)

app.use(OktaVue, {
    oktaAuth,
    onAuthRequired: () => {
        router.push('/login')
    },
    onAuthResume: () => {
        router.push('/login')
    } })
app.use(router)

app.mount('#app')

export { oktaAuth, oktaSignIn }
