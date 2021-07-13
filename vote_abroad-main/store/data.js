import { AsYouType, formatNumber, isValidNumber, getNumberType } from 'libphonenumber-js/custom'
import Mailcheck from 'mailcheck'
import { helpers } from 'vuelidate/lib/validators'
import { commonEmailDomains } from '~/utils/helpers'
const topLevelDomains = ['com', 'net', 'org', 'me', 'de', 'uk', 'ca', 'fr', 'ch', 'edu', 'it', 'no', 'il', 'mx', 'nl', 'au', 'es', 'gr', 'be', 'mil', 'edu', 'ie']

// Mailcheck.defaultDomains.push(commonEmailDomains)
const md = require('~/data/phoneMeta/bareMeta.json')
const sureThing = promise => promise
  .then(result => ({ok: true, result}))
  .catch(error => Promise.resolve({ok: false, error}))

export const state = () => ({
  postal: {},
  stateRules: {},
  elections: [],
  phoneMetadata: md,
  countries: require('~/data/countries/countriesWithPhoneExamples.json'),
  phoneExamples: require('libphonenumber-js/examples.mobile.json'),
  phone: '',
  fax: '',
  email: ''
})

function getLabel (type, countryData) {
  switch (type) {
    case 'A':
      return 'Street Address 1'
    case 'C':
      return countryData.locality_name_type || 'City'
    case 'D':
      return countryData.sublocality_name_type || 'Neighborhood'
    case 'S':
      return countryData.state_name_type || 'Province'
    case 'Z':
      return countryData.zip_name_type || 'Postal Code'
    case 'X':
      return countryData.sortingcode_name_type || 'Sorting Code'
    default:
      return ''
  }
}

