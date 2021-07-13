// eslint-disable-next-line no-unused-vars
const { API_ROOT, I18N } = require('./config')
// eslint-disable-next-line no-unused-vars
const axios = require('axios')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vote from Abroad',
    // script: [
    //   {src: 'http://10.0.1.12:8098'}
    // ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Absentee ballots for US Citizens abroad' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://cognito-identity.us-east-1.amazonaws.com' },
      { rel: 'preload', as: 'image', href: 'https://res.cloudinary.com/democratsabroad/image/upload/f_auto,q_auto/v1521002249/votefromabroad-bg.jpg' }
    ]
  },
  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        if (type === 'script') {
          if (/leodata.*/.test(file)) {
            return false
          }
        }
        return true
      }
    }
  },
  env: {
    baseUrl: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
    url: process.env.URL || 'http://localhost:3000',
    autocompleteUrl: process.env.AUTOCOMPLETE_URL || 'http://localhost:3010',
    placeDetailsUrl: process.env.PLACE_DETAILS_URL || 'http://localhost:3010/details',
    placesUrl: process.env.PLACES_URL || '/',
    autocompleteEndpoint: process.env.AUTOCOMPLETE_ENDPOINT || 'api/place/autocomplete/json',
    detailsEndpoint: process.env.PLACES_ENDPOINT || 'api/place/details/json',
    placesKey: process.env.PLACES_KEY || 'AIzaSyCxxXbBB2CBbyNDaZQe9zRFhkD7LafmsGs',
    auth0clientID: process.env.DEVSTAGE === 'prod' ? 'Kwfswc0R3zV4Zw6hPOR1hibG4IKxztjU' : '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
    commitRef: process.env.COMMIT_REF || '',
    offline: process.env.OFFLINE || false,
    // stage: process.env.DEVSTAGE || 'dev',
    stage: ['vfa-sandbox', 'vfa-beta'].indexOf(process.env.SITE_NAME) === -1 ? 'prod' : 'dev',
    isStudentSite: process.env.IS_STUDENT_SITE || false,
    isVrSite: process.env.IS_VR_SITE || false,
    isDemsSite: process.env.IS_DEMS_SITE || false,
    branch: process.env.BRANCH || 'dev',
    siteName: process.env.SITE_NAME || 'unknownBuild'
  },
  modules: [
    // '@nuxtjs/sentry',
    // '@nuxtjs/localtunnel',
    '@nuxtjs/google-analytics',
    ['nuxt-facebook-pixel-module', {
      /* module options */
      track: 'PageView',
      pixelId: '744840838985070',
      disabled: false
    }],
    '@nuxtjs/pwa',
    'nuxtent',
    ['nuxt-i18n', I18N],
    '@nuxtjs/proxy'
  ],
  'google-analytics': {
    id: 'UA-126220374-1',
    linkers: ['beta.votefromabroad.org', 'students.votefromabroad.org', 'es.votefromabroad.org', 'vr.votefromabroad.org', 'votefromabroad.org'],
    set: [
      { field: 'dimension1', value: process.env.BRANCH || 'dev' }
    ],
    debug: {
      sendHitTask: process.env.DEVSTAGE !== 'dev',
      enabled: process.env.DEVSTAGE === 'dev'
    },
    commands: {
      trackFormAction: function trackFormAction (fieldName = 'unknown') { this.$ga.event('formAction', 'focus/select', 'field', fieldName) }
    }
  },
  proxy: {
    '/api/mailer/dev': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/mailer',
      pathRewrite: {
        '^/api/mailer/dev': '/'
      }
    },
    '/api/fpca/dev': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/pdf',
      pathRewrite: {
        '^/api/fpca/dev': '/'
      }
    },
    '/api/mailer': {
      target: 'https://37aze90rvd.execute-api.us-east-1.amazonaws.com/prod/mailer',
      // target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/mailer',
      pathRewrite: {
        '^/api/mailer': '/'
      }
    },
    '/api/fpca': {
      target: 'https://37aze90rvd.execute-api.us-east-1.amazonaws.com/prod/pdf',
      pathRewrite: {
        '^/api/fpca': '/'
      }
    },
    '/api/fpcaByEmail': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/fpcaByEmail',
      pathRewrite: {
        '^/api/fpcaByEmail': '/'
      }
    },
    '/api/place/**': {
      target: 'https://maps.googleapis.com/maps/api/place',
      pathRewrite: {
        '^/api/place/': '/'
      }
    }
  },
  sentry: {
    dsn: 'https://7a6424adb4fd425d871eaf79e2a0afce@sentry.io/1223778',
    config: {
      release: process.env.COMMIT_REF || '',
      environment: process.env.CONTEXT || 'development'
    }
  },
  manifest: {
    name: 'Vote From Abroad',
    short_name: 'Vote Abroad',
    lang: 'en',
    theme_color: '#172559',
    background_color: '#172559',
    ogHost: process.env.URL
  },
  css: [
    {
      src: '@/assets/css/style.scss',
      lang: 'sass'
    }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#e94e3c', height: '3px' },
  generate: {
    minify: {
      collapseWhitespace: false
    },
    routes: ['request/your-information', 'request/canvas', 'request/voting-information', 'request/id-and-contact-information', 'privacy', 'terms-of-use', '/es/states/AL/', '/elections/AL/', '/es/elections/AL/', '/es/states/AK/', '/elections/AK/', '/es/elections/AK/', '/es/states/AS/', '/elections/AS/', '/es/elections/AS/', '/es/states/AZ/', '/elections/AZ/', '/es/elections/AZ/', '/es/states/AR/', '/elections/AR/', '/es/elections/AR/', '/es/states/CA/', '/elections/CA/', '/es/elections/CA/', '/es/states/CO/', '/elections/CO/', '/es/elections/CO/', '/es/states/CT/', '/elections/CT/', '/es/elections/CT/', '/es/states/DE/', '/elections/DE/', '/es/elections/DE/', '/es/states/DC/', '/elections/DC/', '/es/elections/DC/', '/es/states/FL/', '/elections/FL/', '/es/elections/FL/', '/es/states/GA/', '/elections/GA/', '/es/elections/GA/', '/es/states/GU/', '/elections/GU/', '/es/elections/GU/', '/es/states/HI/', '/elections/HI/', '/es/elections/HI/', '/es/states/ID/', '/elections/ID/', '/es/elections/ID/', '/es/states/IL/', '/elections/IL/', '/es/elections/IL/', '/es/states/IN/', '/elections/IN/', '/es/elections/IN/', '/es/states/IA/', '/elections/IA/', '/es/elections/IA/', '/es/states/KS/', '/elections/KS/', '/es/elections/KS/', '/es/states/KY/', '/elections/KY/', '/es/elections/KY/', '/es/states/LA/', '/elections/LA/', '/es/elections/LA/', '/es/states/ME/', '/elections/ME/', '/es/elections/ME/', '/es/states/MD/', '/elections/MD/', '/es/elections/MD/', '/es/states/MA/', '/elections/MA/', '/es/elections/MA/', '/es/states/MI/', '/elections/MI/', '/es/elections/MI/', '/es/states/MN/', '/elections/MN/', '/es/elections/MN/', '/es/states/MS/', '/elections/MS/', '/es/elections/MS/', '/es/states/MO/', '/elections/MO/', '/es/elections/MO/', '/es/states/MT/', '/elections/MT/', '/es/elections/MT/', '/es/states/NE/', '/elections/NE/', '/es/elections/NE/', '/es/states/NV/', '/elections/NV/', '/es/elections/NV/', '/es/states/NH/', '/elections/NH/', '/es/elections/NH/', '/es/states/NJ/', '/elections/NJ/', '/es/elections/NJ/', '/es/states/NM/', '/elections/NM/', '/es/elections/NM/', '/es/states/NY/', '/elections/NY/', '/es/elections/NY/', '/es/states/NC/', '/elections/NC/', '/es/elections/NC/', '/es/states/ND/', '/elections/ND/', '/es/elections/ND/', '/es/states/OH/', '/elections/OH/', '/es/elections/OH/', '/es/states/OK/', '/elections/OK/', '/es/elections/OK/', '/es/states/OR/', '/elections/OR/', '/es/elections/OR/', '/es/states/PA/', '/elections/PA/', '/es/elections/PA/', '/es/states/PR/', '/elections/PR/', '/es/elections/PR/', '/es/states/RI/', '/elections/RI/', '/es/elections/RI/', '/es/states/SC/', '/elections/SC/', '/es/elections/SC/', '/es/states/SD/', '/elections/SD/', '/es/elections/SD/', '/es/states/TN/', '/elections/TN/', '/es/elections/TN/', '/es/states/TX/', '/elections/TX/', '/es/elections/TX/', '/es/states/UT/', '/elections/UT/', '/es/elections/UT/', '/es/states/VT/', '/elections/VT/', '/es/elections/VT/', '/es/states/VI/', '/elections/VI/', '/es/elections/VI/', '/es/states/VA/', '/elections/VA/', '/es/elections/VA/', '/es/states/WA/', '/elections/WA/', '/es/elections/WA/', '/es/states/WV/', '/elections/WV/', '/es/elections/WV/', '/es/states/WI/', '/elections/WI/', '/es/elections/WI/', '/es/states/WY/', '/es/elections/WY/'],
    interval: 50
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active',
    middleware: 'menu-helper'
  },
  plugins: [
    { src: '~/plugins/plugged', ssr: false },
    { src: '~/plugins/buefy' },
    { src: '~/plugins/vuelidate' },
    { src: '~/plugins/croppa' },
    { src: '~/plugins/intercom' },
    { src: '~/plugins/i18n.js' },
    // { src: '~/plugins/devtools', ssr: false },
    { src: '~plugins/vue-cookie', ssr: false, injectAs: 'cookie' }
  ],
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    /*
    ** Run ESLint on save
    */
    vendor: [
      'babel-polyfill',
      'mailcheck',
      'auth0-js',
      'libphonenumber-js/custom',
      'snarkdown'
    ],
    babel: {
      presets: [
        ['vue-app', {
          useBuiltIns: true,
          targets: {
            ie: 11, uglify: true
          }
        }]
      ]
    },
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    watch: [
      './lang/',
      '~/config/index.js'
    ]
  }
}
