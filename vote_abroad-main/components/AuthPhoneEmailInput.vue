<template>
  <div class="field">
    <vfa-basic-label :fieldName="fieldName" @toggleInfo="toggleInfo"></vfa-basic-label>
    <b-field
      :type="fieldType"
      :message="fieldMessages">
      <transition-group name="slide" tag="div" @after-enter="selectField" class="field has-addons">
        <p class="control" key="flag" v-if="!countryFocused">
          <button :class="['button', 'control', 'is-outlined', 'is-inverted', {'is-paddingless': !mustBeEmail}]"
            :style="mustBeEmail ? '' : 'padding-left:0px;'"
            :disabled="loading"
            @click.prevent="setCountryFocused">
            <b-icon
              v-if="mustBeEmail"
              pack="fas"
              icon="at">
            </b-icon>
            <span class="flag-container fa-stack" v-else>
              <i :class="`fa-stack-2x flag-icon flag-icon-${countryIso ? countryIso.toLowerCase() : 'un'}`"></i>
              <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(50%)"></i>
            </span>
          </button>
        </p>
        <vfa-country-selector
          key="country"
          ref="country"
          @newCountry="newCountry"
          @blur="countryFocused = false"
          v-model="countryIso"
          :countryFocused="countryFocused"
          v-if="countryFocused"
          phone></vfa-country-selector>

          <!-- :class="countryFocused ? 'wide' : 'shrink'" -->

          <!-- v-if="tempValue && tempValue.length > 1" -->
        <b-input
          v-if="deviceOs === 'android'"
          key="dumbInput"
          :type="fieldType"
          v-model="tempValue"
          :id="fieldName"
          :placeholder="$t(`request.phoneOrEmail.placeholder`, {first: deviceType === 'desktop' ? 'yours@example.com' : exPhone, second: deviceType === 'desktop' ? exPhone : 'yours@example.com'})"
          :class="[requiredClass, 'is-expanded']"
          :autocomplete="autoComplete"
          @input="$emit('delayTouch')"
          @blur="formatNumber"
          @keyup.native.enter="pressEnter"
          :loading="loading"
          :ref="fieldName"></b-input>
        <b-input
          v-else
          key="input"
          :type="fieldType"
          :value="tempValue"
          :id="fieldName"
          :placeholder="$t(`request.phoneOrEmail.placeholder`, {first: deviceType === 'desktop' ? 'yours@example.com' : exPhone, second: deviceType === 'desktop' ? exPhone : 'yours@example.com'})"
          :class="[requiredClass, 'is-expanded']"
          :autocomplete="autoComplete"
          @input="$emit('delayTouch')"
          @keyup.native.enter="$emit('pressEnter')"
          v-format="formatFunctions"
          :loading="loading"
          :ref="fieldName"></b-input>
          <!-- :maxlength="maxLength" -->
      </transition-group>
    </b-field>
    <b-message v-if="toolTipContent" type="is-info" has-icon :active.sync="isInfoOpen">
      <p v-html="toolTipContent"></p>
    </b-message>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
// import fieldMixin from '~/mixins/fieldMixin.js'
import snarkdown from 'snarkdown'
import VfaBasicLabel from '~/components/VfaBasicLabel'
import VfaCountrySelector from '~/components/VfaCountrySelector'
const { onChange, onCut, onPaste, onKeyDown } = require('input-format/commonjs/input control')

