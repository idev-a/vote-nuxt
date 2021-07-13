const path = require('path')
const fs = require('fs')
const ParseCSV = require('papaparse')

const SOURCE_FILE = path.join(process.cwd(), 'rls.csv')
if (!fs.existsSync(SOURCE_FILE)) {
  throw new Error('Source file "rls.csv" not found in project root directory. Please make sure you have the valid and updated source file and try again.')
}
const CONTENT_DIR = path.join(process.cwd(), 'content', 'rls')
const keyMap = {
  'STATE': 'state',
  'AM I REGISTERED?': 'amIRegistered',
  'WHERE IS MY BALLOT?': 'whereIsMyBallot',
  'SAMPLE BALLOT': 'sampleBallot',
  'STATE PAGE OVERSEAS VOTERS': 'uocavaVoters'
}

async function main (data) {
  if (!(data && Array.isArray(data))) {
    throw new Error('Invalid input object')
  }
  for (let index = 0; index < data.length; index++) {
    const targetFile = path.join(CONTENT_DIR, `${data[index].state}.md`.toLocaleLowerCase())
    if (fs.existsSync(targetFile)) {
      const content = fs.readFileSync(targetFile, 'utf8')
      if (!content) {
        continue
      }
      let lines = content.split('\n')
      if (validateUrl(data[index].amIRegistered)) {
        lines = replaceLink({
          lines,
          key: 'amIRegistered',
          link: data[index].amIRegistered
        })
      }
      if (validateUrl(data[index].whereIsMyBallot)) {
        lines = replaceLink({
          lines,
          key: 'whereIsMyBallot',
          link: data[index].whereIsMyBallot
        })
      }
      if (validateUrl(data[index].sampleBallot)) {
        lines = replaceLink({
          lines,
          key: 'sampleBallot',
          link: data[index].sampleBallot
        })
      }
      if (validateUrl(data[index].uocavaVoters)) {
        lines = replaceLink({
          lines,
          key: 'uocavaVoters',
          link: data[index].uocavaVoters
        })
      }
      fs.writeFileSync(targetFile, lines.join('\n'))
    }
  }
}

const content = fs.readFileSync(SOURCE_FILE, 'utf-8')
let { data } = ParseCSV.parse(content, { header: true })
// Map keys
data = data.map(row =>
  Object.assign(
    {},
    {
      ...Object
        .keys(row)
        .reduce((acc, key) =>
          ({ ...acc, ...{ [keyMap[key] || key]: row[key] } })
        )
    }
  )
)
main(data)

function replaceLink (props) {
  const { key, link, lines } = props || {}
  if (!(
    key &&
    Array.isArray(lines) &&
    link
  )) {
    return lines
  }

  let ti = lines.findIndex(x => x.includes(`${key}: >-`))
  if (ti > -1) {
    lines[ti + 1] = `  ${link}`
  } else {
    ti = lines.findIndex(x => x.includes(`${key}:`))
    if (ti > -1) {
      lines[ti] = `${key}: '${link}'`
    }
  }
  return lines
}

/**
 * Check if url is valid
 * @param {String} value - url as string
 */
function validateUrl (value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
}
