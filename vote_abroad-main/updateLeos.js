const fetch = require('cross-fetch')
const util = require('util')
const fs = require('fs-extra')
const readFile = util.promisify(fs.readFile)
// eslint-disable-next-line no-unused-vars
const writeFile = util.promisify(fs.writeFile)

let errors = []
let changes = []

const states = [
  { code: 'AL', name: 'Alabama', fvapId: '1' },
  { code: 'AK', name: 'Alaska', fvapId: '2' },
  { code: 'AS', name: 'American Samoa', fvapId: '52' },
  { code: 'AZ', name: 'Arizona', fvapId: '3' },
  { code: 'AR', name: 'Arkansas', fvapId: '4' },
  { code: 'CA', name: 'California', fvapId: '5' },
  { code: 'CO', name: 'Colorado', fvapId: '6' },
  { code: 'CT', name: 'Connecticut', fvapId: '7' },
  { code: 'DE', name: 'Delaware', fvapId: '8' },
  { code: 'DC', name: 'District of Columbia', fvapId: '51' },
  { code: 'FL', name: 'Florida', fvapId: '9' },
  { code: 'GA', name: 'Georgia', fvapId: '10' },
  { code: 'GU', name: 'Guam', fvapId: '53' },
  { code: 'HI', name: 'Hawaii', fvapId: '11' },
  { code: 'ID', name: 'Idaho', fvapId: '12' },
  { code: 'IL', name: 'Illinois', fvapId: '13' },
  { code: 'IN', name: 'Indiana', fvapId: '14' },
  { code: 'IA', name: 'Iowa', fvapId: '15' },
  { code: 'KS', name: 'Kansas', fvapId: '16' },
  { code: 'KY', name: 'Kentucky', fvapId: '17' },
  { code: 'LA', name: 'Louisiana', fvapId: '18' },
  { code: 'ME', name: 'Maine', fvapId: '19' },
  { code: 'MD', name: 'Maryland', fvapId: '20' },
  { code: 'MA', name: 'Massachusetts', fvapId: '21' },
  { code: 'MI', name: 'Michigan', fvapId: '22' },
  { code: 'MN', name: 'Minnesota', fvapId: '23' },
  { code: 'MS', name: 'Mississippi', fvapId: '24' },
  { code: 'MO', name: 'Missouri', fvapId: '25' },
  { code: 'MT', name: 'Montana', fvapId: '26' },
  { code: 'NE', name: 'Nebraska', fvapId: '27' },
  { code: 'NV', name: 'Nevada', fvapId: '28' },
  { code: 'NH', name: 'New Hampshire', fvapId: '29' },
  { code: 'NJ', name: 'New Jersey', fvapId: '30' },
  { code: 'NM', name: 'New Mexico', fvapId: '31' },
  { code: 'NY', name: 'New York', fvapId: '32' },
  { code: 'NC', name: 'North Carolina', fvapId: '33' },
  { code: 'ND', name: 'North Dakota', fvapId: '34' },
  { code: 'OH', name: 'Ohio', fvapId: '35' },
  { code: 'OK', name: 'Oklahoma', fvapId: '36' },
  { code: 'OR', name: 'Oregon', fvapId: '37' },
  { code: 'PA', name: 'Pennsylvania', fvapId: '38' },
  { code: 'PR', name: 'Puerto Rico', fvapId: '54' },
  { code: 'RI', name: 'Rhode Island', fvapId: '39' },
  { code: 'SC', name: 'South Carolina', fvapId: '40' },
  { code: 'SD', name: 'South Dakota', fvapId: '41' },
  { code: 'TN', name: 'Tennessee', fvapId: '42' },
  { code: 'TX', name: 'Texas', fvapId: '43' },
  { code: 'UT', name: 'Utah', fvapId: '44' },
  { code: 'VT', name: 'Vermont', fvapId: '45' },
  { code: 'VI', name: 'Virgin Islands', fvapId: '55' },
  { code: 'VA', name: 'Virginia', fvapId: '46' },
  { code: 'WA', name: 'Washington', fvapId: '47' },
  { code: 'WV', name: 'West Virginia', fvapId: '48' },
  { code: 'WI', name: 'Wisconsin', fvapId: '49' },
  { code: 'WY', name: 'Wyoming', fvapId: '50' }
]

