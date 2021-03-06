import axios from 'axios'
import debounce from 'lodash/debounce'

const placesAutocomplete = debounce(function (val, country, addressType, searchType) {
  this.data = []
  this.isFetching = true
  let options = `&types=${searchType === 'city' ? '(cities)' : 'geocode'}&language=en${addressType === 'votAdr' ? '&components=country:us|country:pr|country:vi|country:gu|country:mp' : country ? '&components=country:' + country : ''}`
  try {
    axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${val}${options}&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
      .then(({ data }) => {
        data.predictions.forEach((item) => {
          // console.log(item)
          item.structured_formatting.main_text = latinize(item.structured_formatting.main_text)
          item.description = latinize(item.description)
          this.data.push(item)
        })
        this.isFetching = false
        return data.predictions
      }, response => {
        this.isFetching = false
      })
  } catch (e) {
    this.isFetching = false
    console.error('placesAutocompleteError', e)
    return []
  }
}, 500)

const placeDetails = function fillData (option) {
  let input = {}
  // console.log('option', option)
  if (option && option.place_id) {
    axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
      .then(({ data }) => {
        this.sessionToken = uuidv4()
        if (data.status && data.status === 'NOT_FOUND') {
          this.$toast.open({
            message: this.$t('request.abrAdr.noAutocomplete'),
            duration: 3500,
            type: 'is-warning'
          })
        } else {
          let result = data.result
          let ctry = result.address_components && result.address_components.filter(({ types }) => types.includes('country')).length > 0 ? result.address_components.filter(({ types }) => types.includes('country'))[0].short_name : null
          let region = result.address_components && result.address_components.filter(({ types }) => types.includes('administrative_area_level_1')).length > 0 ? result.address_components.filter(({ types }) => types.includes('administrative_area_level_1'))[0].short_name : null
          // console.log('placeid data', result.address_components.filter(({types}) => types.includes('country')))
          // input.A = result.adr_address && result.adr_address.includes('street-address') ? this.latinize(result.adr_address.match('<span class="street-address">(.*?)</span>')[1]) : null
          if (this.fieldName !== 'votAdr') input.A = this.adr.A || this.tempA
          if (ctry.toLowerCase() === 'jp') {
            input.A = result.formatted_address.split(', ')[0]
            input.B = this.adr.B || result.formatted_address.split(', ')[1]
          } else if (this.fieldName === 'votAdr') {
            // console.log('votadr', JSON.stringify(result, null, 2))
            input.A = result.adr_address && result.adr_address.includes('street-address') ? result.adr_address.match('<span class="street-address">(.*?)</span>')[1] : this.adr.A || null
            input.B = this.adr.B || (result.adr_address && result.adr_address.includes('extended-address') ? result.adr_address.match('<span class="extended-address">(.*?)</span>')[1] : null)
          } else {
            input.B = this.adr.B || (result.adr_address && result.adr_address.includes('extended-address') ? result.adr_address.match('<span class="extended-address">(.*?)</span>')[1] : null)
            input.D = result.address_components && result.address_components.filter(({ types }) => types.includes('sublocality')).length > 0 ? result.address_components.filter(({ types }) => types.includes('sublocality'))[0].long_name : null
          }
          input.C = result.adr_address && result.adr_address.includes('locality') ? result.adr_address.match('<span class="locality">(.*?)</span>')[1] : null
          if (this.fieldName === 'votAdr' && /PR|VI|AS|GU/.test(ctry)) {
            input.S = ctry
          } else {
            input.S = result.adr_address && result.adr_address.includes('region') ? result.adr_address.match('<span class="region">(.*?)</span>')[1] : region
          }
          input.Z = result.adr_address && result.adr_address.includes('postal-code') ? result.adr_address.match('<span class="postal-code">(.*?)</span>')[1] : null
          // console.log(this.fieldName, data.result.address_components.filter(y => y.types.includes('administrative_area_level_2')).length)
          if (this.fieldName === 'votAdr' && data.result.address_components.filter(y => y.types.includes('administrative_area_level_2')).length) {
            input.Y = data.result.address_components.filter(y => y.types.includes('administrative_area_level_2'))[0].long_name.replace(/county/gi, '').trim()
          }
          // input.country = this.getCountryName(ctry)
          input.countryiso = this.fieldName === 'votAdr' ? 'US' : ctry
          Object.keys(input)
            .forEach(x => {
              input[x] = typeof input[x] === 'string' ? decodeHtmlEntity(latinize(input[x])) : input[x]
            })
          // console.log('input', input)
          this.update({ [this.fieldName]: Object.assign({}, this.adr, input) })
        }
      })
    this.sessionToken = uuidv4()
  }
}

