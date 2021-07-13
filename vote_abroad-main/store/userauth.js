import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Toast } from 'buefy'
import AWSExportsDev from '../aws-exports-dev'
import AWSExportsProd from '../aws-exports-prod'
import { set } from 'vue-analytics'

const jwtDecode = require('jwt-decode')
const redirectUri = process.env.url

let webAuth
// let webAuth = new WebAuth({
//   domain: 'montg.auth0.com',
//   redirectUri: redirectUri + '/authenticating/',
//   clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
//   responseType: 'token id_token'
// })

export const state = () => ({
  idToken: null,
  sub: null,
  expirationDate: null,
  IdentityId: null,
  redirectPath: null,
  modal: null,
  authState: 'loggedOut',
  user: {
    firstName: null,
    middleName: null,
    lastName: null,
    emailAddress: null,
    language: 'en',
    mobileIntFormat: null,
    country: 'US',
    isDA: false,
    da: {}
  },
  session: {
    ip: null,
    loc: null,
    city: null,
    region: null,
    country: null
  },
  device: {
    type: null,
    orientation: null,
    os: null
  }
})

export const getters = {
  isExpired: state => {
    return state.expirationDate ? state.expirationDate * 1000 < Date.now() : null
  },
  isAuthenticated: state => {
    return Boolean(!state.isExpired && state.idToken)
  },
  userCountry: state => {
    return state.session.country || state.session.country
  }
}

export const mutations = {
  updateIdToken (state, idToken) {
    state.idToken = idToken
  },
  updateSub (state, sub) {
    state.sub = sub
  },
  updateExpirationDate (state, expirationDate) {
    state.expirationDate = expirationDate
  },
  updateSessionGeo (state, geo) {
    state.session = geo
  },
  updateDevice (state, device) {
    state.device = Object.assign({}, state.device, device)
    // this.$raven.setUserContext()
    // this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateUser (state, userObj) {
    state.user = Object.assign({}, state.user, userObj)
    // this.$raven.setUserContext()
    // this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateRedirectPath (state, path) {
    state.redirectPath = path
  },
  updateIdentityId (state, id) {
    state.IdentityId = id
    // this.$raven.setUserContext()
    // this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateAuthState (state, authState) {
    state.authState = authState
  }
}

