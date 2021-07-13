export default function ({ route, params, store, redirect }) {
  let current = store.getters['requests/getCurrent']
  // console.log(params)
  // console.log(route.name)
  if ((params.stage === 'voting-information' ||
  params.stage === 'id-and-contact-information' ||
  route.name.indexOf('review') > -1 ||
  route.name.indexOf('sign-and-submit') > -1 ||
  route.name.indexOf('complete') > -1) &&
    (!current ||
    !current.firstName ||
    !current.lastName ||
    !current.abrAdr ||
    !current.abrAdr.formatted ||
    current.abrAdr.formatted.length === 0)
  ) {
    return redirect('/request/your-information')
  } else if ((params.stage === 'id-and-contact-information' ||
  route.name.indexOf('review') > -1 ||
  route.name.indexOf('sign-and-submit') > -1 ||
  route.name.indexOf('complete') > -1) &&
    (!current.votAdr ||
    !current.votAdr.A ||
    !current.votAdr.C ||
    !current.votAdr.S ||
    !current.votAdr.Z ||
    // !current.leo ||
    !current.leo.a1 ||
    !current.voterClass ||
    !current.recBallot)
  ) {
    return redirect('/request/voting-information')
  } else if (
    (route.name.indexOf('review') > -1 ||
    route.name.indexOf('sign-and-submit') > -1 ||
    route.name.indexOf('complete') > -1) &&
    (!current.identification && !(current.votAdr.S === 'WY' || current.votAdr.S === 'CT' || current.votAdr.S === 'IA' || current.votAdr.S === 'KY' || current.votAdr.S === 'MA' || current.votAdr.S === 'NH' || current.votAdr.S === 'WA'))
  ) {
    return redirect('/request/id-and-contact-information')
  }
}
