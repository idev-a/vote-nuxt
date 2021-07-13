<template>
  <div class="field">
    <vfa-basic-label :fieldName="fieldName" @toggleInfo="toggleInfo"></vfa-basic-label>
    <b-field
      :type="fieldType"
      :message="fieldMessages">
      <transition-group name="slide" tag="div" @after-enter="selectField" class="field has-addons">
        <p class="control" key="flag" v-if="!countryFocused">
          <button :class="['button', 'control', 'is-outlined', 'is-inverted', 'is-paddingless']"
            style="padding-left:0px;"
            @click.prevent="countryFocused = !countryFocused">
            <span class="flag-container fa-stack">
              <i :class="`fa-stack-2x flag-icon flag-icon-${countryIso ? countryIso.toLowerCase() : 'un'}`"></i>
              <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(50%)"></i>
            </span>
          </button>
        </p>
        <vfa-country-selector
          v-if="countryFocused"
          key="country"
          ref="country"
          :countryFocused="countryFocused"
          @newCountry="newCountry"
          @blur="countryFocused = false"
          v-model="countryIso"
          phone></vfa-country-selector>
          <!-- :class="countryFocused ? 'wide' : 'shrink'" -->

          <!-- v-if="tempValue && tempValue.length > 1" -->
        <b-input
          v-if="deviceOs === 'android'"
          key="dumbInput"
          :type="fieldType"
          v-model="tempValue"
          :id="fieldName"
          :placeholder="$t(`request.tel.placeholder`, {example: exPhone})"
          :class="[requiredClass, 'is-expanded']"
          :autocomplete="autoComplete"
          :maxlength="maxLength"
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
          :placeholder="$t(`request.tel.placeholder`, {example: exPhone})"
          :class="[requiredClass, 'is-expanded']"
          :autocomplete="autoComplete"
          :maxlength="maxLength"
          @input="$emit('delayTouch')"
          @focus="$ga.event('formAction', 'focus/select', fieldName)"
          v-format="formatFunctions"
          :ref="fieldName"></b-input>
        <!-- <b-input
          v-else
          key="inputEmpty"
          :type="fieldType"
          :placeholder="$t(`request.tel.placeholder`, {example: exPhone})"
          :class="[requiredClass, 'input', 'is-expanded']"
          :value="tempValue"
          @input="val => { $emit('newVal', val); tempValue = val }"></b-input> -->
      </transition-group>
    </b-field>
    <b-message v-if="toolTipContent" :title="tooltipTitle" type="is-info" has-icon :active.sync="isInfoOpen">
      <p v-html="toolTipContent"></p>
    </b-message>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import fieldMixin from '~/mixins/fieldMixin.js'
import VfaCountrySelector from '~/components/VfaCountrySelector'
const { onChange, onCut, onPaste, onKeyDown } = require('input-format/commonjs/input control')
const DIGITS =
{
  '+': '+',
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '\uFF10': '0', // Fullwidth digit 0
  '\uFF11': '1', // Fullwidth digit 1
  '\uFF12': '2', // Fullwidth digit 2
  '\uFF13': '3', // Fullwidth digit 3
  '\uFF14': '4', // Fullwidth digit 4
  '\uFF15': '5', // Fullwidth digit 5
  '\uFF16': '6', // Fullwidth digit 6
  '\uFF17': '7', // Fullwidth digit 7
  '\uFF18': '8', // Fullwidth digit 8
  '\uFF19': '9', // Fullwidth digit 9
  '\u0660': '0', // Arabic-indic digit 0
  '\u0661': '1', // Arabic-indic digit 1
  '\u0662': '2', // Arabic-indic digit 2
  '\u0663': '3', // Arabic-indic digit 3
  '\u0664': '4', // Arabic-indic digit 4
  '\u0665': '5', // Arabic-indic digit 5
  '\u0666': '6', // Arabic-indic digit 6
  '\u0667': '7', // Arabic-indic digit 7
  '\u0668': '8', // Arabic-indic digit 8
  '\u0669': '9', // Arabic-indic digit 9
  '\u06F0': '0', // Eastern-Arabic digit 0
  '\u06F1': '1', // Eastern-Arabic digit 1
  '\u06F2': '2', // Eastern-Arabic digit 2
  '\u06F3': '3', // Eastern-Arabic digit 3
  '\u06F4': '4', // Eastern-Arabic digit 4
  '\u06F5': '5', // Eastern-Arabic digit 5
  '\u06F6': '6', // Eastern-Arabic digit 6
  '\u06F7': '7', // Eastern-Arabic digit 7
  '\u06F8': '8', // Eastern-Arabic digit 8
  '\u06F9': '9' // Eastern-Arabic digit 9
}

