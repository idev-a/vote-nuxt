<style>

</style>

<script>
// Note how there's no template or styles in this component.

// Helper functions to convert a percentage of canvas area to pixels.
const percentWidthToPix = (percent, ctx) => Math.floor((ctx.canvas.width / 100) * percent)
const percentHeightToPix = (percent, ctx) => Math.floor((ctx.canvas.height / 130) * percent)

export default {
  // Gets us the provider property from the parent <my-canvas> component.
  inject: ['provider'],

  props: {
    lastName: {
      type: String,
      default: ''
    },
    firstName: {
      type: String,
      default: ''
    },
    middleName: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    previousName: {
      type: String,
      default: ''
    },
    dob: {
      type: String,
      default: null
    },
    ssn: {
      type: String,
      default: ''
    },
    stateId: {
      type: String,
      default: ''
    },
    votStreet: {
      type: String,
      default: ''
    },
    votApt: {
      type: String,
      default: ''
    },
    votCity: {
      type: String,
      default: ''
    },
    votState: {
      type: String,
      default: ''
    },
    votCounty: {
      type: String,
      default: ''
    },
    votZip: {
      type: String,
      default: ''
    },
    abrAdr: {
      type: Object,
      default: () => ({ alt1: '', alt2: '', alt3: '', alt4: '', alt5: '', formatted: [''] })
    },
    fwdAdr: {
      type: Object,
      default: () => ({ alt1: '', alt2: '', alt3: '', alt4: '', alt5: '' })
    },
    email: {
      type: String,
      default: ''
    },
    altEmail: {
      type: String,
      default: ''
    },
    tel: {
      type: String,
      default: ''
    },
    fax: {
      type: String,
      default: ''
    },
    party: {
      type: String,
      default: ''
    },
    addlInfo: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    classification: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      default: ''
    },
    recBallot: {
      type: String,
      default: ''
    },
    signature: {
      type: String
    }
  },

  computed: {
    addlComputed () {
      let split = ['', '', '']
      let infoLength = this.addlInfo.length
      let len2 = infoLength - 86
      let len3 = infoLength - 172
      split[0] = infoLength > 0 ? this.addlInfo.substr(0, len2 > 0 ? 86 : infoLength) : ''
      split[1] = len2 > 0 ? this.addlInfo.substr(86, len3 > 0 ? 86 : len2) : ''
      split[2] = len3 > 0 ? this.addlInfo.substr(172, len3) : ''
      return split
    },
    birthMon () {
      return this.dob.substr(5, 2)
    },
    birthDay () {
      return this.dob.substr(8, 2)
    },
    birthYr () {
      return this.dob.substr(0, 4)
    },
    dateMon () {
      return this.date.substr(5, 2)
    },
    dateDay () {
      return this.date.substr(8, 2)
    },
    dateYr () {
      return this.date.substr(0, 4)
    },
    isMale () {
      return this.sex.toLowerCase() === 'male' ? 'X' : ''
    },
    isFemale () {
      return this.sex.toLowerCase() === 'female' ? 'X' : ''
    },
    isMilitary () {
      return this.classification.toLowerCase() === 'military' ? 'X' : ''
    },
    isMilSpouse () {
      return this.classification.toLowerCase() === 'milspouse' ? 'X' : ''
    },
    isNatGuard () {
      return this.classification.toLowerCase() === 'natguard' ? 'X' : ''
    },
    isIntendToReturn () {
      return this.classification.toLowerCase() === 'intendtoreturn' ? 'X' : ''
    },
    isUncertainReturn () {
      return this.classification.toLowerCase() === 'uncertainreturn' ? 'X' : ''
    },
    isNeverResided () {
      return this.classification.toLowerCase() === 'neverresided' ? 'X' : ''
    },
    isReceiveBallotMail () {
      return this.recBallot.toLowerCase() === 'mail' ? 'X' : ''
    },
    isReceiveBallotEmail () {
      return this.recBallot.toLowerCase() === 'email' ? 'X' : ''
    },
    isReceiveBallotFax () {
      return this.recBallot.toLowerCase() === 'fax' ? 'X' : ''
    },
    calculated () {
      const ctx = this.provider.context
      return {
        fontSize: Math.floor(ctx.canvas.width / 60),
        lastName: {
          x: percentWidthToPix(22.3, ctx),
          y: percentHeightToPix(31.6, ctx)
        },
        firstName: {
          x: percentWidthToPix(22.3, ctx),
          y: percentWidthToPix(34.1, ctx)
        },
        middleName: {
          x: percentWidthToPix(22.3, ctx),
          y: percentWidthToPix(36.6, ctx)
        },
        suffix: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(31.6, ctx)
        },
        previousName: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(34.1, ctx)
        },
        birthMon: {
          x: percentWidthToPix(73.7, ctx),
          y: percentWidthToPix(36.7, ctx)
        },
        birthDay: {
          x: percentWidthToPix(80.0, ctx),
          y: percentWidthToPix(36.7, ctx)
        },
        birthYr: {
          x: percentWidthToPix(86.3, ctx),
          y: percentWidthToPix(36.7, ctx)
        },
        ssn: [
          {x: percentWidthToPix(23.5, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(26.6, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(29.7, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(33.0, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(36.1, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(39.5, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(42.6, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(45.6, ctx), y: percentWidthToPix(39.5, ctx)},
          {x: percentWidthToPix(48.7, ctx), y: percentWidthToPix(39.5, ctx)}
        ],
        stateId: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(39.5, ctx)
        },
        votStreet: {
          x: percentWidthToPix(22.3, ctx),
          y: percentWidthToPix(46.9, ctx)
        },
        votApt: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(46.9, ctx)
        },
        votCity: {
          x: percentWidthToPix(22.3, ctx),
          y: percentWidthToPix(49.5, ctx)
        },
        votState: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(49.5, ctx)
        },
        votCounty: {
          x: percentWidthToPix(22.3, ctx),
          y: percentWidthToPix(52.1, ctx)
        },
        votZip: {
          x: percentWidthToPix(70.6, ctx),
          y: percentWidthToPix(52.1, ctx)
        },
        abr1: {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(59.5, ctx)},
        abr2: {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(62, ctx)},
        abr3: {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(64.5, ctx)},
        abr4: {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(67, ctx)},
        abr5: {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(69.5, ctx)},
        fwd: [
          {x: percentWidthToPix(51, ctx), y: percentWidthToPix(59.5, ctx)},
          {x: percentWidthToPix(51, ctx), y: percentWidthToPix(62, ctx)},
          {x: percentWidthToPix(51, ctx), y: percentWidthToPix(64.5, ctx)},
          {x: percentWidthToPix(51, ctx), y: percentWidthToPix(67, ctx)},
          {x: percentWidthToPix(51, ctx), y: percentWidthToPix(69.5, ctx)}
        ],
        email: {
          x: percentWidthToPix(17.3, ctx),
          y: percentWidthToPix(76.6, ctx)
        },
        altEmail: {
          x: percentWidthToPix(17.3, ctx),
          y: percentWidthToPix(79.3, ctx)
        },
        tel: {
          x: percentWidthToPix(57.1, ctx),
          y: percentWidthToPix(76.8, ctx)
        },
        fax: {
          x: percentWidthToPix(57.1, ctx),
          y: percentWidthToPix(79.5, ctx)
        },
        party: {
          x: percentWidthToPix(68.8, ctx),
          y: percentWidthToPix(86.6, ctx)
        },
        addlInfo: [
          {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(95.6, ctx)},
          {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(98.4, ctx)},
          {x: percentWidthToPix(6.4, ctx), y: percentWidthToPix(101.3, ctx)}
        ],
        dateDay: {
          x: percentWidthToPix(83, ctx),
          y: percentWidthToPix(119.5, ctx)
        },
        dateMon: {
          x: percentWidthToPix(79, ctx),
          y: percentWidthToPix(119.5, ctx)
        },
        dateYr: {
          x: percentWidthToPix(87, ctx),
          y: percentWidthToPix(119.5, ctx)
        },
        signature: {
          x: percentWidthToPix(16.5, ctx),
          y: percentWidthToPix(115.2, ctx)
        },
        classification: {
          x: percentWidthToPix(60.3, ctx),
          y: percentWidthToPix(90.3, ctx)
        },
        isMale: {
          x: percentWidthToPix(87.3, ctx),
          y: percentWidthToPix(32.1, ctx)
        },
        isFemale: {
          x: percentWidthToPix(87.3, ctx),
          y: percentWidthToPix(30.5, ctx)
        },
        isReceiveBallotMail: {
          x: percentWidthToPix(23.9, ctx),
          y: percentWidthToPix(84.0, ctx)
        },
        isReceiveBallotEmail: {
          x: percentWidthToPix(23.9, ctx),
          y: percentWidthToPix(85.6, ctx)
        },
        isReceiveBallotFax: {
          x: percentWidthToPix(23.9, ctx),
          y: percentWidthToPix(87.3, ctx)
        },
        isMilitary: {
          x: percentWidthToPix(22.1, ctx),
          y: percentWidthToPix(21.9, ctx)
        },
        isMilSpouse: {
          x: percentWidthToPix(68.9, ctx),
          y: percentWidthToPix(21.9, ctx)
        },
        isNatGuard: {
          x: percentWidthToPix(22.1, ctx),
          y: percentWidthToPix(23.8, ctx)
        },
        isIntendToReturn: {
          x: percentWidthToPix(22.1, ctx),
          y: percentWidthToPix(25.5, ctx)
        },
        isUncertainReturn: {
          x: percentWidthToPix(22.1, ctx),
          y: percentWidthToPix(27.24, ctx)
        },
        isNeverResided: {
          x: percentWidthToPix(22.1, ctx),
          y: percentWidthToPix(29.2, ctx)
        }
      }
    },
    canvasRect () {
      if (!this.provider.context) { return null }
      return this.provider.context.canvas.getBoundingClientRect()
    }
  },

  // created: function () {
  //   if (process.browser) {
  //     window.addEventListener('mousemove', this.move)
  //   }
  // },
  // destroyed: function () {
  //   window.removeEventListener('mousemove', this.move)
  // },
  // methods: {
  //   move: function (val) {
  //     console.log(this.provider.context)
  //     if (val.clientX - this.canvasRect.left > -1 && val.clientY - this.canvasRect.top > -1) {
  //       this.$emit('mouse', { x: val.clientX - this.canvasRect.left, y: val.clientY - this.canvasRect.top })
  //     }
  //   }
  // },

  render () {
    // Since the parent canvas has to mount first, it's *possible* that the context may not be
    // injected by the time this render function runs the first time.
    this.$emit('isLoading', true)
    if (!this.provider.context) return
    const ctx = this.provider.context

    let sign = () => {
      let signature = new Image()
      signature.onload = () => {
        // console.log(signature.width, signature.height)
        ctx.drawImage(signature, 0, 0, signature.width, signature.height, this.calculated.signature.x, this.calculated.signature.y, 1252, 313)
        // ctx.drawImage(signature, 43, 12, 427, 240, this.calculated.signature.x, this.calculated.signature.y, 1152, 648)
      }
      if (this.signature) signature.src = this.signature
    }

    let drawing = new Image()
    drawing.onload = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.drawImage(drawing, 0, 0, ctx.canvas.width, ctx.canvas.height)
      fillText()
      sign()
    }
    drawing.src = '/fpca-min.png'

    sign()

    let fillText = () => {
      let adjustFontAndFill = (field, threshold) => {
        let multiplier = threshold / (this[field] && this[field].length > threshold ? this[field].length : threshold)
        ctx.font = (this.calculated.fontSize * multiplier).toString() + 'px  monospace'
        ctx.fillText(this[field] || '', this.calculated[field].x, this.calculated[field].y)
        ctx.font = this.calculated.fontSize + 'px  Sans-Serif'
      }
      ctx.fillStyle = '#000000'
      ctx.font = this.calculated.fontSize + 'px  monospace'
      ctx.textAlign = 'center'
      ctx.fillText(this.ssn[this.ssn.length - 9] || '#', this.calculated.ssn[0].x, this.calculated.ssn[0].y)
      ctx.fillText(this.ssn[this.ssn.length - 8] || '#', this.calculated.ssn[1].x, this.calculated.ssn[1].y)
      ctx.fillText(this.ssn[this.ssn.length - 7] || '#', this.calculated.ssn[2].x, this.calculated.ssn[2].y)
      ctx.fillText(this.ssn[this.ssn.length - 6] || '#', this.calculated.ssn[3].x, this.calculated.ssn[3].y)
      ctx.fillText(this.ssn[this.ssn.length - 5] || '#', this.calculated.ssn[4].x, this.calculated.ssn[4].y)
      ctx.fillText(this.ssn[this.ssn.length - 4] || '#', this.calculated.ssn[5].x, this.calculated.ssn[5].y)
      ctx.fillText(this.ssn[this.ssn.length - 3] || '#', this.calculated.ssn[6].x, this.calculated.ssn[6].y)
      ctx.fillText(this.ssn[this.ssn.length - 2] || '#', this.calculated.ssn[7].x, this.calculated.ssn[7].y)
      ctx.fillText(this.ssn[this.ssn.length - 1] || '#', this.calculated.ssn[8].x, this.calculated.ssn[8].y)
      // ctx.fillText(this.tel, this.calculated.tel.x, this.calculated.tel.y)
      if (this.tel) {
        this.tel.split('').filter(x => x !== ' ').forEach((char, index) => ctx.fillText(char, this.calculated.tel.x + (index * percentWidthToPix(2.55, ctx)), this.calculated.tel.y))
      }
      if (this.fax) {
        this.fax.split('').filter(x => x !== ' ').forEach((char, index) => ctx.fillText(char, this.calculated.fax.x + (index * percentWidthToPix(2.55, ctx)), this.calculated.fax.y))
      }
      // ctx.fillText(this.fax, this.calculated.fax.x, this.calculated.fax.y)
      ctx.textAlign = 'left'
      adjustFontAndFill('lastName', 28)
      adjustFontAndFill('firstName', 28)
      adjustFontAndFill('middleName', 28)
      adjustFontAndFill('suffix', 13)
      adjustFontAndFill('previousName', 23)
      // ctx.fillText(this.lastName || '', this.calculated.lastName.x, this.calculated.lastName.y)
      // ctx.fillText(this.firstName || '', this.calculated.firstName.x, this.calculated.firstName.y)
      // ctx.fillText(this.middleName || '', this.calculated.middleName.x, this.calculated.middleName.y)
      // ctx.fillText(this.suffix || '', this.calculated.suffix.x, this.calculated.suffix.y)
      // ctx.fillText(this.previousName || '', this.calculated.previousName.x, this.calculated.previousName.y)
      ctx.fillText(this.birthMon || '', this.calculated.birthMon.x, this.calculated.birthMon.y)
      ctx.fillText(this.birthDay || '', this.calculated.birthDay.x, this.calculated.birthDay.y)
      ctx.fillText(this.birthYr || '', this.calculated.birthYr.x, this.calculated.birthYr.y)
      ctx.fillText(this.stateId || '', this.calculated.stateId.x, this.calculated.stateId.y)
      ctx.fillText(this.votStreet || '', this.calculated.votStreet.x, this.calculated.votStreet.y)
      ctx.fillText(this.votApt || '', this.calculated.votApt.x, this.calculated.votApt.y)
      ctx.fillText(this.votCity || '', this.calculated.votCity.x, this.calculated.votCity.y)
      ctx.fillText(this.votState || '', this.calculated.votState.x, this.calculated.votState.y)
      ctx.fillText(this.votCounty || '', this.calculated.votCounty.x, this.calculated.votCounty.y)
      ctx.fillText(this.votZip || '', this.calculated.votZip.x, this.calculated.votZip.y)
      ctx.fillText(this.abrAdr.formatted && this.abrAdr.formatted[0] ? this.abrAdr.formatted[0] : '', this.calculated.abr1.x, this.calculated.abr1.y)
      ctx.fillText(this.abrAdr.formatted && this.abrAdr.formatted[1] ? this.abrAdr.formatted[1] : '', this.calculated.abr2.x, this.calculated.abr2.y)
      ctx.fillText(this.abrAdr.formatted && this.abrAdr.formatted[2] ? this.abrAdr.formatted[2] : '', this.calculated.abr3.x, this.calculated.abr3.y)
      ctx.fillText(this.abrAdr.formatted && this.abrAdr.formatted[3] ? this.abrAdr.formatted[3] : '', this.calculated.abr4.x, this.calculated.abr4.y)
      ctx.fillText(this.abrAdr.formatted && this.abrAdr.formatted[4] ? this.abrAdr.formatted[4] : '', this.calculated.abr5.x, this.calculated.abr5.y)
      ctx.fillText(this.fwdAdr.formatted && this.fwdAdr.formatted[0] ? this.fwdAdr.formatted[0] : '', this.calculated.fwd[0].x, this.calculated.fwd[0].y)
      ctx.fillText(this.fwdAdr.formatted && this.fwdAdr.formatted[1] ? this.fwdAdr.formatted[1] : '', this.calculated.fwd[1].x, this.calculated.fwd[1].y)
      ctx.fillText(this.fwdAdr.formatted && this.fwdAdr.formatted[2] ? this.fwdAdr.formatted[2] : '', this.calculated.fwd[2].x, this.calculated.fwd[2].y)
      ctx.fillText(this.fwdAdr.formatted && this.fwdAdr.formatted[3] ? this.fwdAdr.formatted[3] : '', this.calculated.fwd[3].x, this.calculated.fwd[3].y)
      ctx.fillText(this.fwdAdr.formatted && this.fwdAdr.formatted[4] ? this.fwdAdr.formatted[4] : '', this.calculated.fwd[4].x, this.calculated.fwd[4].y)
      ctx.fillText(this.party || '', this.calculated.party.x, this.calculated.party.y)
      ctx.fillText(this.addlComputed[0] || '', this.calculated.addlInfo[0].x, this.calculated.addlInfo[0].y)
      ctx.fillText(this.addlComputed[1] || '', this.calculated.addlInfo[1].x, this.calculated.addlInfo[1].y)
      ctx.fillText(this.addlComputed[2] || '', this.calculated.addlInfo[2].x, this.calculated.addlInfo[2].y)
      ctx.fillText(this.dateDay || '', this.calculated.dateDay.x, this.calculated.dateDay.y)
      ctx.fillText(this.dateMon || '', this.calculated.dateMon.x, this.calculated.dateMon.y)
      ctx.fillText(this.dateYr || '', this.calculated.dateYr.x, this.calculated.dateYr.y)
      // if ((this.email && this.email.length > 33) || (this.altEmail && this.altEmail.length > 33)) {
      //   let multiplier = 33 / Math.max(this.email ? this.email.length : 0, this.altEmail ? this.altEmail.length : 0)
      //   ctx.font = this.calculated.fontSize * multiplier + 'px  monospace'
      // }
      // ctx.fillText(this.email || '', this.calculated.email.x, this.calculated.email.y)
      // ctx.fillText(this.altEmail || '', this.calculated.altEmail.x, this.calculated.altEmail.y)
      // ctx.font = this.calculated.fontSize + 'px  Sans-Serif'

      adjustFontAndFill('email', 33)
      adjustFontAndFill('altEmail', 33)
      ctx.fillText(this.isMale, this.calculated.isMale.x, this.calculated.isMale.y)
      ctx.fillText(this.isFemale, this.calculated.isFemale.x, this.calculated.isFemale.y)
      ctx.fillText(this.isReceiveBallotMail, this.calculated.isReceiveBallotMail.x, this.calculated.isReceiveBallotMail.y)
      ctx.fillText(this.isReceiveBallotEmail, this.calculated.isReceiveBallotEmail.x, this.calculated.isReceiveBallotEmail.y)
      ctx.fillText(this.isReceiveBallotFax, this.calculated.isReceiveBallotFax.x, this.calculated.isReceiveBallotFax.y)
      ctx.fillText(this.isMilitary, this.calculated.isMilitary.x, this.calculated.isMilitary.y)
      ctx.fillText(this.isMilSpouse, this.calculated.isMilSpouse.x, this.calculated.isMilSpouse.y)
      ctx.fillText(this.isNatGuard, this.calculated.isNatGuard.x, this.calculated.isNatGuard.y)
      ctx.fillText(this.isIntendToReturn, this.calculated.isIntendToReturn.x, this.calculated.isIntendToReturn.y)
      ctx.fillText(this.isUncertainReturn, this.calculated.isUncertainReturn.x, this.calculated.isUncertainReturn.y)
      ctx.fillText(this.isNeverResided, this.calculated.isNeverResided.x, this.calculated.isNeverResided.y)
    }
    this.$emit('isLoading', false)
  }
}
</script>
