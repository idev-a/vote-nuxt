<template>
<div class="columns is-centered is-multiline">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div class="section">
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 4})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage4')}}</h3>
        <p class="is-size-5">{{ $t('request.stages.instructions4one') }}</p>
        <p class="is-size-5" style="margin: 10px 0; font-weight: bold; color: red;">
          {{ $t('request.stages.instructions4two') }}
        </p>
      </div>
      <p v-if="'es' === $i18n.locale" class="help is-size-5 has-text-danger">{{ $t('request.stages.instructions4es') }}</p>
  </div>
  <div class="column is-12 is-10-desktop is-8-widescreen is-7-fullhd is-paddingless">
    <review-canvas class="canvas" ref="fpca">
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
        @isLoading="val => isLoading = val"></review-canvas-renderer>
        <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    </review-canvas>
  </div>
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">

        <nuxt-link
          :to="localePath({ name: 'request-stage', params: {stage: 'id-and-contact-information'} })"
          class="button is-light is-medium is-pulled-left"
          exact>
          <b-icon
            pack="fas"
            icon="caret-left">
          </b-icon>
          <span>{{$t('request.stages.back')}}</span>
        </nuxt-link>

        <button @click="record(localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} }))" :to="localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} })" class="button is-primary is-medium is-pulled-right" exact ><span>{{$t('request.stages.submit')}}</span><b-icon pack="fas" icon="caret-right"></b-icon></button>
  </div>
</div>
</template>

<script>
import ReviewCanvas from '~/components/ReviewCanvas.vue'
import ReviewCanvasRenderer from '~/components/ReviewCanvasRenderer.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FPCAreview',
  middleware: 'verify-request',
  components: {
    ReviewCanvas,
    ReviewCanvasRenderer
  },
  async asyncData ({app}) {
    return {
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll()
    }
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    record (nextPage) {
      this.$store.dispatch('requests/updateRequest', {status: 'completed: review'})
      // this.$store.dispatch('requests/recordAnalytics', {event: 'completed: review'})
      this.$router.push(nextPage)
    },
    addSig (val) {
      this.signature = val
    }
  },
  computed: {
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
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
    votStreet () { return this.getCurrent.votAdr.A },
    votApt () { return this.getCurrent.votAdr.B },
    votCity () { return this.getCurrent.votAdr.C },
    votState () { return this.getCurrent.votAdr.S },
    votCounty () { return this.getCurrent.votAdr.Y },
    votZip () { return this.getCurrent.votAdr.Z },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : {} },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr && (this.currentRequest.fwdAdr.A || this.currentRequest.fwdAdr.alt1) ? this.currentRequest.fwdAdr : {} },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    tel () { return this.getCurrent.tel || '' },
    fax () { return this.getCurrent.fax || '' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    stateRules () {
      if (this.votState) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votState.toLowerCase())
      } else {
        return undefined
      }
    },
    addlInfo () {
      let addlInfoText = ' '
      if (this.currentRequest && (this.currentRequest.stateSpecial || (this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0))) {
        addlInfoText = this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' '
        if ((this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0)) {
          addlInfoText = `I do not have a Social Security Number${this.votState === 'OK' && this.recBallot === 'email' ? '' : ' or State issued ID number'}. ${addlInfoText}`
        }
        return addlInfoText
      } else {
        return ' '
      }
    },
    date () {
      let d = new Date()
      // this.getCurrent.date ||
      return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()}`
    },
    // date () { return this.currentRequest && this.currentRequest.date ? this.currentRequest.date.toString() : ' ' },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex && this.currentRequest.sex !== 'decline' ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    }),
    ...mapGetters('requests', ['getCurrent'])
  }
}
</script>
