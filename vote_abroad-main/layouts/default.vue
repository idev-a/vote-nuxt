<template>
<div>
  <div v-if="!offline">
    <transition name="fade">
      <div v-if="!optedIn && !privacyRoute && !isPrivacyOptInModalActive" class="notices is-top ">
        <div :class="['snackbar', 'is-warning', 'is-top', 'is-inline-mobile', {'is-hidden-mobile': /index/.test($route.name)}]">
          <!-- <p class="text">Vote From Abroad helps US citizens register to vote quickly and easily, but to do so we need to collect your personal information. Your data privacy is our top concern, so please read and accept our <nuxt-link :to="localePath({ name: 'page', params: {page: 'privacy'}})" class="has-text-warning">privacy policy</nuxt-link>, <nuxt-link :to="localePath({ name: 'page', params: {page: 'cookie-policy'}})" class="has-text-warning">cookie policy</nuxt-link> and <nuxt-link :to="localePath({ name: 'page', params: {page: 'terms-of-use'}})" class="has-text-warning">terms of service.</nuxt-link></p> -->
          <i-18n path="optIn.optIn" tag="p" class="text">
            <nuxt-link place="privacyPolicy" :to="localePath({ name: 'page', params: {page: 'privacy'}})" class="has-text-warning">{{$t('optIn.privacyPolicy')}}</nuxt-link>
            <nuxt-link place="cookiePolicy" :to="localePath({ name: 'page', params: {page: 'cookie-policy'}})" class="has-text-warning">{{ $t('optIn.cookiePolicy') }}</nuxt-link>
            <nuxt-link place="termsOfUse" :to="localePath({ name: 'page', params: {page: 'terms-of-use'}})" class="has-text-warning">{{ $t('optIn.termsOfUse') }}</nuxt-link>
          </i-18n>
          <div class="action is-warning">
            <button
              @click="optIn"
              class="button is-dark">{{ $t('optIn.agree') }}</button>
          </div>
          <!-- <vfa-opt-in
            @optIn="optIn"
            :privacyPage="localePath({ name: 'page', params: {page: 'privacy'}})"
            :cookiePage="localePath({ name: 'page', params: {page: 'cookie-policy'}})"
            :tosPage="localePath({ name: 'page', params: {page: 'terms-of-use'}})"></vfa-opt-in> -->
        </div>
      </div>
    </transition>
  <div :class="['hero', 'is-fullheight', 'bg', {'bg-image': isBgImage}]">
    <div class="hero-head">
      <header :class="`navbar ${isBgImage ? 'is-vfa' : 'is-light'}`">
        <div class="container">
          <div class="navbar-brand">
            <span class="burger is-hidden-desktop"></span>
            <nuxt-link :to="localePath('index')" class="navbar-item is-size-5 logo" :title="$t('homepage.homeTitle')" exact>
            </nuxt-link>
            <span :class="[{'is-active': isMobileMenuActive}, 'navbar-burger', 'burger']" @click="isMobileMenuActive = !isMobileMenuActive">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="[{'is-active': isMobileMenuActive},'navbar-menu', 'is-paddingless']">
            <div class="navbar-end">
              <span class="navbar-tabs">
                <a v-if="isAuthenticated"
                  class="navbar-item is-size-5 is-expanded has-text-centered"
                  @click="$store.dispatch('userauth/logout')">
                  <b-icon
                    pack="fas"
                    icon="sign-out-alt"
                    size="is-small">
                  </b-icon>
                  <span>{{ $t('menu.logout')}}</span>
                </a>
                <nuxt-link v-for="(locale, index) in $i18n.locales"
                  :key="index"
                  :exact="true"
                  :class="['navbar-item is-size-5', 'is-tab', {'is-active': locale.code === $i18n.locale}]"
                  :to="switchLocalePath(locale.code)"><span class="is-hidden-desktop">{{ locale.name }}</span><span class="is-hidden-touch">{{ locale.code.toUpperCase() }}</span>
                </nuxt-link>
              </span>
              <div class="navbar-item is-size-5 has-dropdown is-hoverable" style="order:-1; margin-right: 10px;">
                <nuxt-link :to="localePath('elections')" class="navbar-link">
                  {{$t('menu.upcomingElections')}}
                </nuxt-link>

                <div class="navbar-dropdown">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${localizeElectionType(election.electionType)}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item is-size-5 ${index > 3 ? 'is-hidden-touch' : ''}`">
                    <div class="calendar">
                      <header class="calendar-month">{{new Date(election.date).toLocaleDateString(dateFormat, {month: 'short'}) }}</header>
                      <div class="calendar-date">
                        {{ new Date(election.date).toLocaleDateString(dateFormat, {day: 'numeric'}) }}
                      </div>
                    </div>
                    <span class="is-size-6"><span class="has-text-weight-semibold">{{ election.state }}</span> - {{ localizeElectionType(election.electionType) }}</span>
                  </nuxt-link>
                  <hr class="navbar-divider">
                  <nuxt-link :to="localePath({ name: 'elections' })" class="navbar-item is-size-5">{{$t('menu.allElections')}}</nuxt-link>
                </div>
              </div>
              <div class="navbar-item is-size-5 is-hoverable" style="order: -1;">
                <nuxt-link :to="localePath('states')" :class="{ 'has-text-white': !isMobileMenuActive && ['/', '/es'].includes($route.path)}">
                  {{$t('menu.stateGuide')}}
                </nuxt-link>
              </div>
              <div class="navbar-item is-size-5 is-hoverable" style="order: -1; margin-right: 20px;">
                <nuxt-link :to="localePath('faqs')" :class="{ 'has-text-white': !isMobileMenuActive && ['/', '/es'].includes($route.path)}">
                  {{$t('menu.faq')}}
                </nuxt-link>
              </div>
              <!-- <div class="navbar-item is-size-5 has-dropdown is-hoverable" style="order:-1;">
                <nuxt-link :to="localePath('faqs')" class="navbar-link">
                  {{$t('menu.help')}}
                </nuxt-link>

                <div class="navbar-dropdown is-right">
                  <nuxt-link
                    :to="localePath({ name: 'faqs-slug', params: { slug: faq.slug } })"
                    v-for="(faq, index) in topFaqs"
                    :key="index"
                    :title="faq[`title${$i18n.locale.toUpperCase()}`]"
                    class="navbar-item is-size-5">
                    <span class="panel-icon">
                      <i class="fas fa-question-circle"></i>
                    </span>
                    {{faq[`title${$i18n.locale.toUpperCase()}`] | truncate(100)}}
                  </nuxt-link>
                  <hr class="navbar-divider">
                  <nuxt-link :to="localePath({ name: 'faqs' })" class="navbar-item is-size-5">{{$t('menu.moreFAQs')}}</nuxt-link>
                  <hr class="navbar-divider">
                  <a @click="showIntercom" class="navbar-item is-size-5">{{$t('menu.contactHelp')}}</a>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </header>
    </div>
    <nuxt/>
    <div class="hero-foot">
      <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
          <ul>
            <!-- <li :class="{'is-active': $route.path === localePath({ name: 'faqs-slug', params: { slug: '5' } })}">
              <nuxt-link :to="localePath({ name: 'faqs-slug', params: { slug: '5' } })">
                {{$t('menu.howto')}}
              </nuxt-link>
            </li>
            <li :class="{'is-active': $route.path === localePath('faqs')}">
              <nuxt-link :to="localePath('faqs')">
                {{$t('menu.helpfaq')}}
              </nuxt-link>
            </li> -->
            <li :class="{'is-active': $route.path === localePath({ name: 'page', params: {page: 'about-us'}})}">
              <nuxt-link :to="localePath({ name: 'page', params: {page: 'about-us'}})">
                {{$t('menu.about')}}
              </nuxt-link>
            </li>
            <!-- <li :class="{'is-active': $route.path === localePath('states')}">
              <nuxt-link :to="localePath('states')">
                {{$t('menu.stateGuide')}}
              </nuxt-link>
            </li> -->
          </ul>
        </div>
      </nav>
    </div>
  </div>
  <section class="hero is-vfa">
    <div class="hero-body">
      <div class="container">
        <nav class="level">
          <p class="level-item has-text-centered">
            <nuxt-link :to="localePath({ name: 'page', params: {page: 'privacy'}})" class="link has-text-vfalight">{{$t('menu.privacy')}}</nuxt-link>
          </p>
          <p v-html="$t('menu.disclaimer')" class="level-item has-text-centered is-size-7 has-text-vfalight">
          </p>
          <p class="level-item has-text-centered">
            <nuxt-link :to="localePath({ name: 'page', params: {page: 'terms-of-use'}})" class="link has-text-vfalight">{{$t('menu.terms')}}</nuxt-link>
          </p>
        </nav>
      </div>
    </div>
  </section>
</div>
<!-- </div> -->
  <!-- <div class="hero is-fullheight" v-else>
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-danger">
          {{$t('menu.offlineTitle')}}
        </h1>
        <h2 class="subtitle">
          {{$t('menu.offlineSubtitle')}}
        </h2>
      </div>
    </div>
  </div> -->
  <img src="https://p1.zemanta.com/p/7069/7418/" height="1" width="1" border="0" alt="" />
</div>
</template>

<script>
import VfaOptIn from '~/components/VfaOptIn'
import { mapState, mapMutations } from 'vuex'

function detectIE () {
  var ua = window.navigator.userAgent
  var msie = ua.indexOf('MSIE ')
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
  } // IE 10 or older => return version number
  var trident = ua.indexOf('Trident/')
  if (trident > 0) {
    var rv = ua.indexOf('rv:')
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
  } // IE 11 => return version number
  return false
}

export default {
  components: {
    VfaOptIn
  },
  head () {
    return {
      script: [
        { src: 'https://secure.adnxs.com/px?id=1388183&t=1', async: true, defer: true }
      ]
    }
  },
  data () {
    return {
      isMobileMenuActive: false,
      optedIn: true,
      isModalPrivacyOptInActive: false,
      device: {},
      topFaqs: [
        {
          titleEN:
            'Can I vote in midterm (non-presidential) and primary elections?',
          titleES:
            '¿Puedo votar en las elecciones (no presidenciales) de mitad de período?',
          slug: '2'
        },
        {
          titleEN: 'Can I vote in state and local elections?',
          titleES: '¿Puedo votar en las elecciones locales y estatales?',
          slug: '3'
        },
        {
          titleEN:
            'How do I register to vote or request a ballot as a U.S. Citizen living abroad?',
          titleES:
            '¿Cómo me registro como votante o cómo solicito una boleta electoral en mi condición de ciudadano de los Estados Unidos que vive en el extranjero?',
          slug: '5'
        },
        {
          titleEN: "Can I register to vote if I've never resided in the U.S.?",
          titleES:
            '¿Puedo registrarme para votar si nunca he vivido en los Estados Unidos?',
          slug: '10'
        },
        {
          titleEN:
            "It's getting close to the election and I haven't received my blank ballot yet; what should I do?",
          titleES:
            'Se acercan las elecciones y aún no he recibido mi boleta electoral en blanco. ¿Qué debo hacer?',
          slug: '24'
        }
      ]
    }
  },
  computed: {
    privacyRoute () {
      return !/request|index|dashboard/i.test(this.$route.name)
    },
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
    offline () {
      return process.env.offline && process.env.offline !== 'false'
    },
    upcomingElections: function () {
      return this.$store.state.upcomingElections
    },
    isBgImage: function () {
      return (
        this.$route.name &&
        (this.$route.name.includes('index') ||
          this.$route.name.includes('authenticating'))
      )
    },
    test: function () {
      return this.$route.name
    },
    isAuthenticated: function () {
      return this.$store.getters['userauth/isAuthenticated']
    },
    ...mapState(['isPrivacyOptInModalActive'])
  },
  watch: {
    isPrivacyOptInModalActive (val) {
      console.log(this.$cookie.get('vfaOptIn'))
      if (!this.$cookie.get('vfaOptIn')) {
        this.optedIn = false
      } else this.optedIn = true
    }
  },
  filters: {
    truncate: function (text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  },
  methods: {
    optIn () {
      this.$cookie.set('vfaOptIn', true, 1)
      this.optedIn = true
    },
    showIntercom () {
      this.$intercom.show()
    },
    camelize (str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    localizeElectionType (electionType) {
      return this.$te(`election.${this.camelize(electionType)}`)
        ? this.$t(`election.${this.camelize(electionType)}`)
        : electionType
    },
    ...mapMutations(['togglePrivacyModalActiveState'])
  },
  async mounted () {
    console.log('-', process.env.siteName, process.env.stage)
    if (!this.$cookie.get('vfaOptIn')) {
      this.optedIn = false
    }
    // console.log('process.env.stage:', process.env.stage)
    // this.$snackbar.open({
    //   message: process.env.stage === 'dev' ? 'You are on the SANDBOX site. Messages will only be sent to your address (Your LEO will NOT receive your FPCA.)' : 'This beta site is now live.  If you submit an FPCA it will be sent to your Election Official.',
    //   type: 'is-warning',
    //   position: this.optedIn ? 'is-top' : 'is-bottom',
    //   actionText: 'I Understand',
    //   indefinite: true
    // })
    function checkDeviceSupport (callback) {
      if (!canEnumerate) {
        return
      }
      if (
        !navigator.enumerateDevices &&
        window.MediaStreamTrack &&
        window.MediaStreamTrack.getSources
      ) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
          window.MediaStreamTrack
        )
      }
      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator)
      }
      if (!navigator.enumerateDevices) {
        if (callback) {
          callback()
        }
        return
      }
      MediaDevices = []
      navigator.enumerateDevices(function (devices) {
        devices.forEach(function (_device) {
          var device = {}
          for (var d in _device) {
            device[d] = _device[d]
          }
          if (device.kind === 'audio') {
            device.kind = 'audioinput'
          }
          if (device.kind === 'video') {
            device.kind = 'videoinput'
          }
          var skip
          MediaDevices.forEach(function (d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true
            }
          })
          if (skip) {
            return
          }
          if (!device.deviceId) {
            device.deviceId = device.id
          }
          if (!device.id) {
            device.id = device.deviceId
          }
          if (!device.label) {
            device.label = 'Please invoke getUserMedia once.'
            if (!isHTTPs) {
              device.label =
                'HTTPs is required to get label of this ' +
                device.kind +
                ' device.'
            }
          } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true
            }
            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true
            }
          }
          if (device.kind === 'audioinput') {
            hasMicrophone = true
          }
          if (device.kind === 'audiooutput') {
            hasSpeakers = true
          }
          if (device.kind === 'videoinput') {
            hasWebcam = true
          }
          MediaDevices.push(device)
        })
        if (callback) {
          callback()
        }
      })
    }
    if (process.browser) {
      window.onNuxtReady(app => {
        let isIE = detectIE()
        this.$store.commit('userauth/updateDevice', { isIE })
        app.$intercom.boot()
      })
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function (callback) {
          navigator.mediaDevices.enumerateDevices().then(callback)
        }
      }
      var MediaDevices = []
      var isHTTPs = location.protocol === 'https:'
      var canEnumerate = false

      if (
        typeof MediaStreamTrack !== 'undefined' &&
        'getSources' in MediaStreamTrack
      ) {
        canEnumerate = true
      } else if (
        navigator.mediaDevices &&
        !!navigator.mediaDevices.enumerateDevices
      ) {
        canEnumerate = true
      }
      var hasMicrophone = false
      var hasSpeakers = false
      var hasWebcam = false

      var isMicrophoneAlreadyCaptured = false
      var isWebcamAlreadyCaptured = false

      // check if device allows capture via the file input field
      var i = document.createElement('input')
      i.setAttribute('capture', true)
      var inputCaptureSupported = !!i['capture']
      checkDeviceSupport(() => {
        this.$store.commit('userauth/updateDevice', {
          hasWebCam: hasWebcam,
          hasMicrophone: hasMicrophone,
          hasSpeakers: hasSpeakers,
          isMicrophoneAlreadyCaptured: isMicrophoneAlreadyCaptured,
          isWebcamAlreadyCaptured: isWebcamAlreadyCaptured,
          inputCaptureSupported: inputCaptureSupported
        })
      })
      if (navigator.mediaDevices) {
        navigator.mediaDevices.ondevicechange = () => {
          checkDeviceSupport(event => {
            this.$store.commit('userauth/updateDevice', {
              hasWebCam: hasWebcam,
              hasMicrophone: hasMicrophone,
              hasSpeakers: hasSpeakers,
              isMicrophoneAlreadyCaptured: isMicrophoneAlreadyCaptured,
              isWebcamAlreadyCaptured: isWebcamAlreadyCaptured
            })
          })
        }
      }
      await import('current-device').then(({ default: device }) => {
        this.$store.commit('userauth/updateDevice', {
          type: device.type,
          os: device.os,
          orientation: device.orientation
        })
        window.onresize = () => {
          this.$store.commit('userauth/updateDevice', {
            orientation:
              window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
          })
        }
      })
    }
  }
}
</script>

<style>
is-optin {
  align-items: flex-start;
  max-width: 960px;
  margin: 2% auto;
  left: 0;
  right: 0;
}
</style>