export const actions = {
  // Dev webAuth
  // initializeWebAuth () {
  //   webAuth = new WebAuth({
  //     domain: 'montg.auth0.com',
  //     redirectUri: process.browser ? `${window.location.protocol}//${window.location.host}${this.app.localePath('authenticating')}` : redirectUri + this.app.localePath('authenticating'),
  //     clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
  //     responseType: 'token id_token'
  //   })
  // Production WebAuth
  initializeWebAuth () {
    console.log('ctx', process.env.stage)
    webAuth = new WebAuth({
      domain: process.env.stage === 'prod' ? 'votefromabroad.auth0.com' : 'montg.auth0.com',
      redirectUri: process.browser ? `${window.location.protocol}//${window.location.host}${this.app.localePath('authenticating')}` : redirectUri + this.app.localePath('authenticating'),
      clientID: process.env.auth0clientID,
      responseType: 'token id_token'
    })
  },
  sendEmailLink ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'email',
        send: 'link',
        email: state.user.emailAddress
      }, function (err, res) {
        if (err) {
          commit('updateAuthState', 'loginStartFailed')
          reject(err)
        }
        commit('updateAuthState', 'enteringCode')
        resolve(`Sent login link to ${state.user.emailAddress}`)
      })
    })
  },
  sendSmsCode ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'sms',
        send: 'code',
        phoneNumber: state.user.mobileIntFormat.replace(/\s/g, '')
      }, function (err, res) {
        if (err) {
          commit('updateAuthState', 'loginStartFailed')
          reject(err)
        }
        commit('updateAuthState', 'enteringCode')
        resolve()
      })
    })
  },
  async getSessionGeo ({commit, state, dispatch}) {
    if (!state.session.country) {
      let res = await axios.get('https://ipinfo.io/geo?token=3a36433b09c590')
      commit('updateSessionGeo', res.data)
      if (res.data.country) {
        dispatch('data/updateCountryData', res.data.country.toUpperCase(), {root: true})
      }
    }
  },
  async getUser ({commit, state, dispatch}) {
    await dispatch('getSessionGeo')
    commit('updateUser', {country: state.user.country !== 'US' && state.user.country ? state.user.country : state.session.country})
  },
  loginEmailVerify ({app, commit, dispatch, state}, code) {
    // let Analytics = this.app.$Analytics
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'email',
        email: state.user.emailAddress,
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          // Analytics.record('_userauth.auth_fail')
          commit('updateAuthState', 'codeEnterFail')
          reject(err)
        }
        commit('updateAuthState', 'authenticating')
        dispatch('setSession', authResult)
        resolve(authResult)
      })
    })
  },
  loginSmsVerify ({app, commit, dispatch, state}, code) {
    // let Analytics = this.app.$Analytics
    commit('updateAuthState', 'loading')
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'sms',
        phoneNumber: state.user.mobileIntFormat.replace(/\s/g, ''),
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          // Analytics.record('_userauth.auth_fail')
          commit('updateAuthState', 'codeEnterFail')
          reject(err)
        }
        commit('updateAuthState', 'authenticating')
        dispatch('setSession', authResult)
        resolve()
      })
    })
  },
  async setSession ({ state, rootState, commit, dispatch, app }) {
    await dispatch('initializeWebAuth')
    commit('updateAuthState', 'loading')
    this.app.Amplify.configure(process.env.stage === 'prod' ? AWSExportsProd : AWSExportsDev)
    // this.app.Amplify.configure(AWSExports)
    function parseHash () {
      return new Promise((resolve, reject) => {
        webAuth.parseHash({ hash: window.location.hash }, function (err, authResult) {
          window.location.hash = ''
          if (err) {
            commit('updateAuthState', 'loggedOut')
            reject(err)
          }
          resolve(authResult)
        })
      })
    }
    let Auth = this.app.$Auth
    // let Analytics = this.app.$Analytics
    function checkSession () {
      return new Promise((resolve, reject) => {
        webAuth.checkSession({
          scope: 'openid profile email'
        }, async function (err, authResult) {
          if (err) {
            let id = await Auth.currentCredentials().then(x => x.data.IdentityId)
            // console.log('id', id)
            if (id) set('userId', id)
            commit('updateAuthState', 'loggedOut')
            commit('updateIdentityId', id)
            // Analytics.updateEndpoint({
            //   UserId: id._identityId,
            //   // User attributes
            //   Attributes: {
            //     country: state.user.country,
            //     isDA: state.user.isDA,
            //     email: state.user.emailAddress,
            //     firstName: state.user.firstName
            //   },
            //   // Custom user attributes
            //   UserAttributes: {
            //     hobbies: ['piano', 'hiking']
            //   }
            // })
            return
          }
          resolve(authResult)
        })
      })
    }
    async function renewAuth () {
      return new Promise((resolve, reject) => {
        webAuth.renewAuth({
          usePostMessage: true
        }, (error, authResult) => {
          if (error) {
            // console.log(error)
            commit('updateAuthState', 'loggedOut')
          }
          resolve(authResult)
        })
      })
    }
    let hasHash = window.location.hash && window.location.hash.includes('access_token')
    let authResult = hasHash ? await parseHash() : await checkSession()
    if (authResult.expiresIn * 1000 > Date.now()) {
      authResult = await renewAuth()
    }
    let idToken = authResult.idToken
    // console.log(JSON.stringify(authResult.idTokenPayload.sub, null, 2))
    commit('updateSub', authResult.idTokenPayload.sub)
    commit('updateIdToken', idToken)
    commit('updateExpirationDate', jwtDecode(idToken).exp)
    if (state.redirectPath) {
      dispatch('redirect', state.redirectPath)
    }
    commit('updateUser', {isDA: jwtDecode(idToken)['https://demsabroad.org/isDA'], da: jwtDecode(idToken)['https://demsabroad.org/user']})
    await this.app.$Auth.federatedSignIn(
      process.env.stage === 'prod' ? 'votefromabroad.auth0.com' : 'montg.auth0.com',
      // 'montg.auth0.com', // development auth
      {
        token: idToken,
        expires_at: jwtDecode(idToken).exp
      },
      // a user object
      {
        name: jwtDecode(idToken)['https://demsabroad.org/isDA'] ? jwtDecode(idToken)['https://demsabroad.org/user'].lastName : '',
        email: jwtDecode(idToken)['https://demsabroad.org/isDA'] ? jwtDecode(idToken)['https://demsabroad.org/user'].email : ''
      }
    )
    await dispatch('requests/loadRequests', null, { root: true })
    if (jwtDecode(idToken)['https://demsabroad.org/isDA'] && (!rootState.requests || rootState.requests.requests.length === 0 || !rootState.requests.requests[rootState.requests.currentRequest].lastName)) {
      // console.log('jwtdata', jwtDecode(idToken)['https://demsabroad.org/user'])
      console.log(this.app.i18n.t('auth.daMembers'))
      Dialog.confirm({
        title: this.app.i18n.t('auth.daMembers'),
        message: this.app.i18n.t('auth.daMemberMessage'),
        cancelText: this.app.i18n.t('auth.daMemberCancel'),
        confirmText: this.app.i18n.t('auth.daMemberConfirm'),
        type: 'is-success',
        onConfirm: () => {
          commit('requests/update', jwtDecode(idToken)['https://demsabroad.org/user'], { root: true })
          Toast.open({
            message: this.app.i18n.t('auth.prefilled'),
            // message: `Your form has been pre-filled, please verify all information before submitting.`,
            type: 'is-success',
            position: 'is-top',
            duration: 8000
          })
        }
      })
    }
    if (!rootState.requests || rootState.requests.requests.length === 0) {
      let newRequest = {}
      if (state.user.mobileIntFormat && state.user.country) {
        newRequest.tel = state.user.mobileIntFormat
      }
      if (state.user.emailAddress) {
        newRequest.email = state.user.emailAddress
      }
      if (state.user.country || (state.session && state.session.country)) {
        newRequest.abrAdr = {countryiso: state.user.country || state.session.country}
      }
      commit('requests/update', newRequest, { root: true })
    }
    // this.$raven.setUserContext({
    //   email: state.user.emailAddress || null,
    //   id: state.user.IdentityId || null
    // })
    console.log('state', state)
    set('userId', state.IdentityId)
    commit('updateAuthState', 'loggedIn')
  },
  clearData ({ commit, dispatch }) {
    commit('updateIdToken', null)
    commit('updateSub', null)
    commit('updateExpirationDate', null)
    commit('updateUser', {
      country: null,
      emailAddress: null,
      isDA: false,
      firstName: null,
      middleName: null,
      lastName: null,
      mobileIntFormat: null,
      da: {}
    })
    commit('updateSessionGeo', {
      city: null,
      country: null,
      ip: null,
      loc: null,
      region: null
    })
    commit('requests/clearRequests', null, { root: true })
    // this.$raven.setUserContext()
    dispatch('getUser')
  },
  async logout ({ app, state, dispatch }) {
    // this.app.$Analytics.record('logout')
    this.app.$cookie.delete('vfaOptIn')
    await webAuth.logout({
      returnTo: process.browser ? window.location.origin + (state.user.language === 'es' ? '/es' : '') : redirectUri,
      // returnTo: redirectUri,
      // Dev client ID
      // clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u'
      // Prod client ID
      clientID: process.env.auth0clientID
    })
    dispatch('clearData')
  },
  redirect (ctx, path) {
    this.$router.onReady(() => this.$router.push(path))
  }
}
