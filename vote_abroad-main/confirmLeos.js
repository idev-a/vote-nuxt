var apiKey = process.env.MAILGUN_API_KEY
var domain = 'mail.votefromabroad.org'
const fs = require('fs')
var mailgun = require('mailgun-js')({apiKey, domain: domain})
// var b64 = require('base64-arraybuffer');

let delay = 200
let start = 0
// DONE: AK, AL, AR, AS, AZ, CA, CO, CT, DC, DE, FL, GA, GU, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, PR, RI, SC, SD, TN, TX, UT, VA, VI, VT, WA, WI, WV, WY
let StateLeos = fs.readFileSync('./static/leos/WY-leos.json')
StateLeos = JSON.parse(StateLeos)
console.log(StateLeos)
// let imageData = fs.readFileSync('../../../Downloads/0-5.png')

// let attch = new mailgun.Attachment({data: imageData, filename: 'Jaclyn-Biller-FPCA.png', contentType: 'image/png'})
// eslint-disable-next-line no-unused-vars
let timerEmail = setTimeout(function request () {
  if (start >= StateLeos.length) {

  } else {
    let leo = StateLeos[start]
    let message = `Hi, would you please confirm that the following contact information is correct for overseas UOCAVA voters? \n\n${leo.n}\n\ntel: ${leo.p || 'NONE'}\nfax: ${leo.f || 'NONE'}\nemail: ${leo.e || 'NONE'}\n\n${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c}, ${leo.s} ${leo.z}\n\nThanks in advance, \n\nAlex Montgomery\nVoteFromAbroad.org`
    let htmlmessage = `<html><p>Hi, would you please confirm that the following contact information is correct for overseas UOCAVA voters?</p><p>${leo.n}<br/>tel: ${leo.p || 'NONE'}<br/>fax: ${leo.f || 'NONE'}<br/>email: ${leo.e || 'NONE'}<br/><br/>${leo.a1 ? leo.a1 + '<br/>' : ''}${leo.a2 ? leo.a2 + '<br/>' : ''}${leo.a3 ? leo.a3 + '<br/>' : ''}${leo.c}, ${leo.s} ${leo.z}<br/><br/>Thanks in advance, <br/><br/>Alex Montgomery<br/>VoteFromAbroad.org</p></html>`
    var email = {
      from: 'Alex Montgomery <vote@mail.votefromabroad.org>',
      to: `${leo.n} <${leo.e}>`,
      subject: `Confirming contact information for UOCAVA Voters (${leo.n})`,
      text: message,
      html: htmlmessage,
      'o:tag': ['LeoConfirmation', leo.s, `${leo.n} <${leo.e}>`],
      'o:tracking-opens': 'True'
    }
    // eslint-disable-next-line no-unused-vars
    let timerId = null
    mailgun.messages().send(email, function (error, body) {
      if (error) {
        console.log(`error ${leo.email}`, error)
        start += 1
        timerId = setTimeout(request, delay)
      } else {
        console.log(`Email sent to ${leo.email}`)
        start += 1
        timerId = setTimeout(request, delay)
      }
    })
  }
}, delay)

// AK.forEach(leo => {
//   var email = {
//     from: '',
//     to: '',
//     subject: 'FPCA Submission',
//     text: ``,
//     html: `<html></html>`,
//   }
// });
// mailgun.messages().send(email, function (error, body) {
//   if (error) {
//     console.log('error', error)
//   }
//   console.log(`Email sent`, JSON.stringify(body, null, 2))
// })
