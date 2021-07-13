export default function ({ store, redirect }) {
  if (store.getters['userauth/isAuthenticated']) {
    // console.log('authenticated')
    return redirect('/dashboard')
  }
}
