
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'
// Analytics,

export default ({ app }, inject) => {
  // Set `i18n` instance on `app`
  // This way we can use it in middleware and pages `asyncData`/`fetch`
  // app.$Analytics = Analytics
  app.Amplify = Amplify
  app.$API = API
  app.$Auth = Auth
  app.$graphqlOperation = graphqlOperation
}
// import Vue from 'vue'

// const MyPlugin = {
//   // The install method is all that needs to exist on the plugin object.
//   // It takes the global Vue object as well as user-defined options.
//   install (Vue, options) {
//     Vue.prototype.$myAddedProperty = 'Example Property'
//     Vue.prototype.$API = API
//     Vue.prototype.$myAddedMethod = function () {
//       // console.log(API)
//       return API
//     }
//     // We call Vue.mixin() here to inject functionality into all components.
//     // Vue.mixin({
//     //   // Anything added to a mixin will be injected into all components.
//     //   // In this case, the mounted() method runs when the component is added to the DOM.
//     //   mounted () {
//     //     console.log('Mounted!')
//     //   }
//     // })
//   }
// }

// Vue.use(MyPlugin)

// // export default MyPlugin