const cleanString = function (str) {
  return typeof str === 'string' ? decodeHtmlEntity(latinize(str)) : str
}

const returnArrayOfReasonableBirthDates = function (dateString) {
  // console.log('dateString', dateString)
  let currentYear = new Date().getFullYear()
  let dateArr = []
  let dateRegexPatterns = {
    YMD: /^(\d?\d?\d\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d)$/g,
    MDY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g,
    DMY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g
  }

  if (/^\d+(?:\/|-|\.)\d+(?:\/|-|\.)\d+$/.test(dateString)) {
    Object.entries(dateRegexPatterns).forEach(([regexName, dateRegex]) => {
      let matchArr
      let yPos = regexName.indexOf('Y') + 1
      let mPos = regexName.indexOf('M') + 1
      let dPos = regexName.indexOf('D') + 1
      while ((matchArr = dateRegex.exec(dateString)) !== null) {
        let validDate = formatDate(matchArr[yPos], matchArr[mPos], matchArr[dPos])
        if (validDate) dateArr.push(validDate)
        // console.log(validDate)
      }
    })
  } else {
    // dateArr.push(new Date(Date.parse(dateString)))
    dateArr.push(new Date(Date.parse(dateString)))
    // - (new Date().getTimezoneOffset() * 60000)
  }
  // console.log(new Date(Date.parse('june 1 82') + new Date().getTimezoneOffset() * 60000))
  // console.log(new Date(Date.parse('june 1 82') - (new Date().getTimezoneOffset() * 60000)))
  return dateArr
    .map(function (date) { return date.getTime() })
    .filter(function (date, i, array) {
      // remove entries that are duplicates or before today
      return array.indexOf(date) === i && date < new Date()
    })
    .map(function (time) { return new Date(time) })

  function formatDate (y, m, d) {
    let year = y.length === 4 ? y : parseInt(y) < currentYear - 2010 ? '20' + y : '19' + y
    year = year < 1890 || year > currentYear ? null : year
    let month = parseInt(m) - 1
    let day = parseInt(d)
    let parsedDate = new Date(year, month, day)
    if (!year || parsedDate.getMonth() !== month) {
    } else return parsedDate
  }
}

// const placesDetails = async function (option) {
//   if (!option || !option.place_id) {
//     return
//   }
//   try {
//     let {data} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
//     if (data.status && data.status === 'NOT_FOUND') {
//       this.$toast.open({
//         message: this.$t('request.abrAdr.noAutocomplete'),
//         duration: 3500,
//         type: 'is-warning'
//       })
//       throw new Error(`no place details found for: ${JSON.stringify(option, null, 2)}`)
//     }
//     let input = {}
//     let {result: {address_components: components = [], formatted_address: formatted = '', adr_address: adrFormat = ''}} = data
//     let {short_name: ctry = null} = (components.find(({types}) => types.includes('country')))
//     let {short_name: region = null} = (components.find(({types}) => types.includes('administrative_area_level_1')))
//     let B = adrFormat.includes('extended-address') ? adrFormat.match('<span class="extended-address">(.*?)</span>')[1] : null
//     let {long_name: D = null} = (components.find(({types}) => types.includes('country')))
//     let C = adrFormat.includes('locality') ? adrFormat.match('<span class="locality">(.*?)</span>')[1] : null
//     let S = adrFormat.includes('region') ? adrFormat.match('<span class="region">(.*?)</span>')[1] : region
//     let Z = adrFormat.includes('postal-code') ? adrFormat.match('<span class="postal-code">(.*?)</span>')[1] : null
//     let {long_name: Y = null} = (components.find(({types}) => types.includes('administrative_area_level_2')))
//     if (this.countryiso !== undefined) input.country = this.getCountryName(ctry)
//     if (this.countryiso !== undefined) input.countryiso = ctry
//     let A
//     if (ctry.toLowerCase() === 'jp') {
//       A = formatted.split(', ')[0]
//       B = formatted.split(', ')[1]
//     }
//     this.update(input)
//     console.log(A, B, C, D, S, Z, Y)
//   } catch (error) {
//     console.error(error)
//   }
// }