const url = stateCode => `https://www.fvap.gov/search-offices.json?draw=1&columns%5B0%5D%5Bdata%5D=name&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=jurisdiction.name&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=jurisdiction.type.name&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=phoneNumber&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=faxNumber&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=email&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=address&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=2000&search%5Bvalue%5D=&search%5Bregex%5D=false&nameSearch=&jurisdiction=&state=${
  states.find(({ code }) => code === stateCode).fvapId
}&_=1580897800839`

async function returnUpdatedStateData (stateCode) {
  const data = await fetch(url(stateCode))
  const json = await data.json()
  return json
}

function decodeHtmlEntity (str) {
  str = typeof str === 'string' ? str : ''
  str = str.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec)
  })
}

async function handleState (stateAbbreviation) {
  const safeEntries = {}
  const fileName = `./static/leos/${stateAbbreviation.toUpperCase()}-leos.json`
  if (!fs.existsSync(fileName)) {
    fs.writeJSONSync(fileName, [], { spaces: 2 })
  }
  let leosChanged = 0
  const ourData = JSON.parse(await readFile(fileName))
  // create a deep clone of current data to make changes to
  let newFile = JSON.parse(JSON.stringify(ourData))

  const { data: leos } = await returnUpdatedStateData(stateAbbreviation)
  console.log(`On ${stateAbbreviation} => ENTRY`)
  for (const fvapLeo of leos) {
    try {
      const {
        name: n = '',
        id: i = '',
        faxNumber: f = '',
        phoneNumber: p = '',
        email: e = '',
        effectiveDate: d = '',
        address: {
          primaryStreetLine: a1 = '',
          secondaryStreetLine: a2 = '',
          tertiaryStreetLine: a3 = '',
          city: c = '',
          state: {
            abbreviation: s = ''
          },
          zipcode: z = ''
        },
        jurisdiction: {
          name: j = '',
          active: isActive,
          type: {
            name: t = ''
          }
        },
        fpcaOffice,
        fwabOffice
      } = fvapLeo

      const m = Object.keys(ourData).length > 0 ? ourData.find(leo => leo.i === i) : null
      // console.log('\tjurisdiction::', `${j}`)
      if (`${s}-${j}-${e}` in safeEntries) {
        console.log(`\t Skip duplicate ${s}-${j}-${e}`)
        continue
      }
      safeEntries[`${s}-${j}-${e}`] = true
      if (!m && isActive) {
        console.log('\tADDED::', `${s}-${j}::${e}`)
        leosChanged++
        newFile = [
          ...newFile,
          {
            i,
            n: decodeHtmlEntity(n),
            f,
            p,
            e: decodeHtmlEntity(e),
            d,
            a1: decodeHtmlEntity(a1),
            a2: decodeHtmlEntity(a2),
            a3: decodeHtmlEntity(a3),
            c: decodeHtmlEntity(c),
            s,
            z,
            j: decodeHtmlEntity(j),
            t: decodeHtmlEntity(t),
            fpcaOffice,
            fwabOffice
          }
        ]
        changes = [...changes, { change: `added-${s}-${decodeHtmlEntity(j)}-${decodeHtmlEntity(n)}-${i}`, newId: i, newName: decodeHtmlEntity(n), newFax: f, newPhone: p, newEmail: decodeHtmlEntity(e), newEffectiveDate: d, newAddress1: decodeHtmlEntity(a1), newAddress2: decodeHtmlEntity(a2), newAddress3: decodeHtmlEntity(a3), newCity: decodeHtmlEntity(c), newState: s, newZip: z, newJurisdictionName: decodeHtmlEntity(j), newJurisdictionType: decodeHtmlEntity(t), newFpcaOffice: fpcaOffice, newFwabOffice: fwabOffice }]
      } else if (m && 'd' in m && new Date(m.d) < new Date(d)) {
        console.log('\tUPDATED/CHANGED::', `${s}-${j}::${e}`)
        // console.log(`${s}-${j} changed`)
        leosChanged++
        newFile = newFile.map(obj => obj.i === i ? { i, n: decodeHtmlEntity(n), f, p, e: decodeHtmlEntity(e), d, a1: decodeHtmlEntity(a1), a2: decodeHtmlEntity(a2), a3: decodeHtmlEntity(a3), c: decodeHtmlEntity(c), s, z, j: decodeHtmlEntity(j), t, fpcaOffice, fwabOffice } : obj)
        changes = [...changes, {
          change: `changed-${s}-${j}-${n}-${i}`,
          ...i !== m.i && { newId: i, oldId: m.i },
          ...n !== m.n && { newName: decodeHtmlEntity(n), oldName: m.n },
          ...f !== m.f && { newFax: f, oldFax: m.f },
          ...p !== m.p && { newPhone: p, oldPhone: m.p },
          ...e !== m.e && { newEmail: decodeHtmlEntity(e), oldEmail: m.e },
          ...d !== m.d && { newEffectiveDate: d, oldEffectiveDate: m.d },
          ...a1 !== m.a1 && { newAddress1: decodeHtmlEntity(a1), oldAddress1: m.a1 },
          ...a2 !== m.a2 && { newAddress2: decodeHtmlEntity(a2), oldAddress2: m.a2 },
          ...a3 !== m.a3 && { newAddress3: decodeHtmlEntity(a3), oldAddress3: m.a3 },
          ...c !== m.c && { newCity: decodeHtmlEntity(c), oldCity: m.c },
          ...s !== m.s && { newState: s, oldState: m.s },
          ...z !== m.z && { newZip: z, oldZip: m.z },
          ...j !== m.j && { newJurisdictionName: decodeHtmlEntity(j), oldJurisdictionName: m.j },
          ...t !== m.t && { newJurisdictionType: t, oldJurisdictionType: m.t },
          ...fpcaOffice !== m.fpcaOffice && { newFbcaOffice: fpcaOffice, oldFpcaOffice: m.fpcaOffice },
          ...fwabOffice !== m.fwabOffice && { newFwabOffice: fwabOffice, oldFwabOffice: m.fwabOffice }
        }]
      }
    } catch (error) {
      console.error(error)
      errors.push({ error: error.message, fvapData: fvapLeo })
    }
    // console.log({ i, n, f, p, e, d, a1, a2, a3, c, s, z, j, t })
  }
  // await writeFile(fileName, JSON.stringify(newFile, null, 2) + '\n')
  fs.writeJSONSync(fileName, newFile, { spaces: 2 })
  return leosChanged
}

async function main () {
  let total = 0
  let summary = []
  for (const state of states) {
    const leosChanged = await handleState(state.code)
    total = total + leosChanged
    summary = [...summary, { [state.code]: leosChanged }]
  }
  console.log('CHANGES: ', summary)
  console.log('TOTAL: ', total)

  if (!fs.existsSync('./logs')) {
    fs.ensureDirSync('./logs')
  }

  const updateDate = new Date().toISOString()
  if (errors.length) {
    // await writeFile(`./logs/${updateDate}-errors(${errors.length}).json`, JSON.stringify(errors, null, 2) + '\n')
    fs.writeJSONSync(`./logs/${updateDate}-errors(${errors.length}).json`, errors, { spaces: 2 })
  }
  if (changes.length) {
    // await writeFile(`./logs/${updateDate}-changes(${changes.length}).json`, JSON.stringify(changes, null, 2) + '\n')
    fs.writeJSONSync(`./logs/${updateDate}-changes(${changes.length}).json`, changes, { spaces: 2 })
  }
}

main()
