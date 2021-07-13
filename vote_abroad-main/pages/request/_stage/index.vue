<template>
<div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
<section class="section">
    <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: stage.order})}}</h1>
    <h3 class="has-text-centered subtitle is-4">{{ $t(`request.stages.stage${stage.order}`)}}</h3>
<!-- your information -->
  <section v-if="stage.slug === 'your-information'">
    <form @submit.prevent id="your-information" key="your-information">
      <!-- firstName -->
      <div class="field">
        <label class="label" for="firstName">{{ $t('request.firstName.label') }}<transition name="fade"><span v-if="!firstName && !$v.firstName.$error" class="required"> {{$t('request.field.req')}}</span></transition></label>
        <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.entries($v.firstName).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.firstName.messages.${x[0]}`)) : '' ">
          <b-input v-model="firstName"
            id="firstName"
            @focus="$ga.event('formAction', 'focus/select', 'firstName')"
            autocomplete="given-name"
            :maxlength="(firstName && !$v.firstName.$dirty) || $v.firstName.$error || (firstName && firstName.length > 44) ? 50 : ''"
            @input="delayTouch($v.firstName)"
            ref="firstName"></b-input>
        </b-field>
      </div>

      <!-- middleName -->
      <div class="field">
        <label class="label" for="middleName">{{ $t('request.middleName.label') }}<transition name="fade"><span v-if="!middleName" class="required"> {{$t('request.field.opt')}}</span></transition></label>
        <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => $t(`request.middleName.messages.${x}`)) : '' ">
          <b-input
            v-model="middleName"
            id="middleName"
            @focus="$ga.event('formAction', 'focus/select', 'middleName')"
            @input="delayTouch($v.middleName)"
            autocomplete="additional-name"
            :maxlength="(middleName && !$v.middleName.$dirty) || $v.middleName.$error || (middleName && middleName.length > 44) ? 50 : ''"></b-input>
        </b-field>
      </div>

      <!-- lastName -->
      <div class="field">
        <label class="label" for="lastName">{{ $t('request.lastName.label') }}<transition name="fade"><span v-if="!lastName && !$v.lastName.$error" class="required"> {{$t('request.field.req')}}</span></transition></label>
        <b-field :type="($v.lastName.$error ? 'is-danger': '')" :message="$v.lastName.$error ? Object.keys($v.lastName.$params).map(x => $t(`request.lastName.messages.${x}`)) : '' ">
          <b-input v-model="lastName"
            id="lastName"
            @input="delayTouch($v.lastName)"
            @focus="$ga.event('formAction', 'focus/select', 'lastName')"
            autocomplete="family-name"
            :maxlength="(lastName && !$v.lastName.$dirty) || $v.lastName.$error || (lastName && lastName.length > 44) ? 50 : ''"
            ref="lastName"></b-input>
        </b-field>
      </div>

      <!-- suffix -->
      <div class="field">
        <label class="label" for="suffix">{{ $t('request.suffix.label') }}<transition name="fade"><span v-if="!suffix" class="required"> {{$t('request.field.opt')}}</span></transition></label>
        <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => $t(`request.suffix.messages.${x}`)) : '' ">
          <b-input
            v-model="suffix"
            id="suffix"
            @input="delayTouch($v.suffix)"
            @focus="$ga.event('formAction', 'focus/select', 'suffix')"
            :maxlength="(suffix && !$v.suffix.$dirty) || $v.suffix.$error || (suffix && suffix.length > 8) ? 16 : ''"
            autocomplete="honorific-suffix"></b-input>
        </b-field>
      </div>

      <form-previous-name-input v-model="previousName"
        :type="($v.previousName.$error ? 'is-danger': '')"
        :message="$v.previousName.$error ? Object.keys($v.previousName.previousName.$params).map(x => x) : '' "
        :label="$t('request.previousName.label')"
        :instructions="$t('request.previousName.instructions')"
        :tooltipTitle="$t('request.previousName.tooltipTitle')"
        @input="delayTouch($v.previousName)">
        <div slot="tooltip">
          {{$t('request.previousName.tooltip')}}
        </div>
      </form-previous-name-input>

      <form-phone-input
        ref="tel"
        key="tel"
        fieldName="tel"
        :v="$v.tel"
        @delayTouch="delayTouch($v.tel)"></form-phone-input>

      <form-email-input
        ref="email"
        key="email"
        fieldName="email"
        :v="$v.email"
        @delayTouch="delayTouch($v.email)"></form-email-input>

      <form-international-address-input
        ref="abrAdr"
        key="abrAdr"
        fieldName="abrAdr"
        :v="$v.abrAdr"
        @delayTouch="(val) => addressDelayTouch('abrAdr', val)"></form-international-address-input>
        <!-- @delayTouch="(val) => delayTouch($v.abrAdr[val])" -->
    <section >
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: {stage: 'voting-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

    </form>
  </section>

<!-- voting information -->
  <section v-if="stage.slug === 'voting-information'">
    <form id="voting-information" key="voting-information">

      <form-voting-address-input
        :label="$t('request.votAdr.label')"
        :validations=$v.votAdr
        ref="votAdr"
        @delayTouch="(val) => addressDelayTouch('votAdr', val)"
        :toolTipTitle="$t('request.votAdr.tooltipTitle')">
        <!-- @input="delayTouch($v.votAdr)" -->
        <div slot="instructions">
          <p v-html="md($t('request.votAdr.instructions'))"></p>
        </div>
        <div slot="tooltip">
          <p v-html="md($t('request.votAdr.tooltip'))"></p>
        </div>
      </form-voting-address-input>

      <form-jurisdiction-input v-if="votAdr && votAdr.S"
        :label="$t('request.jurisdiction.label')"
        :toolTipTitle="$t('request.jurisdiction.tooltipTitle')"
        :placeholder="$t('request.jurisdiction.placeholder')"
        :key="votAdr.S"
        ref="jurisdiction"

        @input="delayTouch($v.jurisdiction)"
        :validations="($v.jurisdiction)"
        :state="this.votAdr.S">
        <div slot="instructions">
          <p>{{$t('request.jurisdiction.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <p v-html="md($t('request.jurisdiction.tooltip'))"></p>
        </div>
      </form-jurisdiction-input>

    <form-voter-class-radio-button v-model="voterClass"
      :allowsNeverResided="stateRules ? stateRules.allowsNeverResided : false"
      :validations="($v.voterClass)"
      ref="voterClass"
      :state="votAdr && votAdr.S ? this.votAdr.S : null"
      @delayTouch="delayTouch($v.voterClass)"
      :toolTipTitle="$t('request.voterClass.tooltipTitle')">
      <div slot="tooltip">
        <p v-html="md($t('request.voterClass.tooltip'))"></p>
      </div>
    </form-voter-class-radio-button>

      <!-- @input="delayTouch($v.voterClass)" -->

      <!-- isRegistered -->
    <form-is-voter-registered-radio-button
      v-if="votAdr && jurisdiction && jurisdiction.j && jurisdiction.t"
      :label="$t('request.isRegistered.label', {jurisdiction: jurisdiction.t === 'All' ? jurisdiction.s : `${jurisdiction.j} ${jurisdiction.j.includes(jurisdiction.t) ? '' : jurisdiction.t}`})"
      :validations="($v.isRegistered)"
      @input="delayTouch($v.isRegistered)"
      ref="isRegistered"
      v-model="isRegistered">
    </form-is-voter-registered-radio-button>

    <!-- recBallot -->
    <form-receive-ballot-radio-button v-model="recBallot"
      v-if="votAdr && votAdr.S"
      :label="$t('request.receiveBallot.label')"
      :validations="$v.recBallot"
      @input="delayTouch($v.recBallot)"
      ref="recBallot"
      :ballotReceiptOptions="stateRules ? stateRules.ballotReceiptOptions : ['Mail']"
      :toolTipTitle="$t('request.receiveBallot.tooltipTitle')">
      <div slot="tooltip">
        <p v-html="md($t('request.receiveBallot.tooltip'))"></p>
      </div>
    </form-receive-ballot-radio-button>

    <form-phone-input
      v-if="recBallot === 'fax' || fax"
      ref="fax"
      key="fax"
      fieldName="fax"
      :v="$v.fax"
      @delayTouch="delayTouch($v.fax)"></form-phone-input>

    <!-- altEmail -->
    <form-email-input v-if="recBallot === 'email' && (email === null || skippedEmail || $v.email.$error)"
      ref="email"
      key="email"
      @input="skippedEmail = true"
      fieldName="email"
      :v="$v.email"
      @delayTouch="delayTouch($v.email)"></form-email-input>

    <form-email-input v-if="recBallot === 'email' || altEmail"
      ref="altEmail"
      key="altEmail"
      fieldName="altEmail"
      :v="$v.altEmail"
      @delayTouch="delayTouch($v.altEmail)"></form-email-input>

      <!-- fwdAdr -->
      <form-international-address-input
        v-if="recBallot === 'mail' || (fwdAdr && (fwdAdr.alt1 || fwdAdr.A))"
        ref="fwdAdr"
        key="fwdAdr"
        fieldName="fwdAdr"
        :v="$v.fwdAdr"
        @delayTouch="(val) => delayTouch($v.fwdAdr[val])"></form-international-address-input>

    <vfa-scroll-up :key="$route.params.stage"></vfa-scroll-up>

    <section >
        <nuxt-link ref="next1" :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button ref="next3" @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

  </form>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
    <form id="id-and-contact-information" key="id-and-contact-information">
<!-- identity and Contact information -->
      <!-- dob -->

      <form-date-of-birth-input v-model="dob"
        :tooltipTitle="$t('request.dob.tooltipTitle')"
        @input="delayTouch($v.dob)"
        ref="dob"
        :v="$v.dob">
        <div slot="tooltip">
          <p v-html="md($t('request.dob.tooltip'))"></p>
        </div>
      </form-date-of-birth-input>

      <!-- gender -->
      <form-gender-radio-button
        :label="$t('request.sex.label')"
        ref="sex"
        :state="votAdr.S"
        :tooltipTitle="$t('request.sex.tooltipTitle')"
        v-model="sex"
        :validations="$v.sex">
        <div slot="tooltip">
          <p v-html="md($t('request.sex.tooltip'))"></p>
        </div>
      </form-gender-radio-button>

      <!-- party -->
      <form-party-input
        :label="$t('request.party.label')"
        v-model="party"
        :join="joinDa"
        :state="votAdr.S"
        :tooltipTitle="$t('request.party.tooltipTitle')"
        :joinTooltipTitle="$t('request.joinDa.tooltipTitle')"
        :joinLabel="$t('request.joinDa.label')"
        :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' "
        :type="($v.party.$error ? 'is-danger': '')">

        <!-- @joinDA="val => joinDa = val" -->
        <div slot="tooltip">
          <p v-html="md($t('request.party.tooltip'))"></p>
        </div>
        <div slot="joinTooltip">
          <p v-html="md($t('request.joinDa.tooltip'))"></p>
        </div>
      </form-party-input>

      <!-- Opt in to voter reminder (email) service -->
      <form-checkbox-input
        ref="optInVoterReminder"
        v-model="optInVoterReminder"
        :message="$t('request.misc.reminderEmails')"
        style="margin: 10px 0;"
      />

      <form-email-input v-if="!!joinDa && (email === null || skippedEmail || $v.email.$error)"
        ref="email"
        key="email"
        @input="skippedEmail = true"
        fieldName="email"
        :v="$v.email"
        @delayTouch="delayTouch($v.email)"></form-email-input>

      <form-state-special-input
        :label="$t('request.stateSpecial.label', {state: stateRules && stateRules.title ? stateRules.title : $t('request.stateSpecial.state')})"
        v-model="stateSpecial"
        :state="votAdr && votAdr.S ? votAdr.S : ''"
        :isIndNoParty="party && (party.toLowerCase() === 'republican' || party.toLowerCase() === 'rep' || party.toLowerCase() === 'democratic' || party.toLowerCase() === 'dem') ? false : true"
        :isReturnUncertain="Boolean(voterClass === 'uncertainReturn')"
        :isRegistering="Boolean(isRegistered === 'notRegistered' || isRegistered === 'unsure')">
      </form-state-special-input>

      <!-- identification -->

      <form-identification-input
        v-if="stateRules"
        :label="$t('request.id.label')"
        :idOptions="idOptions"
        :validations="($v.identification)"
        ref="id"
        @input="delayTouch($v.identification)"
        :tooltipTitle="$t('request.id.tooltipTitle')"
        v-model="identification">
        <div slot="instructions">
          <p v-if="!idOptions || idOptions.length === 0"
            v-html="md($t('request.id.instructionsOptional', { state: stateRules.title}))">
          </p>
          <p v-else-if="idOptions.length === 1"
            v-html="md($t('request.id.instructionsReq1', { state: stateRules.title, id: $t(`request.id.${idOptions[0]}`), idType: $t(`request.id.${idOptions[0].includes('SSN') ? 'SSN' : idOptions[0]}`)}))">
          </p>
          <p v-else v-html="md($t('request.id.instructionsReq2', { state: stateRules.title, allButLastTypes: allButLastIdType, lastType: lastIdType }))">
          </p>
        </div>
        <div slot="tooltip">
          <p
            v-if="votAdr && votAdr.S === 'OK' && recBallot === 'email'"
            v-html="md($t('request.id.tooltipOkEmail'))"></p>
          <p
            v-else-if="stateRules && stateRules.id && stateRules.id.length === 0"
            v-html="md($t('request.id.tooltipOptional', { state: stateRules.title}))">
          </p>
          <p
            v-else-if="stateRules && stateRules.id && stateRules.id.length === 1"
            v-html="md($t('request.id.tooltipReq1', { state: stateRules.title, id: $t(`request.id.${stateRules.id[0]}`)}))">
          </p>
          <p
            v-else
            v-html="md($t('request.id.tooltipReq2', { state: stateRules.title, allButLastTypes: allButLastIdType, lastType: lastIdType }))">
          </p>
        </div>
      </form-identification-input>

      <vfa-scroll-up :key="$route.params.stage"></vfa-scroll-up>
    <section >
      <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
      <a @click="focusFirstErrorOrAdvance(localePath({ name: 'request-review' }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></a>
    </section>
  </form>
  </section>
</section>

  <b-modal
    :active="!optedIn && isPrivacyOptInModalActive"
    :canCancel="false"
    has-modal-card>
    <vfa-opt-in
      @optIn="optIn"
      :privacyPage="localePath({ name: 'page', params: {page: 'privacy'}})"
      :cookiePage="localePath({ name: 'page', params: {page: 'cookie-policy'}})"
      :tosPage="localePath({ name: 'page', params: {page: 'terms-of-use'}})"></vfa-opt-in>
  </b-modal>
</div>
</template>

<script>
import { required, requiredIf, maxLength, helpers, email } from 'vuelidate/lib/validators'
import FormPreviousNameInput from '~/components/FormPreviousNameInput'
import FormPhoneInput from '~/components/FormPhoneInput'
import FormEmailInput from '~/components/FormEmailInput'
import FormInternationalAddressInput from '~/components/FormInternationalAddressInput'
import FormVotingAddressInput from '~/components/FormVotingAddressInput'
import FormJurisdictionInput from '~/components/FormJurisdictionInput'
import FormVoterClassRadioButton from '~/components/FormVoterClassRadioButton'
import FormIsVoterRegisteredRadioButton from '~/components/FormIsVoterRegisteredRadioButton'
import FormReceiveBallotRadioButton from '~/components/FormReceiveBallotRadioButton'
import FormDateOfBirthInput from '~/components/FormDateOfBirthInput'
import FormGenderRadioButton from '~/components/FormGenderRadioButton'
import FormPartyInput from '~/components/FormPartyInput'
import FormStateSpecialInput from '~/components/FormStateSpecialInput'
import FormIdentificationInput from '~/components/FormIdentificationInput'
import FormCheckboxInput from '~/components/FormCheckboxInput'
import VfaScrollUp from '~/components/VfaScrollUp'
import VfaOptIn from '~/components/VfaOptIn'
import snarkdown from 'snarkdown'
import { mapGetters, mapState, mapMutations } from 'vuex'

const optionalEmail = (value) => !helpers.req(value) || email(value)
// const usZip = helpers.regex('usZip', /^(\d{5})(?:[ -](\d{4}))?$/)
const usZip = (state) =>
  helpers.withParams(
    { type: 'usZip', value: state },
    function (value, model) {
      const genericZipRegex = /^(\d{5})(?:[ -](\d{4}))?$/
      if (!state || !this.postal.US) {
        return genericZipRegex.test(value)
      } else {
        let stateZipRegex = new RegExp(this.postal.US['sub_zips'].split('~')[this.postal.US['sub_keys'].split('~').findIndex(x => x === model.S)])
        // console.log(value, model.S, stateZipRegex, genericZipRegex.test(value), stateZipRegex.test(value))
        return genericZipRegex.test(value) && stateZipRegex.test(value)
      }
    }
  )
// const tooOld = (minAge) =>
//   helpers.withParams(
//     { type: 'tooOld', value: minAge },
//     (value) => !helpers.req(value) || minAge < new Date(value)
//   )
// const tooYoung = (nextElectionDate) =>
//   helpers.withParams(
//     { type: 'tooYoung', value: new Date(nextElectionDate.getFullYear(), nextElectionDate.getMonth(), nextElectionDate.getDate()) },
//     (value) => !helpers.req(value) || new Date(nextElectionDate.getFullYear() - 18, nextElectionDate.getMonth(), nextElectionDate.getDate()) >= new Date(value.substr(0, 4), parseInt(value.substr(5, 2)) - 1, value.substr(8, 2))
//   )
// const fullLengthSsn = (idOpts) =>
//   helpers.withParams(
//     { type: 'correctLength', value: 9 },
//     (value, m) => {
//       return !helpers.req(value) || value.replace(/\D/g, '').length === 9
//     }
//   )
const addressPartRequired = (addressPart, addressType) =>
  helpers.withParams(
    { type: 'addressPartRequired', value: addressPart },
    function (value, model) {
      if (addressType === 'fwdAdr' && (!model || !model.A)) return true
      if (!model.countryiso) return true
      let regexp = new RegExp(addressPart)
      if (this.postal[model.countryiso]) return value || !regexp.test(this.postal[model.countryiso].require)
      else {
        return true
      }
    }
  )
const touchMap = new WeakMap()

export default {
  transition: 'test',
  scrollToTop: true,
  // head () {
  //   return {
  //     script: [
  //       {src: 'http://10.0.1.12:8098'}
  //     ]
  //   }
  // },
  middleware: 'verify-request',
  async asyncData ({app}) {
    return {
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll()
    }
  },
  // watchQuery: ['query'],
  // async fetch ({ app, store, query }) {
  //   if (query.state === 'ca') {
  //     let state = await app.$content('/leos').get(query.state)
  //     // console.log(state.body)
  //   }
  // },
  fetch ({store}) {
    store.dispatch('data/updateCountryData', 'US')
  },
  data () {
    return {
      skippedEmail: false,
      optedIn: true
    }
  },
  components: {
    FormPreviousNameInput,
    FormEmailInput,
    FormPhoneInput,
    FormInternationalAddressInput,
    FormVotingAddressInput,
    FormJurisdictionInput,
    FormVoterClassRadioButton,
    FormIsVoterRegisteredRadioButton,
    FormReceiveBallotRadioButton,
    FormDateOfBirthInput,
    FormGenderRadioButton,
    FormPartyInput,
    FormStateSpecialInput,
    FormIdentificationInput,
    VfaScrollUp,
    FormCheckboxInput,
    VfaOptIn
  },
  computed: {
    idOptions () {
      let opts = this.stateRules && this.stateRules.id && this.stateRules.id.length > 0 ? this.stateRules.id : []
      if (this.votAdr && this.votAdr.S === 'OK' && this.recBallot === 'email') {
        return ['SSN4']
      } else return opts
    },
    stateRules () {
      if (this.votAdr && this.votAdr.S) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votAdr.S.toLowerCase())
      } else {
        return undefined
      }
    },
    allButLastIdType () {
      if (!this.idOptions || this.idOptions.length === 0) return ''
      return this.idOptions.length > 2
        ? this.idOptions.slice(0, this.idOptions.length - 1).map(x => this.$t(`request.id.${x}`)).join(', ')
        : this.$t(`request.id.${this.idOptions[0]}`)
    },
    lastIdType () {
      return this.idOptions.length > 0 ? this.$t(`request.id.${this.idOptions.slice(-1)[0]}`) : ''
    },
    stage () {
      switch (this.$route.params.stage) {
        case 'your-information':
          return {order: 1, name: 'Your Information', slug: this.$route.params.stage}
        case 'voting-information':
          return {order: 2, name: 'Voting Information', slug: this.$route.params.stage}
        case 'id-and-contact-information':
          return {order: 3, name: 'ID & Contact Information', slug: this.$route.params.stage}
        default:
          return {order: 4, name: 'unknown stage', slug: this.$route.params.stage}
      }
    },
    user: function () {
      return this.$store.state.userauth.user
    },
    email: {
      get () { return this.getCurrent.email || null },
      set (value) { this.update({email: value || null}) }
    },
    firstName: {
      get () { return this.getCurrent.firstName || null },
      set (value) { this.update({ firstName: value }) }
    },
    middleName: {
      get () { return this.getCurrent.middleName || null },
      set (value) { this.update({ middleName: value }) }
    },
    lastName: {
      get () { return this.getCurrent.lastName || null },
      set (value) { this.update({ lastName: value }) }
    },
    previousName: {
      get () { return this.getCurrent.previousName || null },
      set (value) { this.update({ previousName: value }) }
    },
    suffix: {
      get () { return this.getCurrent.suffix || null },
      set (value) { this.update({ suffix: value }) }
    },
    dob: {
      get () { return this.getCurrent.dob || null },
      set (val) { this.update({ dob: val }) }
    },
    tel: {
      get () { return this.getCurrent.tel || '' },
      set (value) { this.update({ tel: value }) }
    },
    votAdr: {
      get () { return this.getCurrent.votAdr || null },
      set (value) { this.update({votAdr: value}) }
    },
    jurisdiction () { return this.getCurrent.leo || null },
    abrAdr: {
      get () {
        if ((!this.getCurrent.abrAdr) && this.user && this.user.country) {
          return {countryiso: this.user.country}
        } else return this.getCurrent.abrAdr || null
      },
      set (value) { this.update({abrAdr: value}) }
    },
    voterClass: {
      get () { return this.getCurrent.voterClass || null },
      set (value) { this.update({voterClass: value}) }
    },
    identification: {
      get () { return this.getCurrent.identification || {noId: false, ssn: null, ssn4: null, stateId: null} },
      set (value) { this.update({identification: value}) }
    },
    ssn: {
      get () { return this.getCurrent.ssn || null },
      set (value) { this.update({ssn: value}) }
    },
    sex: {
      get () { return this.getCurrent.sex || null },
      set (value) { this.update({sex: value}) }
    },
    party: {
      get () { return this.getCurrent.party || null },
      set (value) { this.update({party: value}) }
    },
    fax: {
      get () { return this.getCurrent.fax || null },
      set (value) { this.update({fax: value}) }
    },
    altEmail: {
      get () { return this.getCurrent.altEmail || null },
      set (value) { this.update({altEmail: value}) }
    },
    isRegistered: {
      get () { return this.getCurrent.isRegistered || null },
      set (value) { this.update({isRegistered: value}) }
    },
    recBallot: {
      get () { return this.getCurrent.recBallot || null },
      set (value) { this.update({recBallot: value}) }
    },
    stateId: {
      get () { return this.getCurrent.stateId || null },
      set (value) { this.update({stateId: value}) }
    },
    fwdAdr: {
      get () { return this.getCurrent.fwdAdr || null },
      set (value) { this.update({fwdAdr: value}) }
    },
    addlInfo: {
      get () { return this.getCurrent.addlInfo || null },
      set (value) { this.update({addlInfo: value}) }
    },
    stateSpecial: {
      get () { return this.getCurrent.stateSpecial || null },
      set (value) { this.update({stateSpecial: value}) }
    },
    joinDa: {
      get () { return this.getCurrent.joinDa || null },
      set (value) { this.update({joinDa: value}) }
    },
    optInVoterReminder: {
      get () { return this.getCurrent.optInVoterReminder || false },
      set (value) {
        this.update({optInVoterReminder: value})
      }
    },
    ...mapGetters('data', ['isValidNumber']),
    ...mapGetters('requests', ['getCurrent']),
    ...mapState('data', ['postal']),
    ...mapState(['isPrivacyOptInModalActive'])
  },
  methods: {
    optIn () {
      this.$cookie.set('vfaOptIn', true, 1)
      this.optedIn = true
      this.togglePrivacyModalActiveState(false)
    },
    md (md) {
      return snarkdown(md)
    },
    focusFirstErrorOrAdvance (nextPage) {
      switch (this.$route.params.stage) {
        case 'your-information':
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.email.$touch()
          this.$v.tel.$touch()
          this.$v.abrAdr.$touch()
          this.$v.abrAdr.A.$touch()
          break
        case 'voting-information':
          this.$v.votAdr.$touch()
          this.$v.votAdr.A.$touch()
          this.$v.votAdr.C.$touch()
          this.$v.votAdr.Z.$touch()
          this.$v.jurisdiction.$touch()
          this.$v.voterClass.$touch()
          this.$v.isRegistered.$touch()
          this.$v.recBallot.$touch()
          this.$v.fax.$touch()
          this.$v.altEmail.$touch()
          this.$v.fwdAdr.$touch()
          this.$v.fwdAdr.A.$touch()
          this.$v.email.$touch()
          this.skippedEmail = false
          break
        case 'id-and-contact-information':
          this.$v.sex.$touch()
          this.$v.dob.$touch()
          this.$v.email.$touch()
          this.$v.identification.$touch()
          break
      }
      // console.log(JSON.stringify(this.$v.fax, null, 2))

      switch (true) {
        case this.stage.slug === 'your-information' && this.$v.firstName.$error:
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'firstName' } })
          this.$refs.firstName.$el.scrollIntoView()
          // console.log(this.$refs.firstName)
          this.$ga.event('formAction', 'fieldError', 'firstName')
          this.$refs.firstName.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.lastName.$error:
          this.$refs.lastName.$el.scrollIntoView()
          this.$refs.lastName.focus()
          this.$ga.event('formAction', 'fieldError', 'lastName')
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'lastName' } })
          break
        case this.stage.slug === 'your-information' && this.$v.email.$error:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          this.$refs.email.$el.scrollIntoView()
          this.$refs.email.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'email')
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.A && this.$v.abrAdr.A.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$el.scrollIntoView()
          this.$refs.abrAdr.$refs.A[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.A')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.A'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.D && this.$v.abrAdr.D.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.D[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.D[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.D')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.D'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.C && this.$v.abrAdr.C.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.C'}})
          this.$refs.abrAdr.$refs.C[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.C[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.C')
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.S && this.$v.abrAdr.S.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.S[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.S[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.S')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.S'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.X && this.$v.abrAdr.X.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.X'}})
          this.$refs.abrAdr.$refs.X[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.X[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.X')
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.Z && this.$v.abrAdr.Z.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.Z'}})
          this.$refs.abrAdr.$refs.Z[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.Z[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.Z')
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.alt1 && this.$v.abrAdr.alt1.$error && this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.Z'}})
          this.$refs.abrAdr.$refs.alt1[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.alt1[0].focus()
          this.$ga.event('formAction', 'fieldError', 'abrAdr.alt1')
          break
        case this.stage.slug === 'your-information' && this.$v.tel.$error:
          this.$refs.tel.$el.scrollIntoView()
          this.$refs.tel.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'tel')
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'tel' } })
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.A.$error:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.A'}})
          this.$refs.votAdr.$el.scrollIntoView()
          this.$refs.votAdr.$refs.A.focus()
          this.$ga.event('formAction', 'fieldError', 'votAdr.A')
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.C.$error:
          this.$refs.votAdr.$el.scrollIntoView()
          this.$refs.votAdr.$refs.C.focus()
          this.$ga.event('formAction', 'fieldError', 'votAdr.C')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.C'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.S.$error:
          this.$refs.votAdr.$refs.S.$el.scrollIntoView()
          this.$refs.votAdr.$refs.S.focus()
          this.$ga.event('formAction', 'fieldError', 'votAdr.S')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.S'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.Z.$error:
          this.$refs.votAdr.$refs.Z.$el.scrollIntoView()
          this.$refs.votAdr.$refs.Z.focus()
          this.$ga.event('formAction', 'fieldError', 'votAdr.Z')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.Z'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.jurisdiction.$error:
          this.$refs.jurisdiction.$refs.jurisdiction.$el.scrollIntoView()
          this.$refs.jurisdiction.$refs.jurisdiction.focus()
          this.$ga.event('formAction', 'fieldError', 'jurisdiction')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'jurisdiction'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.fax.$error:
          this.$refs.fax.$el.scrollIntoView()
          this.$refs.fax.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'fax')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'fax'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.voterClass.$error:
          this.$refs.voterClass.$el.scrollIntoView()
          this.$ga.event('formAction', 'fieldError', 'voterClass')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'voterClass'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.isRegistered.$error:
          this.$refs.isRegistered.$el.scrollIntoView()
          this.$ga.event('formAction', 'fieldError', 'isRegistered')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'isRegistered'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.recBallot.$error:
          this.$refs.recBallot.$el.scrollIntoView()
          this.$ga.event('formAction', 'fieldError', 'recBallot')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'recBallot'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.email.$error && this.recBallot === 'email':
          this.$refs.email.$el.scrollIntoView()
          this.$refs.email.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'email')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.altEmail.$error && !!this.$refs.altEmail:
          this.$refs.altEmail.$el.scrollIntoView()
          this.$refs.altEmail.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'altEmail')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'altEmail'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.fwdAdr.$anyError && !!this.$refs.fwdAdr:
          // console.log('fwdAdr error')
          this.$refs.fwdAdr.$el.scrollIntoView()
          this.$refs.fwdAdr.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'fwdAdr')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'fwdAdr  '}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.dob.$error:
          // console.log(this.dob, this.$v.dob, this.$refs.dob.$el)
          this.$refs.dob.$el.scrollIntoView()
          this.$refs.dob.$el.querySelector('input').focus()
          this.$ga.event('formAction', 'fieldError', 'dob')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'dob'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.email.$error:
          this.$refs.email.$el.scrollIntoView()
          this.$refs.email.$el.querySelector('input').focus()
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.sex.$error:
          this.$refs.sex.$el.scrollIntoView()
          this.$ga.event('formAction', 'fieldError', 'sex')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'sex'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.ssn.$error:
          if (this.$refs.id.$refs.ssn) this.$refs.id.$refs.ssn.focus()
          this.$ga.event('formAction', 'fieldError', 'identification')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.ssn'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.ssn4.$error:
          if (this.$refs.id.$refs.ssn4) this.$refs.id.$refs.ssn4.focus()
          this.$ga.event('formAction', 'fieldError', 'identification')
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.ssn'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.stateId.$error:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.stateId'}})
          this.$refs.id.$refs.StateId.focus()
          this.$ga.event('formAction', 'fieldError', 'identification')
          break
        default:
          this.$router.push(nextPage)
          // this.$store.dispatch('requests/recordAnalytics', {event: 'completed: ' + this.stage.slug})
          // this.$store.dispatch('requests/updateRequest', {status: 'completed: ' + this.stage.slug})
      }
    },
    addressDelayTouch (type, val) {
      // console.log('type', type, 'val', val)
      if (val === 'countryiso' || (this[type].countryiso && !this.postal[this[type].countryiso])) {
        this.$store.dispatch('data/updateCountryData', this[type].countryiso)
          .then(() => {
            this.$nextTick()
              .then(() => this.delayTouch(this.$v[type][val]))
          })
      } else this.delayTouch(this.$v[type][val])
    },
    delayTouch ($v) {
      if ($v && '$reset' in $v && '$touch' in $v) {
        $v.$reset()
        if (touchMap.has($v)) {
          clearTimeout(touchMap.get($v))
        }
        touchMap.set($v, setTimeout($v.$touch, 1000))
      }
    },
    ...mapMutations('requests', ['update']),
    ...mapMutations(['togglePrivacyModalActiveState'])
  },
  mounted () {
    if (!this.$cookie.get('vfaOptIn')) {
      this.optedIn = false
      this.togglePrivacyModalActiveState(true)
    } else {
      this.optedIn = true
      this.togglePrivacyModalActiveState(false)
    }
  },
  validations () {
    return {
      email: {
        required: requiredIf(function (model) { return model.recBallot === 'email' || !!model.joinDa }),
        email: optionalEmail
      },
      firstName: {
        required,
        maxLength: maxLength(50)
      },
      middleName: {
        maxLength: maxLength(50)
      },
      lastName: {
        required,
        maxLength: maxLength(50)
      },
      previousName: {
        previousName: {
          maxLength: maxLength(50)
        }
      },
      suffix: {
        maxLength: maxLength(16)
      },
      abrAdr: {
        country: { },
        A: {
          required: addressPartRequired('A'),
          maxLength: maxLength(40)
        },
        B: { required: addressPartRequired('B') },
        D: { required: addressPartRequired('D') },
        C: { required: addressPartRequired('C') },
        S: { required: addressPartRequired('S') },
        X: { required: addressPartRequired('X') },
        Z: { required: addressPartRequired('Z') },
        countryiso: { required },
        alt1: { required: requiredIf('usesAlternateFormat') },
        alt2: {},
        alt3: {},
        alt4: {},
        alt5: {},
        usesAlternateFormat: {}
      },
      voterClass: {
        required
      },
      votAdr: {
        A: {
          required,
          maxLength: maxLength(40)
        },
        C: { required },
        S: { required },
        Y: {},
        Z: {
          required,
          usZip: usZip(this.votAdr ? this.votAdr.S : null)
        }
      },
      jurisdiction: { required },
      recBallot: {
        required
      },
      dob: {
        required
        // tooOld: tooOld(new Date(1900, 0, 1)),
        // tooYoung: tooYoung(new Date(2018, 10, 6))
      },
      fax: {
        required: requiredIf(function (model) { return model.recBallot === 'fax' }),
        validPhone () { return this.fax ? this.isValidNumber(this.fax) : true }
      },
      tel: {
        validPhone () {
          return this.tel
            ? /^\+\d\d?\d?/.test(this.tel) ? this.isValidNumber(this.tel) : false
            : true
        }
      },
      altEmail: {
        email
      },
      party: {
      },
      sex: {
        required: requiredIf((model) => {
          return model.votAdr && model.votAdr.S && model.votAdr.S.toLowerCase() === 'id'
        })
      },
      isRegistered: {
        required
      },
      identification: {
        ssn: {
          required: requiredIf(function (model) {
            return this.idOptions.includes('SSN') && !model.stateId && !model.ssn4 && !model.noId
          }),
          correctLength: (value) => !helpers.req(value) || value.replace(/[^\d]/gi, '').length === 9
        },
        ssn4: {
          required: requiredIf(function (model) {
            return !model.stateId && !model.ssn && !model.noId && this.idOptions.includes('SSN4')
          }),
          correctLength: (value) => !helpers.req(value) || value.replace(/[^\d]/gi, '').length === 4
        },
        stateId: {
          required: requiredIf(function (model) {
            return !model.ssn4 && !model.ssn && !model.noId && this.idOptions.filter(x => !/SSN/.test(x)).length > 0
          })
        }
      },
      fwdAdr: {
        country: { },
        A: {
          required: addressPartRequired('A', 'fwdAdr'),
          maxLength: maxLength(40)
        },
        B: { required: addressPartRequired('B', 'fwdAdr') },
        D: { required: addressPartRequired('D', 'fwdAdr') },
        C: { required: addressPartRequired('C', 'fwdAdr') },
        S: { required: addressPartRequired('S', 'fwdAdr') },
        X: { required: addressPartRequired('X', 'fwdAdr') },
        Z: { required: addressPartRequired('Z', 'fwdAdr') },
        countryiso: {},
        alt1: {},
        alt2: {},
        alt3: {},
        alt4: {},
        alt5: {},
        usesAlternateFormat: {}
      },
      addlInfo: {
      }
    }
  }
}
</script>
<style>
label.label {
  position: relative;
  width: 100%;
}
label.label > span.required {
    position: absolute;
    right: .5rem;
    color: #9c9a9a;
    font-size: 0.75rem;
    font-weight: 300;
    top: 2.5rem;
    z-index: 4;
}
</style>
