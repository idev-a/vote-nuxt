<template>
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card" style="width: auto">
      <figure class="image is-64x64 is-overlay" style="left:50%; transform: translate(-50%, 80%); z-index:41">
        <img src="/icon.png" :style="'animation: spinAround 3000ms infinite linear;'">
      </figure>
    <header class="modal-card-head">
    </header>
    <section class="modal-card-body">
      <section>
        <h3 class="title has-text-vfa has-text-centered is-4">{{$t('auth.authenticating')}}</h3>
        <span class="subtitle has-text-centered is-5">{{$t('auth.didYouKnow')}}{{didYouKnow}}</span>
      </section>

    </section>
    <footer class="modal-card-foot">
      <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'your-information'} })">{{$t('auth.anonymousStart')}}</nuxt-link>
    </footer>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'account',
  data () {
    return {
      didYouKnow: ''
    }
  },
  computed: {
    ...mapState('userauth', ['authState'])
  },
  watch: {
    authState (val, oldVal) {
      if (val === 'loggedIn') {
        this.$router.replace(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
      }
    }
  },
  created () {
    let trivia = [this.$t('auth.trivia1'), this.$t('auth.trivia2'), this.$t('auth.trivia3')]
    this.didYouKnow = trivia[Math.floor(Math.random() * Math.floor(trivia.length))]
  },
  mounted () {
    if (this.authState === 'loggedIn' || !window.location.hash.includes('access_token')) {
      this.$router.replace(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
    }
  }
}
</script>

<style>

</style>
