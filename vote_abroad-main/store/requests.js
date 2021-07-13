export const state = () => ({
  currentRequest: 0,
  requests: []
})

export const getters = {
  getRequestById: (state) => (id) => {
    return state.requests.find(request => request.id === id)
  },
  getCurrent: (state) => {
    return state.requests.length ? state.requests[state.currentRequest] : {}
  },
  getCurrentDeadlines: (state, getters, rootState, rootGetters) => {
    let currentRequest = getters.getCurrent
    let voterState = currentRequest && currentRequest.votAdr ? currentRequest.votAdr.S : null
    let voterType = currentRequest && currentRequest.voterClass ? (/military|milSpouse|natGuart/i.test(currentRequest.voterClass) ? 'Military' : 'Citizen') : null
    // let registrationStatus = currentRequest && currentRequest.isRegistered ? currentRequest.isRegistered : null
    return rootGetters['data/flattenElectionRules']
      .filter(x => voterState ? x.state === voterState : true)
      .filter(x => voterType ? x.voterType.includes(voterType) : true)
      .filter(x => new Date(x.electionDate).getTime() > new Date().getTime())
  }
}

export const mutations = {
  changeCurrent (state, index) {
    state.currentRequest = index
  },
  clearRequests (state) {
    state.requests = []
  },
  add (state) {
    state.requests.push({
      // id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })()
    })
  },
  remove (state, { todo }) {
    state.requests.splice(state.requests.indexOf(todo), 1)
  },
  removeLast (state) {
    state.requests.splice(state.requests.length - 1, 1)
  },
  removeCurrent (state) {
    let cur = state.currentRequest
    state.currentRequest = cur ? cur - 1 : 0
    state.requests.splice(cur, 1)
  },
  update (state, {...args} = {}) {
    state.requests.splice(state.currentRequest, 1, Object.assign({}, state.requests[state.currentRequest], args))
    // this.$raven.setExtraContext()
    // this.$raven.setExtraContext(state.requests[state.currentRequest])
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}

export const actions = {
  // ravenContext ({state}) {
  //   // this.$raven.setExtraContext() // Clear all extra data from the context.
  //   // this.$raven.setExtraContext(state.requests[state.currentRequest])
  // },
  // recordAnalytics ({app}, payload) {
  //   // console.log(payload)
  //   // this.app.$Analytics.record(payload.event, payload.attributes || {}, payload.metrics || {})
  // },
  async loadRequests ({commit, state, app}) {
    const API = this.app.$API
    const graphqlOperation = this.app.$graphqlOperation
    const UserRequests = `query UserRequests {
      userRequests{
        items {
          id
          createdAt
          firstName
          middleName
          lastName
          suffix
          party
          dob
          sex
          stateSpecial
          joinDa
          nbid
          voterClass
          recBallot
          isRegistered
          date
          status
          abrAdr {
            A
            B
            C
            D
            S
            Z
            X
            countryiso
            alt1
            alt2
            alt3
            alt4
            alt5
            usesAlternateFormat
            formatted
          }
          fwdAdr {
            A
            B
            D
            C
            S
            Z
            X
            countryiso
            alt1
            alt2
            alt3
            alt4
            alt5
            usesAlternateFormat
            formatted
          }
          votAdr {
            A
            B
            D
            C
            S
            X
            Z
            Y
            countryiso
            alt1
            alt2
            alt3
            alt4
            alt5
            usesAlternateFormat
          }
          tel
          email
          altEmail
          fax
          leo {
            a1
            a2
            a3
            c
            d
            e
            f
            i
            j
            n
            p
            s
            t
            z
          }
        }
      }
    }`
    const res = await API.graphql(graphqlOperation(UserRequests))
    const loadedRequests = res.data.userRequests.items
    loadedRequests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    // console.log(loadedRequests)
    commit('clearRequests')
    loadedRequests.forEach(request => {
      delete request.createdAt
      // console.log(request)
      commit('add')
      commit('changeCurrent', state.requests.length - 1)
      commit('update', request)
    })
    return 'done'
  },
  async updateRequest ({commit, state, rootState, app}, payload) {
    // console.log('payload', payload)
    const API = this.app.$API
    const graphqlOperation = this.app.$graphqlOperation
    const CreateRequest = `mutation CreateRequest($input: CreateRequestInput!){
      createRequest(input: $input) {
        id
        firstName
        middleName
        lastName
        abrAdr{
          A
          B
          D
          C
          S
          Z
          X
          countryiso
        }
      }
    }`
    let currentRequestState = Object.assign({}, state.requests[state.currentRequest])
    delete currentRequestState.identification
    currentRequestState.previousName = currentRequestState.previousName || null
    currentRequestState.tel = currentRequestState.tel || null
    currentRequestState.email = currentRequestState.email || null
    currentRequestState.status = payload.status
    currentRequestState.sub = rootState.userauth.sub || null
    if (currentRequestState.party === '') currentRequestState.party = 'other'
    const stateRequestInput = {input: currentRequestState}
    const newRequest = await API.graphql(graphqlOperation(CreateRequest, stateRequestInput))
    commit('update', {id: newRequest.data.createRequest.id})
    return newRequest.data
  },
  addOrUpdate ({ commit, state }, {id, ...args} = {}) {
    if (!state.requests.findIndex(x => x.id === id) || !id) {
      // add request
      commit('add')
      id = state.requests[state.requests.length - 1].id
    }
    commit('update', ...args)
  },
  refresh ({ commit, state, rootState }) {
    commit('add')
    commit('removeLast')
    if (state.requests.length === 0) {
      commit('add')
      commit('update', {
        email: rootState.userauth.user.emailAddress || '',
        tel: rootState.userauth.user.mobileIntFormat || ''
      })
    }
  },
  removeCurrent ({ commit, state, rootState }) {
    commit('removeCurrent')
    if (state.requests.length === 0) {
      commit('add')
      commit('update', {
        email: rootState.userauth.user.emailAddress,
        country: rootState.userauth.session.country
      })
    }
  }
}

// old requests.js
// export const state = () => ({
//   currentRequest: 0,
//   requests: []
// })

// export const getters = {
//   getRequestById: (state) => (id) => {
//     return state.requests.find(request => request.id === id)
//   },
//   getCurrent: (state) => {
//     return state.requests[state.currentRequest] || {firstName: null, lastName: null}
//   }
// }

// export const mutations = {
//   changeCurrent (state, index) {
//     state.currentRequest = index
//   },
//   clearRequests (state) {
//     state.requests = []
//   },
//   add (state) {
//     state.requests.push({
//       // id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })()
//     })
//   },
//   // refresh (state, commit) {
//   //   state.requests.push({})
//   //   state.requests.splice(state.requests.length - 1, 1)
//   //   console.log(state.requests.length)
//   //   if (state.requests.length === 0) {
//   //     commit('add')
//   //   }
//   // },
//   remove (state, { todo }) {
//     state.requests.splice(state.requests.indexOf(todo), 1)
//   },
//   removeLast (state) {
//     state.requests.splice(state.requests.length - 1, 1)
//   },
//   removeCurrent (state) {
//     let cur = state.currentRequest
//     state.currentRequest = cur ? cur - 1 : 0
//     state.requests.splice(cur, 1)
//   },
//   update (state, {...args} = {}) {
//     state.requests.splice(state.currentRequest, 1, Object.assign({}, state.requests[state.currentRequest], args))
//     this.$raven.setExtraContext()
//     this.$raven.setExtraContext(state.requests[state.currentRequest])
//   },
//   toggle (state, todo) {
//     todo.done = !todo.done
//   }
// }

// export const actions = {
//   ravenContext ({state}) {
//     this.$raven.setExtraContext() // Clear all extra data from the context.
//     this.$raven.setExtraContext(state.requests[state.currentRequest])
//   },
//   recordAnalytics ({app}, payload) {
//     // console.log(payload)
//     this.app.$Analytics.record(payload.event, payload.attributes || {}, payload.metrics || {})
//   },
//   async loadRequests ({commit, state, app}) {
//     const API = this.app.$API
//     const graphqlOperation = this.app.$graphqlOperation
//     const UserRequests = `query UserRequests {
//       userRequests{
//         items {
//           id
//           createdAt
//           firstName
//           middleName
//           lastName
//           suffix
//           party
//           dob
//           sex
//           stateSpecial
//           joinDa
//           nbid
//           voterClass
//           recBallot
//           isRegistered
//           date
//           status
//           abrAdr {
//             A
//             B
//             C
//             D
//             S
//             Z
//             X
//             country
//             countryiso
//             alt1
//             alt2
//             alt3
//             alt4
//             alt5
//             usesAlternateFormat
//           }
//           fwdAdr {
//             poBox
//             premise
//             thoroughfare
//             dependentlocality
//             locality
//             administrativearea
//             stateISO
//             postalcode
//             country
//             countryiso
//             alt1
//             alt2
//             alt3
//             alt4
//             alt5
//             usesAlternateFormat
//           }
//           votAdr {
//             poBox
//             premise
//             thoroughfare
//             dependentlocality
//             locality
//             administrativearea
//             stateISO
//             postalcode
//             country
//             countryiso
//             alt1
//             alt2
//             alt3
//             alt4
//             alt5
//             usesAlternateFormat
//           }
//           tel {
//             country
//             intNumber
//             isValidPhone
//             isValidEmail
//             type
//             rawInput
//           }
//           email
//           altEmail
//           fax {
//             country
//             intNumber
//             isValidPhone
//             type
//             rawInput
//           }
//           leo {
//             a1
//             a2
//             a3
//             c
//             d
//             e
//             f
//             i
//             j
//             n
//             p
//             s
//             t
//             z
//           }
//         }
//       }
//     }`
//     const res = await API.graphql(graphqlOperation(UserRequests))
//     const loadedRequests = res.data.userRequests.items
//     loadedRequests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
//     // console.log(loadedRequests)
//     commit('clearRequests')
//     loadedRequests.forEach(request => {
//       delete request.createdAt
//       // console.log(request)
//       commit('add')
//       commit('changeCurrent', state.requests.length - 1)
//       commit('update', request)
//     })
//     return 'done'
//   },
//   async updateRequest ({commit, state, app}, payload) {
//     // console.log('payload', payload)
//     const API = this.app.$API
//     const graphqlOperation = this.app.$graphqlOperation
//     const CreateRequest = `mutation CreateRequest($input: CreateRequestInput!){
//       createRequest(input: $input) {
//         id
//         firstName
//         middleName
//         lastName
//         abrAdr{
//           A
//           B
//           D
//           C
//           S
//           Z
//           X
//           country
//           countryiso
//         }
//       }
//     }`
//     // const requestInput = {
//     //   input: {
//     //     firstName: 'Tomorrow',
//     //     middleName: 'Party',
//     //     lastName: 'Montgomery',
//     //     abrAdr: {
//     //       premise: 'Flat 7, 27/f Block C, Greenwood Garden',
//     //       thoroughfare: '7-11 Shakok St',
//     //       locality: 'Shatin',
//     //       administrativearea: 'New Territories',
//     //       countryiso: 'HK',
//     //       country: 'Hong Kong'
//     //     }
//     //   }
//     // }
//     let currentRequestState = Object.assign({}, state.requests[state.currentRequest])
//     delete currentRequestState.identification
//     currentRequestState.status = payload.status
//     const stateRequestInput = {input: currentRequestState}
//     const newRequest = await API.graphql(graphqlOperation(CreateRequest, stateRequestInput))
//     // console.log('id', newRequest.data.createRequest.id)
//     commit('update', {id: newRequest.data.createRequest.id})
//     return newRequest.data
//   },
//   addOrUpdate ({ commit, state }, {id, ...args} = {}) {
//     if (!state.requests.findIndex(x => x.id === id) || !id) {
//       // add request
//       commit('add')
//       id = state.requests[state.requests.length - 1].id
//     }
//     commit('update', ...args)
//   },
//   refresh ({ commit, state, rootState }) {
//     commit('add')
//     commit('removeLast')
//     if (state.requests.length === 0) {
//       commit('add')
//       commit('update', {
//         email: rootState.userauth.user.emailAddress,
//         tel: {
//           intNumber: rootState.userauth.user.mobileIntFormat || undefined,
//           country: rootState.userauth.session.country || undefined
//         }
//       })
//     }
//   },
//   removeCurrent ({ commit, state, rootState }) {
//     commit('removeCurrent')
//     if (state.requests.length === 0) {
//       commit('add')
//       commit('update', {
//         email: rootState.userauth.user.emailAddress,
//         country: rootState.userauth.session.country
//       })
//     }
//   }
// }