export const getters = {
  phoneMetadataHasCountry: (state) => (countryCode) => { return Boolean(countryCode) && Boolean(state.phoneMetadata.countries[countryCode]) },
  postalMetadataHasCountry: (state) => (countryCode) => { return Boolean(countryCode && state.postal[countryCode.toUpperCase()]) },
  postalDataForCountry: (state) => (countryCode) => { return countryCode ? state.postal[countryCode.toUpperCase()] : null },
  votingStates: (state, getters) => {
    let usData = getters.postalMetadataHasCountry('US') ? state.postal.US : null
    // console.log('usData', usData)
    return usData ? usData.sub_names.split('~').map((state, i) => ({name: state, key: usData.sub_keys.split('~')[i]})) : []
  },
  addressPartRequired: (state, getters) => (countryCode, addressPart) => { return getters.postalDataForCountry(countryCode) ? getters.postalDataForCountry(countryCode).require.includes(addressPart) : false },
  validZip: (state, getters) => (value) => {
    if (!value) return true
    // console.log('this', value)
    let countryData = getters.postalMetadataHasCountry(value.countryiso || 'US') ? getters.postalDataForCountry(value.countryiso || 'US') : {}
    let countryZipRegex = value && countryData.zip ? new RegExp(countryData.zip) : null
    let countryZipEx = countryZipRegex && countryData.zipex ? countryData.zipex.split(',').join(' or ') : null
    let stateZipRegex = countryZipRegex &&
      value.S &&
      countryData.sub_zips &&
      countryData.sub_names.split('~').includes(value.S)
      ? new RegExp(countryData.sub_zips.split('~')[countryData.sub_names.split('~').findIndex(x => x.toLowerCase() === value.S.toLowerCase())])
      : null
    let stateZipEx = stateZipRegex && countryData.sub_zipexs && countryData.sub_names.split('~').includes(value.S)
      ? countryData.sub_zipexs.split('~')[countryData.sub_names.split('~').findIndex(x => x.toLowerCase() === value.S.toLowerCase())].split('~').join(' or ')
      : null
    // console.log('countryZipRegex', countryZipRegex, 'stateZipRegex', stateZipRegex, 'countryZipEx', countryZipEx, 'stateZipEx', stateZipEx)
    return value &&
      getters.postalMetadataHasCountry(value.countryiso || 'US') &&
      getters.postalDataForCountry(value.countryiso || 'US').zip
      ? helpers.withParams({type: 'validZip', for: stateZipRegex ? value.S : countryZipRegex ? value.countryiso || 'US' : null, zipex: stateZipEx || countryZipEx}, helpers.regex('validZip', stateZipRegex || countryZipRegex))
      : true
  },
  countriesWithPostalData: (state) => state.countries.filter(country => !!state.postal[country.code]),
  countriesWithPostalData2: (state) => state.countries.filter(country => !!state.postal[country.code]).map(x => state.postal[x.code]).map(countryData => {
    let parsedFormat = (!countryData || (!countryData.lfmt && !countryData.fmt)) ? {} : (countryData.lfmt || countryData.fmt) // use latinized format if available
      .split(/%n/) // split by line
      .map(x => x.replace(/([^%N|%O|%A|%D|%C|%S|%X|%Z])/g, '').split(/\s|%/)
        .filter(t => /^[NOADCSXZ]$/.test(t)) // only deal with address part tokens
        .map(y => {
          let addressPartObject = {
            type: y,
            label: getLabel(y, countryData),
            length: x.replace(/([^%N|%O|%A|%D|%C|%S|%X|%Z]|[\s]|[%])/g, '').length,
            required: false
          }
          if (countryData.require && countryData.require.includes(addressPartObject.type)) {
            addressPartObject.required = true
          }
          if (!countryData.require && /A|C/.test(addressPartObject.type)) addressPartObject.required = true
          if (addressPartObject.type === 'Z') {
            addressPartObject.example = countryData.zipex ? countryData.zipex.split(',')[0] : ''
            addressPartObject.regex = countryData.zip || ''
          }
          if (addressPartObject.type === 'S' && countryData.sub_keys) {
            addressPartObject.options = countryData.sub_keys.split('~').map((key, i) => ({
              key: key,
              iso: countryData.sub_isoids ? countryData.sub_isoids.split('~')[i] : undefined,
              name: countryData.sub_names ? countryData.sub_names.split('~')[i] : undefined,
              zipex: countryData.sub_zipexs ? countryData.sub_zipexs.split('~')[i] : undefined,
              zip: countryData.sub_zips ? countryData.sub_zips.split('~')[i] : undefined
            }))
          }
          return addressPartObject
        })) // convert tokens into object with correct properties
      .reduce((acc, cur) => acc.concat(cur), []) // flatten array
    return {
      format: parsedFormat,
      ...countryData
    }
  }),
  hasValidPhonePrefix: (state, getters) => (number) => {
    if (number && number.length > 1 && number.charAt(0) === '+') {
      let res = false;
      [2, 3, 4].forEach(n => {
        if (state.phoneMetadata.country_calling_codes[number.slice(1, n)]) res = true
      })
      return res
    } else return false
  },
  phoneMetadataHasAllCountriesForPrefix: (state, getters) => (number) => {
    if (number && number.length > 1 && number.charAt(0) === '+') {
      return [2, 3, 4]
        .map(x => x <= number.length ? state.phoneMetadata.country_calling_codes[number.slice(1, x)] : undefined)
        .reduce((acc, val) => val ? acc.concat(val) : acc, [])
        .every(country => getters.phoneMetadataHasCountry(country))
    } else return 'other result'
  },
  formattedNumber: (state) => (number, countryCode) => {
    let formatted = new AsYouType(countryCode, state.phoneMetadata)
    let text = formatted.input(number)
    return {text, formatted}
  },
  getPhoneFormatInfo: (state) => (number, countryCode) => {
    let formatted = new AsYouType(countryCode, state.phoneMetadata)
    formatted.input(number)
    return formatted
  },
  getPhoneIntFormat: (state) => (phone, country) => formatNumber({ country, phone }, 'International', state.phoneMetadata),
  // isValidNumber: (state, getters) => (phone, country) => {
  //   if (phone && phone.length > 2) {
  //     // console.log(getters.phoneMetadataHasCountry(country), getters.phoneMetadataHasAllCountriesForPrefix(phone))
  //   }
  //   if (phone && phone.length > 7 && (getters.phoneMetadataHasCountry(country) || getters.phoneMetadataHasAllCountriesForPrefix(phone))) return country ? isValidNumber(phone, country, state.phoneMetadata) : isValidNumber(phone, state.phoneMetadata)
  //   else if (country === 'UN') {
  //     return false
  //   } else return true
  // },
  isValidNumber: (state, getters) => (phone, country) => {
    if (/^\+84/.test(phone) || /^\+63/.test(phone)) {
      return true
    }
    if (phone && (getters.phoneMetadataHasCountry(country) || getters.phoneMetadataHasAllCountriesForPrefix(phone))) return country ? isValidNumber(phone, country, state.phoneMetadata) : isValidNumber(phone, state.phoneMetadata)
    else return false
  },
  isMobileNumber: (state, getters) => (phone, country) => {
    if (phone && (getters.phoneMetadataHasCountry(country) || getters.phoneMetadataHasAllCountriesForPrefix(phone))) return getNumberType(phone, country, state.phoneMetadata)
    // else return true
  },
  isValidEmail: (state) => (email) => /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(email),
  mailCheck: (state) => (email) => Mailcheck.run({
    domains: commonEmailDomains,
    topLevelDomains: topLevelDomains,
    email: email,
    suggested: function (suggestion) {
      // console.log(suggestion)
      let s = suggestion.full
      s = (s.split('@')[1].split('.').length > 1 && s.split('@')[1].split('.')[s.split('@')[1].split('.').length - 1].length > 1) ? s : ''
      return s
    },
    empty: function () {
      return ''
    }
  }),
  flattenElectionRules: (state) => state.elections.length === 0 ? [] : state.elections.map(x => Object.entries(x.rules).map(([k, v]) => v.map(r => {
    return {
      state: x.state,
      electionDate: x.date,
      electionType: x.electionType,
      ruleType: k,
      ruleDate: r.date,
      rule: typeof r.rule === 'string' && !/received by|no deadline|not required/gi.test(r.rule)
        ? ['postmarked by', 'sent by', 'signed by', 'signed/postmarked by'].filter(x => r.rule.toLowerCase().includes(x)).includes('signed/postmarked by') ? 'signedPostmarked' : ['postmarked', 'received', 'sent', 'signed'].filter(x => r.rule.toLowerCase().includes(x))[0] + 'By'
        : 'receivedBy',
      note: r.note || null,
      // submissionOptions: ['Email', 'Fax', 'Mail'].filter(opt => {
      //   let rule = typeof r.rule === 'string' ? r.rule : ''
      //   let re = new RegExp(opt)
      //   return re.test(rule)
      // }).map(r => r.toLowerCase()),
      submissionOptions: ['Email', 'Fax', 'Mail'].filter(opt => {
        let rule = typeof r.rule === 'string' ? r.rule : ''
        let re = new RegExp(opt)
        return re.test(rule) || !/Mail|Email|Fax/.test(rule)
      }).map(r => r.toLowerCase()),
      voterType: typeof r.voterType === 'string' ? [/uniformed/i.test(r.voterType) ? 'Military' : 'Citizen'] : ['Citizen', 'Military'],
      notes: typeof r.rule === 'string' ? /\*/.test(r.rule) : null
    }
  }))).reduce((acc, cur) => acc.concat(cur), []).reduce((acc, cur) => acc.concat(cur), [])
}

