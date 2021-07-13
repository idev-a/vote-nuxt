<template>
  <div class="columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div>
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 5})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage5')}}</h3>
        <p class="is-size-5" v-html="md(transmitInstructions)"></p>
        <p v-if="/NY/.test(currentRequest.leo.s)" class="is-size-5" v-text="$t('request.deadlineLanguage.transmitInstructionsNY')"></p>
        <b-message v-if="transmitRules" type="is-info" has-icon>
          <span v-html="md(transmitRules)"></span>
        </b-message>
        <p class="is-size-5" v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.length > 1" v-html="md($t('request.stages.instructions5sub'))"></p>
      </div>
        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stages.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.includes('Email')"
            @click="$ga.event('formAction', 'submitTypeSelected', 'email')"
            icon="at">
            <section v-if="isIE || /AR|CA|WY/.test(currentRequest.leo.s)" class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.emailIntro')}}</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">{{$t('request.stages.instructions')}}</h3>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="download" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">{{$t('request.stages.mailDownload')}}</p>
                    </div>
                    <div class="media-left">
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.emailSign')" class="is-size-5"></p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="at" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">
                        {{$t('request.stages.emailForm')}}
                      </span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.e"><strong><a :href="`mailto:${currentRequest.leo.e}`">{{ currentRequest.leo.e }}</a></strong><br/></span>
                      </div>
                      <b-message v-if="electronicTransmissionNote" type="is-warning" has-icon>
                        {{electronicTransmissionNote.replace(/\*/g, '') | capitalizeFirstLetter}}
                      </b-message>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a1"><strong>{{ currentRequest.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a2"><strong>{{ currentRequest.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a3"><strong>{{ currentRequest.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.leo.c }}, </strong>
                        <strong>{{ currentRequest.leo.s }} </strong>
                        <strong>{{ currentRequest.leo.z }}</strong><br/></span>
                        <span class="has-text-right"><strong>United States of America</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.emailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            <section v-else-if="!signStep" class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.emailIntro')}}</h3>
              <div class="media">
                <div class="media-content" style="width:100%;">
                  <p class="title is-5">{{$t('request.stages.instructions')}}</p>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-camera fa-2x"></i>
                      </span>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p v-if="canCaptureImage" class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailDigiSign'))"></p>
                        <p v-else class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailUploadSignature'))"></p>
                        <a v-if="!signStep"
                          class="button is-pulled-right is-primary"
                          @click="signStep = 'signatureAffirmation'">
                          <b-icon icon="camera" size="is-small"></b-icon>
                          <span>{{$t('request.stages.sign')}}</span>
                        </a>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <span class="fa-stack fa-lg">
                          <i class="fas fa-camera fa-stack-1x"></i>
                          <i class="fas fa-ban fa-stack-2x"></i>
                        </span>
                      </span>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailDownload'))"></p>
                        <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      </div>
                    </div>
                  </article>
                  <b-message v-if="electronicTransmissionNote" type="is-warning" has-icon>
                      {{electronicTransmissionNote.replace(/\*/g, '') | capitalizeFirstLetter}}
                  </b-message>
                </div>
              </div>
            </section>
            <section v-if="signStep" class="section">
              <transition name="fade">
                <submit-signature-affirmation v-model="signStep" v-if="signStep === 'signatureAffirmation'"></submit-signature-affirmation>
              </transition>
              <transition name="fade">
                <submit-add-signature v-model="signStep" @sigcap="addSig" v-if="signStep === 'addSignature'"></submit-add-signature>
              </transition>
              <transition name="fade">
                <submit-compose-message
                  :instructionsObject="instructionsObject"
                  v-model="signStep"
                  :fpca="fpca"
                  :documentRequired="documentRequired"
                  v-if="signStep === 'composeMessage'">
                </submit-compose-message>
              </transition>
              <transition name="fade">
                <submit-special-instructions v-model="signStep" :msPdf="msPdf" :state="votState" :firstName="firstName" :lastName="lastName" v-if="signStep === 'specialInstructions'"></submit-special-instructions>
              </transition>
            </section>
          </b-tab-item>
          <b-tab-item
            :label="$t('request.stages.fax')"
            @click="$ga.event('formAction', 'submitTypeSelected', 'fax')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Fax') > -1"
            icon="fax">
            <section class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.faxIntro')}}</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">{{$t('request.stages.instructions')}}</h3>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="download" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">{{$t('request.stages.mailDownload')}}</p>
                    </div>
                    <div class="media-left">
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailSign')" class="is-size-5"></p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="fax" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">
                        {{$t('request.stages.faxSend')}}
                      </span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.f"><strong>+1 {{ currentRequest.leo.f }}</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                  <b-message v-if="electronicTransmissionNote" type="is-warning" has-icon>
                      {{electronicTransmissionNote.replace(/\*/g, '') | capitalizeFirstLetter}}
                  </b-message>
                </div>
              </div>
            </section>
          </b-tab-item>
          <b-tab-item
            :label="$t('request.stages.mail')"
            @click="$ga.event('formAction', 'submitTypeSelected', 'mail')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open">
            <section class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.mailIntro')}}</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">{{$t('request.stages.instructions')}}</h3>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="download" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">{{$t('request.stages.mailDownload')}}</p>
                    </div>
                    <div class="media-left">
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailSign')" class="is-size-5"></p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="envelope" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">{{$t('request.stages.mailPost')}}</span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a1"><strong>{{ currentRequest.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a2"><strong>{{ currentRequest.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a3"><strong>{{ currentRequest.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.leo.c }}, </strong>
                        <strong>{{ currentRequest.leo.s }} </strong>
                        <strong>{{ currentRequest.leo.z }}</strong><br/></span>
                        <span class="has-text-right"><strong>United States of America</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </b-tab-item>
        </b-tabs>
        <review-canvas class="canvas" ref="fpca" style="position:absolute;left:-4600px;width:1px;height:1px;">
          <review-canvas-renderer
            :lastName="lastName"
            :firstName="firstName"
            :middleName="middleName"
            :suffix="suffix"
            :previousName="previousName.previousName"
            :dob="dob"
            :ssn="ssn"
            :stateId="stateId"
            :votStreet="votStreet"
            :votApt="votApt"
            :votCity="votCity"
            :votState="votState"
            :votCounty="votCounty"
            :votZip="votZip"
            :abrAdr="abrAdr"
            :fwdAdr="fwdAdr"
            :email="email"
            :altEmail="altEmail"
            :tel="tel"
            :fax="fax"
            :party="party"
            :addlInfo="addlInfo"
            :date="date"
            :classification="voterClass"
            :sex="sex"
            :recBallot="recBallot"
            :signature="signature"></review-canvas-renderer>
        </review-canvas>
      <section >
        <button v-if="signStep" @click.prevent="() => { signStep = null; scrollUp() }" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></button>
        <nuxt-link v-else :to="localePath({ name: 'request-review' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
    </section>
    </div>
  <vfa-scroll-up></vfa-scroll-up>
  </div>
</template>

<script>
import ReviewCanvas from '~/components/ReviewCanvas.vue'
import ReviewCanvasRenderer from '~/components/ReviewCanvasRenderer.vue'
import SubmitSignatureAffirmation from '~/components/SubmitSignatureAffirmation.vue'
import SubmitAddSignature from '~/components/SubmitAddSignature.vue'
import SubmitComposeMessage from '~/components/SubmitComposeMessage.vue'
import SubmitSpecialInstructions from '~/components/SubmitSpecialInstructions'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import VfaScrollUp from '~/components/VfaScrollUp'
import snarkdown from 'snarkdown'
import fileSaver from 'file-saver'

export default {
  name: 'SignAndSubmit',
  middleware: 'verify-request',
  components: {
    ReviewCanvas,
    ReviewCanvasRenderer,
    SubmitAddSignature,
    SubmitComposeMessage,
    SubmitSignatureAffirmation,
    SubmitSpecialInstructions,
    VfaScrollUp
  },
  async asyncData ({app, store}) {
    let state = store.getters['requests/getCurrent'] && store.getters['requests/getCurrent'].leo ? store.getters['requests/getCurrent'].leo.s : ''
    let elections = (await app.$content('/elections').get('elections')).body
    return {
      registering: store.getters['requests/getCurrent'].isRegistered !== 'registered',
      state: store.getters['requests/getCurrent'].leo.s,
      submissionMethod: store.getters['requests/getCurrent'].recBallot,
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll(),
      stateElections: (await app.$content('/elections').get('elections')).body
        .filter(election => election.state && state && election.state.toLowerCase() === state.toLowerCase())
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        }),
      elections: elections
    }
  },
  data () {
    return {
      isSignatureModalActive: false,
      signature: '',
      hasCamera: false,
      downloadAttrSupported: false,
      needsMsSaveOrOpenBlob: false,
      isSigning: false,
      pdf: '',
      msPdf: '',
      signStep: null,
      fpca: null
    }
  },
  mounted () {
    if (this.joinDa && !this.$store.state.userauth.user.isDA) {
      this.$ga.event('formAction', 'joinDa')
    }
    let feat = this
    if (process.browser) {
      let encodedAbrAdr = encodeURIComponent(`${this.abrAdr.formatted && this.abrAdr.formatted[0] ? this.abrAdr.formatted[0] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[1] ? this.abrAdr.formatted[1] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[2] ? this.abrAdr.formatted[2] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[3] ? this.abrAdr.formatted[3] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[4] ? this.abrAdr.formatted[4] : ''}`)
      let encodedFwdAdr = encodeURIComponent(`${this.fwdAdr.formatted && this.fwdAdr.formatted[0] ? this.fwdAdr.formatted[0] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[1] ? this.fwdAdr.formatted[1] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[2] ? this.fwdAdr.formatted[2] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[3] ? this.fwdAdr.formatted[3] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[4] ? this.fwdAdr.formatted[4] : ''}`)
      axios.get(encodeURI(`/api/fpca${process.env.stage === 'prod' ? '' : '/dev'}?firstName=${encodeURIComponent(this.firstName || '')}&lastName=${encodeURIComponent(this.lastName || '')}&middleName=${encodeURIComponent(this.middleName || '')}&suffix=${encodeURIComponent(this.suffix || '')}&ssn=${encodeURIComponent(this.ssn || '')}&previousName=${encodeURIComponent(this.previousName.previousName || '')}&dob=${encodeURIComponent(this.dob || '')}&stateId=${encodeURIComponent(this.stateId || '')}&votStreet=${encodeURIComponent(this.votStreet || ' ')}&votApt=${encodeURIComponent(this.votApt || '')}&votCity=${encodeURIComponent(this.votCity || '')}&votState=${encodeURIComponent(this.votState || '')}&votCounty=${encodeURIComponent(this.votCounty || '')}&votZip=${encodeURIComponent(this.votZip || '')}&abrAdr=${encodedAbrAdr}&fwdAdr=${encodedFwdAdr}&email=${encodeURIComponent(this.email) || ''}&altEmail=${encodeURIComponent(this.altEmail) || ''}&tel=${this.tel ? encodeURIComponent(this.tel.replace(/\s/g, '')) : ''}&fax=${this.fax ? encodeURIComponent(this.fax.replace(/\s/g, '')) : ''}&party=${encodeURIComponent(this.party || '')}&addlInfo=${encodeURIComponent(this.addlInfo || '')}&date=${encodeURIComponent(this.date || '')}&class=${encodeURIComponent(this.voterClass || '')}&sex=${encodeURIComponent(this.sex || '')}&recBallot=${encodeURIComponent(this.recBallot || '')}&leoName=${encodeURIComponent(this.leoName || '')}&leoAddress=${this.leoAdr ? encodeURIComponent(this.leoAdr) : ''}&leoFax=${encodeURIComponent(this.leoFax || '')}&leoEmail=${encodeURIComponent(this.leoEmail || '')}&leoPhone=${encodeURIComponent(this.leoPhone || '')}&transmitOpts=${encodeURIComponent(this.transmitOpts || '')}&transmitInstructions=${this.pdfInstructions ? encodeURIComponent(this.pdfInstructions) : ''}&deadline=${encodeURIComponent(this.deadlineLanguage)}&lang=${this.$i18n.locale}`), {responseType: 'arraybuffer'})
        .then((response) => {
          let blob = new Blob([response.data], {type: 'application/pdf'})
          this.msPdf = blob
        })
      feat.downloadAttrSupported = ('download' in document.createElement('a'))
      feat.needsMsSaveOrOpenBlob = Boolean(window.navigator.msSaveOrOpenBlob)
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        feat.hasCamera = false
        return
      }
      navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          feat.hasCamera = devices.filter(x => x.kind === 'videoinput').length > 0
        })
        .catch(function (err) {
          feat.hasCamera = false
          console.error(err.name + ': ' + err.message)
        })
    }
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    },
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  methods: {
    scrollUp () { window.scrollTo(0, 0) },
    saveFile: function () {
      fileSaver.saveAs(this.msPdf, `${this.firstName}-${this.lastName}-${new Date().getFullYear()}-fpca.pdf`)
      this.confirmPdfDownload()
    },
    md: function (md) { return snarkdown(md) },
    confirmPdfDownload () {
      this.$store.dispatch('requests/updateRequest', {status: 'formDownloaded'})
      this.$store.commit('requests/update', {status: 'formDownloaded'})
      this.$ga.event('formAction', 'completed', 'download')
      this.$toast.open({
        message: this.md(this.$t('request.fpcaDownload.downloadedAlertMessage')),
        type: 'is-success',
        duration: 7000
      })
      this.$router.push(this.localePath('dashboard'))
    },
    async addSig (val) {
      this.signature = val
      var d = new Date()
      var today = `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}`
      this.$store.commit('requests/update', { date: today })
      this.signStep = 'composeMessage'
      await this.$nextTick()
      setTimeout(() => {
        this.fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      }, 800)
    }
  },
  watch: {
    signStep (val) {
      this.$ga.event('formAction', 'sigCapture', val)
    }
  },
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
    instructionsObject () {
      let votState = this.votState
      return {
        leoName: this.leoName || '',
        transmitOpts: this.transmitOpts,
        default: this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        }),
        specialDeadline: this.$te(`request.deadlineLanguage.${votState}SpecialDeadline`) ? this.$t(`request.deadlineLanguage.${votState}SpecialDeadline`, {leoName: this.leoName}) : this.$t('request.deadlineLanguage.emailSuggested')
      }
    },
    pdfInstructions () {
      if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, this.instructionsObject).replace(/\*{2}/gi, '*')
      } else {
        return (this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts}).concat(this.stateRules.fpcaSubmitOptionsRegister.includes('Email') ? this.$t('request.deadlineLanguage.emailSuggested') : '')).replace(/\*{2}/gi, '*')
      }
    },
    transmitInstructions () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        // return this.$t(`request.deadlineLanguage.${this.votState}Special`, this.instructionsObject)
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts})
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, Object.assign({}, this.instructionsObject, {specialDeadline: ''}))
      } else {
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts})
      }
    },
    transmitRules () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, Object.assign({}, this.instructionsObject, {default: ''}))
      } else return this.stateRules && this.stateRules.fpcaSubmitOptionsRequest.includes('Email') ? this.$t('request.deadlineLanguage.emailSuggested') : ''
    },
    electronicTransmissionNote () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}SpecialDeadline`, {leoName: this.leoName})
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, {leoName: this.leoName})
      } else return null
    },
    transmitOpts () {
      switch (this.stateRules.fpcaSubmitOptionsRegister.length) {
        case 1:
          return this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`)
        case 2:
          return this.$t(`request.deadlineLanguage.opt2`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase()})
        case 3:
          return this.$t(`request.deadlineLanguage.opt3`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase(), item3: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`).toLowerCase()})
        case 4:
          return this.$t(`request.deadlineLanguage.opt4`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase(), item3: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`).toLowerCase(), item4: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[3].toLowerCase()}`).toLowerCase()})
        default:
          return `mail, email or fax`
      }
    },
    newVoterDeadlineLanguageObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Registration')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`) : '',
        url: process.env.url,
        state: elections[0].state,
        documentRequired: this.documentRequired && (this.state === 'AK' || this.state === 'AZ') ? this.$t(`request.deadlineLanguage.documentRequired`, {document: this.$t(`request.deadlineLanguage.${this.state.toLowerCase()}Document`)}) : ''
      }
    },
    registeredVoterDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Request')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`) : '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    unsureVoterDeadlineObject () {
      let electionsNew = this.getCurrentDeadlines.filter(x => x.ruleType === 'Registration')
      let newVoterRule = electionsNew[0].rule
      let newVoterDeadline = new Date(electionsNew[0].ruleDate)
      let newVoterMethods = electionsNew.length < 2 || electionsNew[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: electionsNew[0].submissionOptions.join('/')})
      let newVoterAltMethods = electionsNew.length < 2 || electionsNew[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${electionsNew[1].rule}`), deadline: new Date(electionsNew[1].ruleDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}), method: electionsNew[1].submissionOptions.join('/')})
      let electionsRegistered = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Request')
      let registeredVoterRule = electionsRegistered[0].rule
      let registeredVoterDeadline = new Date(electionsRegistered[0].ruleDate)
      let registeredVoterMethods = electionsRegistered.length < 2 || electionsRegistered[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: electionsRegistered[0].submissionOptions.join('/')})
      let registeredVoterAltMethods = electionsRegistered.length < 2 || electionsRegistered[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${electionsRegistered[1].rule}`), deadline: new Date(electionsRegistered[1].ruleDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}), method: electionsRegistered[1].submissionOptions.join('/')})
      return {
        newVoterRule: this.$t(`request.deadlineLanguage.${newVoterRule}`),
        newVoterDeadline: newVoterDeadline.toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        newVoterSubmissionMethod: newVoterMethods,
        newVoterAlternateSubmissionMethod: newVoterAltMethods,
        newVoterElectionDay: new Date(electionsNew[0].electionDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        newVoterElectionType: electionsNew[0].electionType,
        newVoterNote: electionsNew[0].note ? this.$t(`request.deadlineLanguage.notes.${electionsNew[0].note}`) : '',
        registeredVoterRule: this.$t(`request.deadlineLanguage.${registeredVoterRule}`),
        registeredVoterDeadline: registeredVoterDeadline.toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        registeredVoterSubmissionMethod: registeredVoterMethods,
        registeredVoterAlternateSubmissionMethod: registeredVoterAltMethods,
        registeredVoterElectionDay: new Date(electionsRegistered[0].electionDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        registeredVoterElectionType: electionsRegistered[0].electionType,
        registeredVoterNote: electionsRegistered[0].note ? this.$t(`request.deadlineLanguage.notes.${electionsRegistered[0].note}`) : '',
        url: process.env.url,
        state: electionsNew[0].state,
        documentRequired: this.documentRequired && (this.state === 'AK' || this.state === 'AZ') ? this.$t(`request.deadlineLanguage.documentRequired`, {document: this.$t(`request.deadlineLanguage.${this.state.toLowerCase()}Document`)}) : ''
      }
    },
    ballotReturnDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Return')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(this.dateFormat, {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`) : '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    deadlineLanguage () {
      if (this.getCurrentDeadlines.length === 0) {
        return `There are no elections currently scheduled for ${this.votState}.  Voters should send in an FPCA every calendar year.`
      } else {
        switch (this.isRegistered) {
          case 'notRegistered':
            return this.$t('request.deadlineLanguage.newVoters', this.newVoterDeadlineLanguageObject)
          case 'registered':
            return this.$t('request.deadlineLanguage.registeredVoters', this.registeredVoterDeadlineObject)
          default:
            return this.$t('request.deadlineLanguage.unsureRegistrationVoters', this.unsureVoterDeadlineObject).replace(/\n- /g, ' ')
        }
      }
    },
    deadlineFormSubmitted () {
      return this.$t('request.deadlineLanguage.formSubmitted', {
        alsoVoterRegistration: this.isRegistered === 'registered' ? '' : this.$t('request.deadlineLanguage.alsoVoterRegistration')
      })
    },
    deadlineFormConfirmation () {
      return this.$t('request.deadlineLanguage.formConfirmation')
    },
    deadlineReceiveBallot () {
      let daysToNextElection = Math.ceil((new Date(this.getCurrentDeadlines[0].electionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      return this.$t(`request.deadlineLanguage.${daysToNextElection > 44 ? 'sendBallot45days' : 'sendBallotLessThan45days'}`)
    },
    deadlineBallotReturn () {
      return this.$t('request.deadlineLanguage.ballotReturn', this.ballotReturnDeadlineObject)
    },
    documentRequired () {
      switch (this.state.toLowerCase()) {
        case 'ak':
          return this.$t('request.deadlineLanguage.akDocument')
        case 'az':
          return this.isRegistered === 'unsure' || this.isRegistered === 'notRegistered' ? this.$t('request.deadlineLanguage.azDocument') : null
        default:
          return null
      }
    },
    // pleaseRotate () {
    //   // return this.signStep === 'instructions'
    //   return this.$store.state.userauth.device.type === 'mobile' && this.$store.state.userauth.device.orientation === 'portrait' && this.signStep === 'instructions'
    // },
    currentRequest () { return this.requests[this.currentRequestIndex] },
    firstName () { return this.currentRequest && this.currentRequest.firstName ? this.currentRequest.firstName : ' ' },
    lastName () { return this.currentRequest && this.currentRequest.lastName ? this.currentRequest.lastName : ' ' },
    middleName () { return this.currentRequest && this.currentRequest.middleName ? this.currentRequest.middleName : ' ' },
    suffix () { return this.currentRequest && this.currentRequest.suffix ? this.currentRequest.suffix : ' ' },
    previousName () { return this.currentRequest && this.currentRequest.previousName ? this.currentRequest.previousName : ' ' },
    dob () { return this.currentRequest && this.currentRequest.dob ? this.currentRequest.dob.toString() : ' ' },
    ssn () {
      if (this.currentRequest && this.currentRequest.identification) {
        if (this.currentRequest.identification.ssn) {
          return this.currentRequest.identification.ssn.toString().replace(/[^0-9]/g, '') || ' '
        } else if (this.currentRequest.identification.ssn4 && typeof this.currentRequest.identification.ssn4 === 'string') {
          return this.currentRequest.identification.ssn4.toString().replace(/[^0-9]/g, '').slice(-4) || ' '
        } else return ' '
      }
    },
    // ssn () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.ssn ? this.currentRequest.identification.ssn.toString() : ' ' },
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
    votStreet () { return this.getCurrent.votAdr.A || '' },
    votApt () { return this.getCurrent.votAdr.B || '' },
    votCity () { return this.getCurrent.votAdr.C || '' },
    votState () { return this.getCurrent.votAdr.S || '' },
    votCounty () { return this.getCurrent.votAdr.Y || '' },
    votZip () { return this.getCurrent.votAdr.Z || '' },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : {} },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr && (this.currentRequest.fwdAdr.A || this.currentRequest.fwdAdr.alt1) ? this.currentRequest.fwdAdr : {} },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    tel () { return this.getCurrent.tel || '' },
    fax () { return this.getCurrent.fax || '' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    // addlInfo () { return this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' ' },
    addlInfo () {
      let addlInfoText = ' '
      if (this.currentRequest && (this.currentRequest.stateSpecial || (this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0))) {
        addlInfoText = this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' '
        if ((this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0)) {
          addlInfoText = `I do not have a Social Security Number${this.votState === 'OK' && this.recBallot === 'email' ? '' : ' or State issued ID number'}. ${addlInfoText}`
        }
        return addlInfoText
      } else {
        return ''
      }
    },
    date () {
      let d = new Date()
      return this.getCurrent.date || `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()}`
    },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex && this.currentRequest.sex !== 'decline' ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    isRegistered () { return this.currentRequest ? this.currentRequest.isRegistered : null },
    joinDa () { return this.currentRequest ? Boolean(this.currentRequest.joinDa) : false },
    stateRules () {
      if (this.votState) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votState.toLowerCase())
      } else {
        return undefined
      }
    },
    leoAdr () {
      let leo = this.currentRequest.leo
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${leo.s ? leo.s + ' ' : ''}${leo.z ? leo.z + '\n' : '\n'}United States of America`
    },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e ? this.currentRequest.leo.e : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n ? this.currentRequest.leo.n : ''
    },
    leoFax () {
      return this.currentRequest.leo && this.currentRequest.leo.f ? '+1 ' + this.currentRequest.leo.f : ''
    },
    leoPhone () {
      return this.currentRequest.leo && this.currentRequest.leo.p ? '+1 ' + this.currentRequest.leo.p : ''
    },
    ballotReceiptOptionsString () {
      if (!this.stateRules || this.stateRules.fpcaSubmitOptionsRequest.length === 0) {
        return ''
      } else if (this.stateRules.fpcaSubmitOptionsRequest.length === 1) {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`)
      } else if (this.stateRules.fpcaSubmitOptionsRequest.length === 2) {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`) + ' ' + this.$t('request.id.or') + ' ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[1].toLowerCase()}`)
      } else {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`) + ', ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[1].toLowerCase()}`) + ' ' + this.$t('request.id.or') + ' ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[2].toLowerCase()}`)
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests,
      canCaptureImage: state => state.userauth.device.hasWebCam,
      isIE: state => state.userauth.device.isIE
    }),
    ...mapGetters('requests', ['getCurrent', 'getCurrentDeadlines'])
  }
}
</script>

<style>
.rotated {
  transform: rotate(90deg);
}
.shrink {
  transform: scale(0.8) translate(0.2em, -0.15em);
}

.rotate-enter-active {
  transition: all 3s ease;
}
.rotate-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.rotate-enter, .rotate-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: rotate(0deg);
}
</style>