function decodeHtmlEntity (str) {
  return typeof str === 'string'
    ? str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec)
    })
    : str
}

function latinize (str) {
  if (typeof str === 'string') {
    return str.replace(/[^A-Za-z0-9]/g, function (x) {
      return latinizeCharacters[x] || x
    })
  } else {
    return str
  }
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const latinizeCharacters = { '??': 'A', '??': 'A', '???': 'A', '???': 'A', '???': 'A', '???': 'A', '???': 'A', '??': 'A', '??': 'A', '???': 'A', '???': 'A', '???': 'A', '???': 'A', '???': 'A', '??': 'A', '??': 'A', '??': 'A', '??': 'A', '???': 'A', '??': 'A', '??': 'A', '???': 'A', '??': 'A', '??': 'A', '??': 'A', '??': 'A', '??': 'A', '???': 'A', '??': 'A', '??': 'A', '???': 'AA', '??': 'AE', '??': 'AE', '??': 'AE', '???': 'AO', '???': 'AU', '???': 'AV', '???': 'AV', '???': 'AY', '???': 'B', '???': 'B', '??': 'B', '???': 'B', '??': 'B', '??': 'B', '??': 'C', '??': 'C', '??': 'C', '???': 'C', '??': 'C', '??': 'C', '??': 'C', '??': 'C', '??': 'D', '???': 'D', '???': 'D', '???': 'D', '???': 'D', '??': 'D', '???': 'D', '??': 'D', '??': 'D', '??': 'D', '??': 'D', '??': 'DZ', '??': 'DZ', '??': 'E', '??': 'E', '??': 'E', '??': 'E', '???': 'E', '??': 'E', '???': 'E', '???': 'E', '???': 'E', '???': 'E', '???': 'E', '???': 'E', '??': 'E', '??': 'E', '???': 'E', '??': 'E', '??': 'E', '???': 'E', '??': 'E', '??': 'E', '???': 'E', '???': 'E', '??': 'E', '??': 'E', '???': 'E', '???': 'E', '???': 'ET', '???': 'F', '??': 'F', '??': 'G', '??': 'G', '??': 'G', '??': 'G', '??': 'G', '??': 'G', '??': 'G', '???': 'G', '??': 'G', '???': 'H', '??': 'H', '???': 'H', '??': 'H', '???': 'H', '???': 'H', '???': 'H', '???': 'H', '??': 'H', '??': 'I', '??': 'I', '??': 'I', '??': 'I', '??': 'I', '???': 'I', '??': 'I', '???': 'I', '??': 'I', '??': 'I', '???': 'I', '??': 'I', '??': 'I', '??': 'I', '??': 'I', '??': 'I', '???': 'I', '???': 'D', '???': 'F', '???': 'G', '???': 'R', '???': 'S', '???': 'T', '???': 'IS', '??': 'J', '??': 'J', '???': 'K', '??': 'K', '??': 'K', '???': 'K', '???': 'K', '???': 'K', '??': 'K', '???': 'K', '???': 'K', '???': 'K', '??': 'L', '??': 'L', '??': 'L', '??': 'L', '???': 'L', '???': 'L', '???': 'L', '???': 'L', '???': 'L', '???': 'L', '??': 'L', '???': 'L', '??': 'L', '??': 'L', '??': 'LJ', '???': 'M', '???': 'M', '???': 'M', '???': 'M', '??': 'N', '??': 'N', '??': 'N', '???': 'N', '???': 'N', '???': 'N', '??': 'N', '??': 'N', '???': 'N', '??': 'N', '??': 'N', '??': 'N', '??': 'NJ', '??': 'O', '??': 'O', '??': 'O', '??': 'O', '???': 'O', '???': 'O', '???': 'O', '???': 'O', '???': 'O', '??': 'O', '??': 'O', '??': 'O', '??': 'O', '???': 'O', '??': 'O', '??': 'O', '??': 'O', '???': 'O', '??': 'O', '???': 'O', '???': 'O', '???': 'O', '???': 'O', '???': 'O', '??': 'O', '???': 'O', '???': 'O', '??': 'O', '???': 'O', '???': 'O', '??': 'O', '??': 'O', '??': 'O', '??': 'O', '??': 'O', '??': 'O', '???': 'O', '???': 'O', '??': 'O', '??': 'OI', '???': 'OO', '??': 'E', '??': 'O', '??': 'OU', '???': 'P', '???': 'P', '???': 'P', '??': 'P', '???': 'P', '???': 'P', '???': 'P', '???': 'Q', '???': 'Q', '??': 'R', '??': 'R', '??': 'R', '???': 'R', '???': 'R', '???': 'R', '??': 'R', '??': 'R', '???': 'R', '??': 'R', '???': 'R', '???': 'C', '??': 'E', '??': 'S', '???': 'S', '??': 'S', '???': 'S', '??': 'S', '??': 'S', '??': 'S', '???': 'S', '???': 'S', '???': 'S', '??': 'ss', '??': 'T', '??': 'T', '???': 'T', '??': 'T', '??': 'T', '???': 'T', '???': 'T', '??': 'T', '???': 'T', '??': 'T', '??': 'T', '???': 'A', '???': 'L', '??': 'M', '??': 'V', '???': 'TZ', '??': 'U', '??': 'U', '??': 'U', '??': 'U', '???': 'U', '??': 'U', '??': 'U', '??': 'U', '??': 'U', '??': 'U', '???': 'U', '???': 'U', '??': 'U', '??': 'U', '??': 'U', '???': 'U', '??': 'U', '???': 'U', '???': 'U', '???': 'U', '???': 'U', '???': 'U', '??': 'U', '??': 'U', '???': 'U', '??': 'U', '??': 'U', '??': 'U', '???': 'U', '???': 'U', '???': 'V', '???': 'V', '??': 'V', '???': 'V', '???': 'VY', '???': 'W', '??': 'W', '???': 'W', '???': 'W', '???': 'W', '???': 'W', '???': 'W', '???': 'X', '???': 'X', '??': 'Y', '??': 'Y', '??': 'Y', '???': 'Y', '???': 'Y', '???': 'Y', '??': 'Y', '???': 'Y', '???': 'Y', '??': 'Y', '??': 'Y', '???': 'Y', '??': 'Z', '??': 'Z', '???': 'Z', '???': 'Z', '??': 'Z', '???': 'Z', '??': 'Z', '???': 'Z', '??': 'Z', '??': 'IJ', '??': 'OE', '???': 'A', '???': 'AE', '??': 'B', '???': 'B', '???': 'C', '???': 'D', '???': 'E', '???': 'F', '??': 'G', '??': 'G', '??': 'H', '??': 'I', '??': 'R', '???': 'J', '???': 'K', '??': 'L', '???': 'L', '???': 'M', '??': 'N', '???': 'O', '??': 'OE', '???': 'O', '???': 'OU', '???': 'P', '??': 'R', '???': 'N', '???': 'R', '???': 'S', '???': 'T', '???': 'E', '???': 'R', '???': 'U', '???': 'V', '???': 'W', '??': 'Y', '???': 'Z', '??': 'a', '??': 'a', '???': 'a', '???': 'a', '???': 'a', '???': 'a', '???': 'a', '??': 'a', '??': 'a', '???': 'a', '???': 'a', '???': 'a', '???': 'a', '???': 'a', '??': 'a', '??': 'a', '??': 'a', '??': 'a', '???': 'a', '??': 'a', '??': 'a', '???': 'a', '??': 'a', '??': 'a', '??': 'a', '???': 'a', '???': 'a', '??': 'a', '??': 'a', '???': 'a', '???': 'a', '??': 'a', '???': 'aa', '??': 'ae', '??': 'ae', '??': 'ae', '???': 'ao', '???': 'au', '???': 'av', '???': 'av', '???': 'ay', '???': 'b', '???': 'b', '??': 'b', '???': 'b', '???': 'b', '???': 'b', '??': 'b', '??': 'b', '??': 'o', '??': 'c', '??': 'c', '??': 'c', '???': 'c', '??': 'c', '??': 'c', '??': 'c', '??': 'c', '??': 'c', '??': 'd', '???': 'd', '???': 'd', '??': 'd', '???': 'd', '???': 'd', '??': 'd', '???': 'd', '???': 'd', '???': 'd', '???': 'd', '??': 'd', '??': 'd', '??': 'd', '??': 'i', '??': 'j', '??': 'j', '??': 'j', '??': 'dz', '??': 'dz', '??': 'e', '??': 'e', '??': 'e', '??': 'e', '???': 'e', '??': 'e', '???': 'e', '???': 'e', '???': 'e', '???': 'e', '???': 'e', '???': 'e', '??': 'e', '??': 'e', '???': 'e', '??': 'e', '??': 'e', '???': 'e', '??': 'e', '??': 'e', '???': 'e', '???': 'e', '???': 'e', '??': 'e', '???': 'e', '??': 'e', '???': 'e', '???': 'e', '???': 'et', '???': 'f', '??': 'f', '???': 'f', '???': 'f', '??': 'g', '??': 'g', '??': 'g', '??': 'g', '??': 'g', '??': 'g', '??': 'g', '???': 'g', '???': 'g', '??': 'g', '???': 'h', '??': 'h', '???': 'h', '??': 'h', '???': 'h', '???': 'h', '???': 'h', '???': 'h', '??': 'h', '???': 'h', '??': 'h', '??': 'hv', '??': 'i', '??': 'i', '??': 'i', '??': 'i', '??': 'i', '???': 'i', '???': 'i', '??': 'i', '??': 'i', '???': 'i', '??': 'i', '??': 'i', '??': 'i', '???': 'i', '??': 'i', '??': 'i', '???': 'i', '???': 'd', '???': 'f', '???': 'g', '???': 'r', '???': 's', '???': 't', '???': 'is', '??': 'j', '??': 'j', '??': 'j', '??': 'j', '???': 'k', '??': 'k', '??': 'k', '???': 'k', '???': 'k', '???': 'k', '??': 'k', '???': 'k', '???': 'k', '???': 'k', '???': 'k', '??': 'l', '??': 'l', '??': 'l', '??': 'l', '??': 'l', '???': 'l', '??': 'l', '???': 'l', '???': 'l', '???': 'l', '???': 'l', '???': 'l', '??': 'l', '??': 'l', '???': 'l', '??': 'l', '??': 'l', '??': 'lj', '??': 's', '???': 's', '???': 's', '???': 's', '???': 'm', '???': 'm', '???': 'm', '??': 'm', '???': 'm', '???': 'm', '??': 'n', '??': 'n', '??': 'n', '???': 'n', '??': 'n', '???': 'n', '???': 'n', '??': 'n', '??': 'n', '???': 'n', '??': 'n', '???': 'n', '???': 'n', '??': 'n', '??': 'n', '??': 'nj', '??': 'o', '??': 'o', '??': 'o', '??': 'o', '???': 'o', '???': 'o', '???': 'o', '???': 'o', '???': 'o', '??': 'o', '??': 'o', '??': 'o', '??': 'o', '???': 'o', '??': 'o', '??': 'o', '??': 'o', '???': 'o', '??': 'o', '???': 'o', '???': 'o', '???': 'o', '???': 'o', '???': 'o', '??': 'o', '???': 'o', '???': 'o', '???': 'o', '??': 'o', '???': 'o', '???': 'o', '??': 'o', '??': 'o', '??': 'o', '??': 'o', '??': 'o', '???': 'o', '???': 'o', '??': 'o', '??': 'oi', '???': 'oo', '??': 'e', '???': 'e', '??': 'o', '???': 'o', '??': 'ou', '???': 'p', '???': 'p', '???': 'p', '??': 'p', '???': 'p', '???': 'p', '???': 'p', '???': 'p', '???': 'p', '???': 'q', '??': 'q', '??': 'q', '???': 'q', '??': 'r', '??': 'r', '??': 'r', '???': 'r', '???': 'r', '???': 'r', '??': 'r', '??': 'r', '???': 'r', '??': 'r', '???': 'r', '??': 'r', '???': 'r', '???': 'r', '??': 'r', '??': 'r', '???': 'c', '???': 'c', '??': 'e', '??': 'r', '??': 's', '???': 's', '??': 's', '???': 's', '??': 's', '??': 's', '??': 's', '???': 's', '???': 's', '???': 's', '??': 's', '???': 's', '???': 's', '??': 's', '??': 'g', '???': 'o', '???': 'o', '???': 'u', '??': 't', '??': 't', '???': 't', '??': 't', '??': 't', '???': 't', '???': 't', '???': 't', '???': 't', '??': 't', '???': 't', '???': 't', '??': 't', '??': 't', '??': 't', '???': 'th', '??': 'a', '???': 'ae', '??': 'e', '???': 'g', '??': 'h', '??': 'h', '??': 'h', '???': 'i', '??': 'k', '???': 'l', '??': 'm', '??': 'm', '???': 'oe', '??': 'r', '??': 'r', '??': 'r', '???': 'r', '??': 't', '??': 'v', '??': 'w', '??': 'y', '???': 'tz', '??': 'u', '??': 'u', '??': 'u', '??': 'u', '???': 'u', '??': 'u', '??': 'u', '??': 'u', '??': 'u', '??': 'u', '???': 'u', '???': 'u', '??': 'u', '??': 'u', '??': 'u', '???': 'u', '??': 'u', '???': 'u', '???': 'u', '???': 'u', '???': 'u', '???': 'u', '??': 'u', '??': 'u', '???': 'u', '??': 'u', '???': 'u', '??': 'u', '??': 'u', '???': 'u', '???': 'u', '???': 'ue', '???': 'um', '???': 'v', '???': 'v', '???': 'v', '??': 'v', '???': 'v', '???': 'v', '???': 'v', '???': 'vy', '???': 'w', '??': 'w', '???': 'w', '???': 'w', '???': 'w', '???': 'w', '???': 'w', '???': 'w', '???': 'x', '???': 'x', '???': 'x', '??': 'y', '??': 'y', '??': 'y', '???': 'y', '???': 'y', '???': 'y', '??': 'y', '???': 'y', '???': 'y', '??': 'y', '???': 'y', '??': 'y', '???': 'y', '??': 'z', '??': 'z', '???': 'z', '??': 'z', '???': 'z', '??': 'z', '???': 'z', '??': 'z', '???': 'z', '???': 'z', '???': 'z', '??': 'z', '??': 'z', '??': 'z', '???': 'ff', '???': 'ffi', '???': 'ffl', '???': 'fi', '???': 'fl', '??': 'ij', '??': 'oe', '???': 'st', '???': 'a', '???': 'e', '???': 'i', '???': 'j', '???': 'o', '???': 'r', '???': 'u', '???': 'v', '???': 'x', '??': 'YO', '??': 'I', '??': 'TS', '??': 'U', '??': 'K', '??': 'E', '??': 'N', '??': 'G', '??': 'SH', '??': 'SCH', '??': 'Z', '??': 'H', '??': '\'', '??': 'yo', '??': 'i', '??': 'ts', '??': 'u', '??': 'k', '??': 'e', '??': 'n', '??': 'g', '??': 'sh', '??': 'sch', '??': 'z', '??': 'h', '??': '\'', '??': 'F', '??': 'I', '??': 'V', '??': 'a', '??': 'P', '??': 'R', '??': 'O', '??': 'L', '??': 'D', '??': 'ZH', '??': 'E', '??': 'f', '??': 'i', '??': 'v', '??': 'a', '??': 'p', '??': 'r', '??': 'o', '??': 'l', '??': 'd', '??': 'zh', '??': 'e', '??': 'Ya', '??': 'CH', '??': 'S', '??': 'M', '??': 'I', '??': 'T', '??': '\'', '??': 'B', '??': 'YU', '??': 'ya', '??': 'ch', '??': 's', '??': 'm', '??': 'i', '??': 't', '??': '\'', '??': 'b', '??': 'yu' }

const presidentaddresses = ['George.W_32', 'John.A_35', 'Thomas.J_43', 'James.M_51', 'James.M_58', 'John.Q.A_67', 'Andrew.J_67', 'Martin.V.B_82', 'William.H.H_73', 'John.T_90', 'James.K.P_95', 'Zachary.T_84', 'Millard.F_00', 'Franklin.P_04', 'James.B_91', 'Abraham.L_09', 'Andrew.J_08', 'Ulysses.S.G_22', 'Rutherford.B.H_22', 'James.A.G_31', 'Chester.A.A_29', 'Grover.C_37', 'Benjamin.H_33', 'Grover.C_37', 'William.M_43', 'Theodore.R_58', 'William.H.T_57', 'Woodrow.W_56', 'Warren.G.H_65', 'Calvin.C_72', 'Herbert.H_74', 'Franklin.D.R_82', 'Harry.S.T_84', 'Dwight.D.E_90', 'John.F.K_17', 'Lyndon.B.J_08', 'Richard.N_13', 'Gerald.F_13', 'Jimmy.C_24', 'Ronald.R_11', 'George.H.W.B_24', 'Bill.C_46', 'George.W.B_46', 'Barack.O_61']
const commonEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'mac.com', 'me.com', 'shaw.ca', 'msn.com', 'rogers.com', 'sympatico.ca', 'yahoo.co.uk', 'icloud.com', 'live.com', 'outlook.com', 'btinternet.com', 'yahoo.ca', 'gmx.de', 'democratsabroad.org', 'googlemail.com', 'telus.net', 't-online.de', 'wanadoo.fr', 'web.de', 'hotmail.co.uk', 'dems-dr.org', 'bluewin.ch', 'comcast.net', 'orange.fr', 'earthlink.net', 'yahoo.fr', 'cogeco.ca', 'sbcglobal.net', 'ymail.com', 'utoronto.ca', 'gmx.net', 'yahoo.de', 'free.fr', 'mail.mcgill.ca', 'nyu.edu', 'hotmail.fr', 'eircom.net', 'rocketmail.com', 'libero.it', 'online.no', 'bigpond.com', 'netvision.net.il', 'ntlworld.com', 'prodigy.net.mx', 'att.net', 'xs4all.nl', 'yahoo.com.au', 'blueyonder.co.uk', 'yahoo.es', 'bell.net', 'st-andrews.ac.uk', 'videotron.ca', 'eastlink.ca', 'yahoo.it', 'cam.ac.uk', 'yorku.ca', 'hotmail.de', 'alice.it', 'juno.com', 'mail.com', 'ualberta.ca', 'btopenworld.com', 'cornell.edu', 'post.harvard.edu', 'telia.com', 'umich.edu', 'aim.com', 'gol.com', 'otenet.gr', 'noos.fr', 'optusnet.com.au', 'skynet.be', 'umn.edu', 'lse.ac.uk', 'us.army.mil', 'mindspring.com', 'netscape.net', 'usa.net', 'bezeqint.net', 'columbia.edu', 'hotmail.it', 'bellsouth.net', 'tcd.ie', 'tiscali.it', 'uvic.ca', 'arcor.de', 'planet.nl', 'tin.it', 'fastmail.fm', 'sfu.ca', 'verizon.net', 'ns.sympatico.ca', 'bigpond.net.au', 'mcmaster.ca', 'live.co.uk', 'yahoo.com.mx']
function randomPresAddress () { return `${presidentaddresses[Math.floor(Math.random() * presidentaddresses.length)]}@${commonEmailDomains.filter(x => !/dem/.test(x))[Math.floor(Math.random() * commonEmailDomains.length)]}` }

export { placesAutocomplete, placeDetails, cleanString, returnArrayOfReasonableBirthDates, uuidv4, commonEmailDomains, randomPresAddress }