export const mutations = {
  addCountryPhoneMetadata (state, payload) {
    this._vm.$set(state.phoneMetadata.countries, payload.country, payload.data)
  },
  addCountryPostalMetadata (state, payload) {
    state.postal = {...state.postal, ...payload}
  },
  updateElections (state, elections) {
    state.elections = elections
  }
}

export const actions = {
  async updateCountryData ({ state, commit, getters }, country) {
    country = country ? country.toUpperCase() : null
    if (country && (!getters.postalMetadataHasCountry(country) || !getters.phoneMetadataHasCountry(country)) && process.browser) {
      let thisPostalData = await import(`~/localization/${country ? country.toUpperCase() : 'US'}.json`)
      commit('addCountryPostalMetadata', {[country]: thisPostalData})
      if (Object.values(state.phoneMetadata.country_calling_codes).reduce((acc, cur) => acc.concat(cur), []).includes(country)) {
        let thisPhoneData = await import(`~/data/phoneMeta/${country}.json`)
        commit('addCountryPhoneMetadata', {country: country, data: thisPhoneData})
      }
      return getters.postalDataForCountry(country)
    } else {
      return getters.postalDataForCountry(country)
    }
    // if (country && !getters.phoneMetadataHasCountry(country) && process.browser) {
    //   let thisPhoneData = await import(`~/data/phoneMeta/${country}.json`)
    //   commit('addCountryPhoneMetadata', {country: country, data: thisPhoneData})
    // }
  },
  async getCountryIsoFromPhonePrefix ({state, dispatch}, number) {
    if (number && number.length > 1 && number.charAt(0) === '+') {
      let callingCodes = state.phoneMetadata.country_calling_codes
      for (let i = 1; i < number.length && i < 5; i++) {
        let thisCode = number.slice(1, i)
        if (callingCodes[thisCode]) {
          return Promise.all(callingCodes[thisCode].map(code => sureThing(dispatch('updateCountryData', code))))
        }
      }
    } else return ({ok: true, result: 'no country codes found'})
  },
  async getElections ({commit}) {
    let elections = await this.app.$content('/elections').get('elections')
    commit('updateElections', elections.body)
  }
}