export default {
  name: 'PhoneOrEmail',
  // mixins: [fieldMixin],
  props: ['loading', 'fieldName', 'v'],
  components: {
    VfaCountrySelector,
    VfaBasicLabel
  },
  data () {
    return {
      countryIso: '',
      countryFocused: false,
      tempValue: '',
      fieldValue: '',
      isInfoOpen: false
    }
  },
  computed: {
    fieldType () {
      return this.v && this.v.$error ? 'is-danger' : ''
    },
    fieldMessages () { return this.v && this.v.$error ? Object.entries(this.v).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => this.$t(`request.${this.fieldName}.messages.${x[0]}`)) : '' },
    toolTipTitle () { return this.$te(`request.${this.fieldName}.tooltipTitle`) ? this.$t(`request.${this.fieldName}.tooltipTitle`) : null },
    toolTipContent () { return this.$te(`request.${this.fieldName}.tooltip`) ? snarkdown(this.$t(`request.${this.fieldName}.tooltip`)) : null },
    requiredClass: function () {
      return {
        'hide': Boolean(this.fieldValue || (this.v && this.v.$error)),
        'is-required': this.v && this.v.required !== undefined,
        'is-optional': this.v && this.v.required === undefined
      }
    },
    autoComplete () {
      return this.mustBeEmail || this.deviceType === 'desktop' ? 'home email' : 'mobile tel'
    },
    deviceType () { return this.$store.state.userauth.device.type },
    deviceOs () { return this.$store.state.userauth.device.os },
    exPhone () { return this.countries.find(country => country.code === this.countryIso) ? this.countries.find(country => country.code === this.countryIso).exPhone : '+1 201 555 0123' },
    mustBeEmail () {
      return Boolean(this.fieldValue &&
        /[A-Za-z@]/g.test(this.fieldValue) &&
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@?((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.?)+([a-zA-Z]{2,})?)?)$/.test(this.fieldValue))
    },
    formatFunctions () {
      let format = (parsedText) => {
        // console.log('parsedText:', parsedText)
        if (!parsedText) {
          // console.log('no parsed text')
          this.tempValue = ''
          this.fieldValue = null
          return {text: ' ', template: 'X'}
        } else if (/^\+\d\d?\d?/.test(parsedText) && !this.phoneMetadataHasAllCountriesForPrefix(parsedText)) {
          // console.log('country code check')
          this.fieldValue = parsedText
          this.tempValue = parsedText
          this.getCountryIsoFromPhonePrefix(parsedText)
          return {text: parsedText, template: 'X'.repeat(parsedText.length)}
        } else if (
          /[A-Za-z@]/g.test(parsedText) &&
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@?((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.?)+([a-zA-Z]{2,})?)?)$/.test(parsedText)
        ) {
          // console.log('format as email')
          this.tempValue = parsedText
          this.fieldValue = parsedText
          return {text: parsedText, template: 'X'.repeat(parsedText.length || 1)}
        } else {
          // console.log('format as phone')
          let {text, formatted: {country, template}} = this.formattedNumber(parsedText, this.countryIso)
          this.tempValue = text
          this.fieldValue = this.getPhoneIntFormat(text, country)
          if (country && this.countryIso !== country) this.countryIso = country
          return {text, template}
        }
      }
      let parse = (character, value) => {
        // console.log('parse:', 'char', character, 'value', value)
        return character || ''
        // if (character || value) {
        //   if (
        //     (/[A-Za-z@]/.test(character)) ||
        //     (/[A-Za-z@]/g.test(value) &&
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@?((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.?)+([a-zA-Z]{2,})?)?)$/.test(value))
        //   ) {
        //     return character
        //   } else return DIGITS[character]
        // } else return ''
      }
      let onChange = val => {
        // console.log('val', val)
        this.pe = val
      }
      return {format, parse, onChange}
    },
    ...mapState('data', ['countries']),
    ...mapGetters('data', ['phoneMetadataHasAllCountriesForPrefix', 'formattedNumber', 'getPhoneFormatInfo', 'getPhoneIntFormat', 'isValidNumber', 'hasValidPhonePrefix']),
    ...mapGetters('userauth', ['userCountry'])
  },
  methods: {
    async pressEnter () {
      await this.formatNumber()
      this.$emit('pressEnter')
    },
    async formatNumber () {
      this.tempValue = this.formattedNumber(this.tempValue, this.countryIso).text || this.tempValue
      this.fieldValue = this.formattedNumber(this.tempValue, this.countryIso).text
        ? await this.getPhoneIntFormat(this.tempValue, this.countryIso || null)
        : this.tempValue
      await this.$nextTick()
      return this.fieldValue
    },
    toggleInfo () { this.isInfoOpen = !this.isInfoOpen },
    selectField () {
      // console.log('selectField')
      // console.log(this.$refs[this.fieldName])
      this.countryFocused
        ? this.$refs.country.$el.querySelector('input').focus() /* this.$refs.country.$el.querySelector('input').setSelectionRange(0, 99999) */
        : this.$refs[this.fieldName].focus()
    },
    setCountryFocused () {
      // console.log('clicked ')
      this.countryFocused = true
    },
    newCountry () {
      if (this.tempValue && this.exPhone) {
        this.tempValue = this.tempValue.includes(this.exPhone.split(' ')[0]) ? this.tempValue : this.exPhone.split(' ')[0]
      } else this.tempValue = ''
      this.fieldValue = this.tempValue
      this.selectField()
    },
    ...mapActions('data', ['updateCountryData', 'getCountryIsoFromPhonePrefix'])
  },
  directives: {
    format: (el, binding, vnode) => {
      let format = binding.value.format
      let parse = binding.value.parse
      const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
      const onChangeHandler = () => {
        console.log(vnode.context)
        vnode.context.$emit('newVal', input.value)
      }
      input.onchange = (event) => {
        setTimeout(() => {
          return onChange(event, input, parse, format, onChangeHandler)
        }, 10)
      }
      input.oncut = (event) => onCut(event, input, parse, format, onChangeHandler)
      input.onpaste = (event) => onPaste(event, input, parse, format, onChangeHandler)
      input.onkeydown = (event) => onKeyDown(event, input, parse, format, onChangeHandler)
      input.oninput = (event) => onChange(event, input, parse, format, onChangeHandler)
    }
  },
  watch: {
    fieldValue (val) {
      // console.log(val)
      if (val && !this.tempValue) {
        this.tempValue = val
      } else if (this.getPhoneIntFormat(this.tempValue, this.countryIso || null) !== val) {
        this.tempValue = val
      }
      if (val && /^\+\d\d?\d?/.test(val) && !this.countryIso) {
        this.countryIso = (this.formattedNumber(this.fieldValue)).formatted.country
      }
      if (val && /^\+\d\d?\d?/.test(val) && !this.phoneMetadataHasAllCountriesForPrefix(val)) {
        this.getCountryIsoFromPhonePrefix(val).then(() => {
          this.countryIso = (this.formattedNumber(this.fieldValue)).formatted.country
        })
      }
      this.$emit('input', val)
    },
    userCountry (val) {
      if (val && !this.countryIso) {
        this.countryIso = val
      }
    }
    // countryFocused (val) {
    //   // console.log('country focused is: ', val)
    // }
  },
  async mounted () {
    // console.log('mounted with fieldValue: ', this.fieldValue, 'userCountry', this.userCountry, 'countryIso', this.countryIso)
    if (this.fieldValue && typeof this.fieldValue === 'string') {
      this.tempValue = this.fieldValue
      await this.getCountryIsoFromPhonePrefix(this.fieldValue)
      this.countryIso = (this.formattedNumber(this.fieldValue)).formatted.country
      this.fieldValue = this.getPhoneIntFormat(this.tempValue, this.countryIso || null)
    }
    if (this.userCountry && !this.countryIso) {
      this.countryIso = this.userCountry
    }
  }
}
</script>

<style>

</style>
