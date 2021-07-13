import Vue from 'vue'
import VueIntercom from 'vue-intercom'

Vue.use(VueIntercom, { appId: process.env.dev === 'dev' ? 'h27cpfij' : 't392eszv' })