// Old Data.js
// import { AsYouType } from 'libphonenumber-js/custom'
// const md = require('~/data/phoneMeta/bareMeta.json')

// export const state = () => ({
//   postal: {},
//   stateRules: {},
//   elections: [],
//   phoneMetadata: md,
//   countries: require('~/data/countries/countriesWithPhoneExamples.json'),
//   phoneExamples: require('libphonenumber-js/examples.mobile.json'),
//   phone: '',
//   fax: '',
//   email: ''
// })

// export const getters = {
//   phoneMetadataHasCountry: (state) => (countryCode) => { return Boolean(state.phoneMetadata.countries[countryCode]) },
//   postalMetadataHasCountry: (state) => (countryCode) => { return Boolean(state.postal[countryCode]) },
//   phoneMetadataHasAllCountriesForPrefix: (state, getters) => (number) => {
//     if (number && number.length > 1 && number.charAt(0) === '+') {
//       return [2, 3, 4]
//         .map(x => state.phoneMetadata.country_calling_codes[number.slice(1, x)])
//         .reduce((acc, val) => acc.concat(val), [])
//         .filter((v, i, a) => a.indexOf(v) === i)
//         .every(country => getters.phoneMetadataHasCountry(country))
//     } else return true
//   },
//   formattedNumber: (state) => (number, countryCode) => {
//     let formatted = new AsYouType(countryCode, state.phoneMetadata)
//     let text = formatted.input(number)
//     console.log('formatted', formatted)
//     return {text, formatted}
//   },
//   getPhoneFormatInfo: (state) => (number, countryCode) => {
//     let formatted = new AsYouType(countryCode, state.phoneMetadata)
//     formatted.input(number)
//     return formatted
//   }
// }

// export const mutations = {
//   addCountryPhoneMetadata (state, payload) {
//     this._vm.$set(state.phoneMetadata.countries, payload.country, payload.data)
//   },
//   addCountryPostalMetadata (state, payload) {
//     state.postal = {...state.postal, ...payload}
//   },
//   updatePhone (state, number) {
//     state.phone = number
//   }
// }

// export const actions = {
//   async updateCountryData ({ commit, getters }, country) {
//     country = country ? country.toUpperCase() : null
//     if (country && !getters.phoneMetadataHasCountry(country)) {
//       let thisPhoneData = await import(`~/data/phoneMeta/${country}.json`)
//       commit('addCountryPhoneMetadata', {country: country, data: thisPhoneData})
//     }
//     if (country && !getters.postalMetadataHasCountry(country)) {
//       let thisPostalData = await import(`~/data/postal/${country.toLowerCase()}.json`)
//       commit('addCountryPostalMetadata', thisPostalData)
//     }
//   },
//   getCountryIsoFromPhonePrefix ({state, dispatch}, number) {
//     if (number && number.length > 1 && number.charAt(0) === '+') {
//       let callingCodes = state.phoneMetadata.country_calling_codes
//       for (let i = 1; i < number.length && i < 5; i++) {
//         let thisCode = number.slice(1, i)
//         if (callingCodes[thisCode]) {
//           callingCodes[thisCode].forEach(code => dispatch('updateCountryData', code))
//           break
//         }
//       }
//     }
//   },
//   updatePhone ({commit, dispatch, getters}, {val, countryIso}) {
//     dispatch('getCountryIsoFromPhonePrefix', val)
//     commit('updatePhone', getters.formattedNumber(val, countryIso))
//   }
// }