export default {
  name: 'Tel',
  mixins: [fieldMixin],
  components: {
    VfaCountrySelector
  },
  data () {
    return {
      countryIso: '',
      countryFocused: false,
      tempValue: ''
    }
  },
  computed: {
    exPhone () { return this.countries.find(country => country.code === this.countryIso) ? this.countries.find(country => country.code === this.countryIso).exPhone : '+1 201 555 0123' },
    deviceType () { return this.$store.state.userauth.device.type },
    deviceOs () { return this.$store.state.userauth.device.os },
    formatFunctions () {
      let format = (parsedText) => {
        // console.log('parsedText:', parsedText)
        if (!parsedText) {
          this.fieldValue = null
          return {text: ' ', template: 'X'}
        } else if (/^\+\d\d?\d?/.test(parsedText) && !this.phoneMetadataHasAllCountriesForPrefix(parsedText)) {
          this.fieldValue = parsedText
          this.getCountryIsoFromPhonePrefix(parsedText)
          return {text: parsedText, template: 'X'.repeat(parsedText.length)}
        } else {
          let {text, formatted: {country, template}} = this.formattedNumber(parsedText, this.countryIso)
          this.tempValue = text
          this.fieldValue = this.getPhoneIntFormat(text, country)
          if (country && this.countryIso !== country) this.countryIso = country
          return {text, template}
        }
      }
      let parse = (character, value) => {
        // console.log('parse:', 'char', character, 'value', value)
        return (character || value) ? DIGITS[character] : ''
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
    async formatNumber () {
      this.tempValue = this.formattedNumber(this.tempValue, this.countryIso).text || this.tempValue
      this.fieldValue = this.formattedNumber(this.tempValue, this.countryIso).text
        ? await this.getPhoneIntFormat(this.tempValue, this.countryIso || null)
        : this.tempValue
      await this.$nextTick()
      return this.fieldValue
    },
    selectField () {
      // console.log('selectField')
      // console.log(this.$refs[this.fieldName])
      this.countryFocused
        ? this.$refs.country.$el.querySelector('input').focus() /* this.$refs.country.$el.querySelector('input').setSelectionRange(0, 99999) */
        : this.$refs[this.fieldName].focus()
    },
    newCountry () {
      this.tempValue = this.exPhone ? this.exPhone.split(' ')[0] : ''
      this.selectField()
    },
    ...mapActions('data', ['updateCountryData', 'getCountryIsoFromPhonePrefix'])
  },
  directives: {
    format: (el, binding, vnode) => {
      let format = binding.value.format
      let parse = binding.value.parse
      const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
      const onChangeHandler = () => { vnode.context.$emit('newVal', input.value) }
      input.onchange = (event) => onChange(event, input, parse, format, onChangeHandler)
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
      } else if (this.getPhoneIntFormat(this.tempValue.toString(), this.countryIso || null) !== val) {
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
    },
    userCountry (val) {
      if (val && !this.countryIso) {
        this.countryIso = val
      }
    }
  },
  async mounted () {
    if (this.fieldValue && typeof this.fieldValue === 'string') {
      // console.log('*************', this.fieldValue, typeof this.fieldValue)
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
