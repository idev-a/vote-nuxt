const fs = require('fs')
const axios = require('axios')
const fvapBaseURL = `https://www.fvap.gov/search-offices.json?draw=1&columns%5B0%5D%5Bdata%5D=name&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=jurisdiction.name&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=jurisdiction.type.name&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=phoneNumber&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=faxNumber&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=email&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=address&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=8000&search%5Bvalue%5D=&search%5Bregex%5D=false&nameSearch=&jurisdiction=&state=&_=${Date.parse(new Date())}`
// const officejson = require('./search-offices.json')

// let fvap = axios.create({
//   baseURL: fvapBaseURL,
//   responseType: 'json',
//   timeout: 5000
// })
axios.get(fvapBaseURL)
  .then(res => {
    return res.data.data.map(x => ({
      i: x.id,
      n: x.name,
      f: x.faxNumber,
      p: x.phoneNumber,
      e: x.email,
      d: x.effectiveDate,
      a1: x.address.primaryStreetLine,
      a2: x.address.secondaryStreetLine,
      a3: x.address.tertiaryStreetLine,
      c: x.address.city,
      s: x.address.state.abbreviation,
      z: x.address.zipcode,
      // eslint-disable-next-line no-dupe-keys
      i: x.jurisdiction.id,
      j: x.jurisdiction.name,
      t: x.jurisdiction.type.name
      // display: x.display,
      // street4: x.address.quaternaryStreetLine,
      // timeZone: '',
      // jurisdictionOcdid: '',
      // googlePlaceId: '',
      // coordinates: [],
      // jurisdictionActive: x.jurisdiction.active
    }))
      .reduce((acc, cur, i, a) => {
        if (!acc[cur.s]) {
          acc[cur.s] = []
        }
        acc[cur.s].push(cur)
        return acc
      }
        , {})
  })
  .then(x => {
    Object.keys(x).forEach(state => fs.writeFile(`static/leos/${state.toUpperCase()}-leos.json`, JSON.stringify(x[state]), 'utf8', () => console.log(`wrote ${state.toUpperCase()}-leos.json`)))
  })
