const libPhone = require('libphonenumber-js')
const examples = require('libphonenumber-js/examples.mobile.json')
const metadata = require('libphonenumber-js/metadata.full.json')
const countries = require('./assets/countries.json')
var fs = require('fs')
const countriesWithPhone = countries.map(country => ({
  name: country.name,
  code: country.code,
  exPhone: examples[country.code] ? libPhone.format(libPhone.parse(examples[country.code], country.code), 'International') : ''
}))
fs.writeFileSync(`./data/countries/countriesWithPhoneExamples.json`, JSON.stringify(countriesWithPhone, null, 2), function (err) {
  if (err) {
    return console.error(err)
  }

  // console.log("The file was saved!");
})

// console.log(libPhone.format())
// console.log(metadata.countries)
for (const country in metadata.countries) {
  fs.writeFileSync(`./data/phoneMeta/${country}.json`, JSON.stringify(metadata.countries[country], null, 2), function (err) {
    if (err) {
      return console.error(err)
    }

    // console.log("The file was saved!");
  })
  // console.log(country, metadata.countries[country])
}
let bareMeta = Object.assign({}, metadata)
bareMeta.countries = {}
fs.writeFileSync(`./data/phoneMeta/bareMeta.json`, JSON.stringify(bareMeta, null, 2), function (err) {
  if (err) {
    return console.error(err)
  }

  // console.log("The file was saved!");
})
// fs.writeFile(`./data/phoneMeta/${code}.json`, "Hey there!", function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// })
