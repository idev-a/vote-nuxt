<template>
  <div class="section">
    <div class="container is-widescreen">
    <!-- <section class="columns is-centered is-multiline"> -->
      <!-- <div @click="goBack" class="column button is-narrow is-hidden-touch is-flex" style="align-items:center;justify-content:center;"><b-icon icon="chevron-circle-left"></b-icon></div> -->
      <!-- <div class="column is-three-quarters-desktop is-8-widescreen is-7-fullhd"> -->
        <!-- <b-tabs type="is-boxed" v-model="currentRequest" @change="addRequest($event)">
          <b-tab-item v-for="(request) in tabs" :key="request.id" :label="request.firstName || 'new request'">
          </b-tab-item>
          <nuxt-child></nuxt-child>
        </b-tabs> -->
        <nuxt-child></nuxt-child>
        <!-- <button @click="removeRequest" class="button is-text is-small">Delete this Request</button> -->
      <!-- </div> -->
      <!-- <div @click="goForward" class="column is-narrow is-hidden-touch is-flex" style="align-items:center;justify-content:center;"><b-icon icon="chevron-circle-right"></b-icon></div> -->
    <!-- </section> -->
    </div>
  </div>
</template>

<script>
export default {
  transition: 'test',
  // async mounted () {
  //   var cur = this.$store.state.requests.currentRequest
  //   await this.$store.commit('requests/changeCurrent', 0)
  //   this.$store.commit('requests/changeCurrent', cur)
  // },
  async fetch ({ store }) {
    await store.dispatch('data/getElections')
  },
  computed: {
    requests: function () {
      return this.$store.state.requests.requests ? this.$store.state.requests.requests : []
    },
    columnClass: function () {
      return {
        column: true,
        'is-three-fifths': this.$route.path !== '/request/canvas' || this.$route.path !== '/request/canvas/',
        'is-10': this.$route.path === '/request/canvas' || this.$route.path === '/request/canvas/'
      }
    },
    rte: function () {
      return this.$route.path === '/request/canvas' || this.$route.path === '/request/canvas/'
    },
    currentRequest: {
      get () {
        return this.$store.state.requests.currentRequest
      },
      set (value) {
        this.$store.commit('requests/changeCurrent', value)
      }
    },
    tabs: function () {
      return this.requests.concat([{
        id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })(),
        firstName: 'add a family member'
      }])
    }
  },
  methods: {
    addRequest: function (event) {
      // console.log(event, this.tabs.length)
      // add a request if at end
      if (event === this.tabs.length - 1) {
        this.$store.commit('requests/add')
        // this.activeTab = event
      }
    },
    removeRequest: function () {
      this.$store.dispatch('requests/removeCurrent')
    }
    // goBack: function () {
    //   console.log('back')
    // },
    // goForward: function () {
    //   console.log('forward')
    // }
  }
}
</script>
