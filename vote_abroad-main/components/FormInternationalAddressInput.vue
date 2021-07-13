<template>
  <div class="field">
    <vfa-basic-label :fieldName="fieldName" @toggleInfo="toggleInfo"></vfa-basic-label>
      <b-message v-if="toolTipContent" :title="toolTipTitle" type="is-info" has-icon :active.sync="isInfoOpen">
      <p v-html="toolTipContent"></p>
    </b-message>
    <div class="field" v-if="v && formatted">
      <transition-group name="slide" tag="div" class="field">
        <template v-for="part in formatted">
          <b-field
            :message="ctry === 'US' && fieldName === 'abrAdr' ? $t('request.abrAdr.messages.US-warning') : ''"
            :type="ctry === 'US' && fieldName === 'abrAdr' ? 'is-info' : ''"
            v-if="part.type === 'countryiso'"
            :key="part.type">
            <b-field :type="v.countryiso.$error ? 'is-danger' : ''">
              <p class="control" key="flag">
                <button :class="['button', 'control', 'is-outlined', 'is-inverted', 'is-paddingless']"
                  @click.prevent="focusCountry"
                  style="padding-left:0px;">
                  <span class="flag-container fa-stack">
                    <i :class="`fa-stack-2x flag-icon flag-icon-${ctry.toLowerCase() || 'un'}`"></i>
                    <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(45%)"></i>
                  </span>
                </button>
              </p>
              <vfa-country-selector
                :type="fieldName"
                :value="ctry"
                :requiredClass="formatted[0].class"
                :messageType="v.countryiso.$error ? 'is-danger' : ''"
                ref="ctry"
                @input="val => {if (val) updateAddress('countryiso', val)}"></vfa-country-selector>
            </b-field>
          </b-field>
          <b-field v-else :key="part.type" :type="part.displayType" :message="part.messages">
            <b-autocomplete
              v-if="part.type === 'A'"
              :data="data"
              field="structured_formatting.main_text"
              :placeholder="localizeLabel(part.label)"
              :value="tempA || adr[part.type]"
              @input="val => {tempA = val; updateAddress(part.type, val)}"
              :aria-label="localizeLabel(part.label)"
              :title="localizeLabel(part.label)"
              :class="part.class"
              :maxlength="adr[part.type] && hasFocus === part.type ? 40 : ''"
              :has-counter="adr[part.type] && hasFocus === part.type"
              :loading="isFetching"
              :ref="part.type"
              @keypress.native="getAsyncData"
              @keyup.delete.native="getAsyncData"
              @select="option => fillData(option)"
              @focus="$ga.event('formAction', 'focus/select', `${fieldName}.${part.type}`)">
              <template slot-scope="props">{{ props.option.description }}</template>
              <template slot="header">
                <div class="buttons has-addons is-right">
                    <a @click="closeAutocomplete" class="delete is-small"></a>
                </div>
              </template>
            </b-autocomplete>
              <!-- @keydown="autocompleteFocused = true"
              @focus="autocompleteFocused = true"
              @blur="autocompleteFocused = false" -->
            <b-select
              v-else-if="part.options && part.options.length < 5  && part.options.length > 0"
              :placeholder="localizeLabel(part.label)"
              :value="adr[part.type] || null"
              :ref="part.type"
              @input="val => updateAddress(part.type, val)"
              @focus="$ga.event('formAction', 'focus/select', `${fieldName}.${part.type}`)"
              :class="[part.class, 'req-select']"
              expanded>
              <option
                v-for="option in part.options"
                :value="option.key"
                :key="option.key">
                {{ option.name }}
              </option></b-select>
            <b-autocomplete
              v-else-if="part.options && part.options.length > 4"
              :data="adr[part.type] ? part.options.filter(x => x.name.toLowerCase().includes(adr[part.type].toLowerCase())): part.options"
              field="name"
              :ref="part.type"
              :placeholder="localizeLabel(part.label)"
              open-on-focus
              keep-first
              :value="adr[part.type] || null"
              @input="val => updateAddress(part.type, val)"
              @select="option => option ? updateAddress(part.type, option.name) : ''"
              @focus="$ga.event('formAction', 'focus/select', `${fieldName}.${part.type}`)"></b-autocomplete>
            <b-input
              v-else-if="part.type !== 'alt5'"
              :ref="part.type"
              :value="adr[part.type] || ''"
              @input="val => updateAddress(part.type, val)"
              :placeholder="localizeLabel(part.label)"
              :maxlength="adr[part.type] && hasFocus === part.type ? 40 : ''"
              :has-counter="adr[part.type] && hasFocus === part.type"
              @focus="hasFocus = part.type; $ga.event('formAction', 'focus/select', `${fieldName}.${part.type}`)"
              @blur="hasFocus = ''"
              :type="part.displayType"
              :class="part.class"></b-input>
          </b-field>
        </template>
        <template v-if="formatted && formatted.length === 1">
          <b-field v-for="n in ['A', 'B', 'C', 'S']" :key="n">
            <b-input
              disabled
              :value="$t(`request.votAdr.${n}`) + (n === 'A' ? $t('request.abrAdr.selectCountry') : '')"></b-input>
          </b-field>
        </template>
      </transition-group>
    </div>
    <b-field v-if="adr && v && formatted && formatted.length" :label="usesAlternateFormat ? $t(`request.${fieldName}.structured-label`) : $t(`request.${fieldName}.unstructured-label`)">
      <b-field>
        <b-radio-button
          :value="usesAlternateFormat"
          @input="val => update({[fieldName]: Object.assign({}, this.adr || {}, {usesAlternateFormat: !usesAlternateFormat})})"
          @click="$ga.event('formAction', 'focus/select', `${fieldName}.usesAlternateFormat`)"
          :native-value="!usesAlternateFormat"
          :type="usesAlternateFormat ? 'is-success' : 'is-danger'">
          <b-icon :icon="!usesAlternateFormat ? 'edit' : 'align-justify'"></b-icon>
          <span>{{$t(`request.${fieldName}.changeFormat`)}}</span>
        </b-radio-button>
      </b-field>
    </b-field>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import snarkdown from 'snarkdown'
import VfaBasicLabel from '~/components/VfaBasicLabel'
import VfaCountrySelector from '~/components/VfaCountrySelector'
import { placesAutocomplete, placeDetails, uuidv4, cleanString } from '~/utils/helpers.js'

export default {
  name: 'AbroadAddress',
  props: ['fieldName', 'v'],
  components: {
    VfaBasicLabel,
    VfaCountrySelector
  },
  data () {
    return {
      tempA: '',
      isInfoOpen: false,
      countryFields: [{help: '', type: 'countryiso', label: 'Country', required: true, length: 1}],
      data: [],
      sessionToken: '',
      isFetching: false,
      autocompleteFocused: false,
      needsFormat: false,
      hasFocus: ''
    }
  },
  computed: {
    formattedAddress () {
      if (this.adr && this.adr.usesAlternateFormat) {
        return ['alt1', 'alt2', 'alt3', 'alt4'].map(x => this.adr[x] || null).filter(x => x).concat(this.countryData.name)
      } else {
        return this.countryData && this.countryData.cfmt ? this.countryData.cfmt.replace(/%([N|O|A|B|D|C|S|Z|X])/g, (match, p1, offset, string) => this.adr[p1] || '').split(/%n/g).filter(x => x).concat(this.countryData.name) : ['']
      }
      // return this.countryData && /%A|%B|/.replacethis.countryData.cfmt ? this.countryData.cfmt : ''
    },
    ctry () { return this.adr && this.adr.countryiso ? this.adr.countryiso : '' },
    usesAlternateFormat () { return this.adr && this.adr.usesAlternateFormat ? this.adr.usesAlternateFormat : false },
    countryData () {
      if (this.ctry && this.postalMetadataHasCountry(this.ctry)) {
        return this.ctry === 'US' && this.fieldName === 'abrAdr'
          ? {fmt: '%N%n%O%n%A%n%C, %S %Z', id: 'data/US', locality_name_type: 'city', require: 'ACSZ', state_name_type: 'state', sublocality_name_type: 'suburb', upper: 'CS', zip_name_type: 'zip', key: 'US', lang: 'en', languages: 'en', name: 'UNITED STATES', posturl: 'https://tools.usps.com/go/ZipLookupAction!input.action', sub_isoids: 'AA~AE~AP', sub_keys: 'AA~AE~AP', sub_names: 'Armed Forces (AA)~Armed Forces (AE)~Armed Forces (AP)', sub_zipexs: '34000,34099~09000,09999~96200,96699', sub_zips: '340~09~96[2-6]', zip: '(\\d{5})(?:[ \\-](\\d{4}))?', zipex: '95014,22162-1010', format: [{type: 'A', label: 'Address line 1', help: 'APO, DPO, FPO address', length: 1, required: true}, {type: 'B', label: 'Address line 2', help: '', length: 1, required: false}, {type: 'C', label: 'APO / DPO / FPO', help: null, length: 3, required: true}, {type: 'S', label: 'AA / AE / AP', help: null, length: 3, required: true, options: [{name: 'Armed Forces (AA)', key: 'AA', iso: null, zipRegex: '340', zipEx: '34000,34099', parentKey: 'US'}, {name: 'Armed Forces (AE)', key: 'AE', iso: null, zipRegex: '09', zipEx: '09000,09999', parentKey: 'US'}, {name: 'Armed Forces (AP)', key: 'AP', iso: null, zipRegex: '96[2-6]', zipEx: '96200,96699', parentKey: 'US'}, {name: 'Northern Mariana Islands', key: 'MP', iso: null, zipRegex: '9695[0-2]', zipEx: '96950,96952', parentKey: 'US'}]}, {type: 'Z', label: 'Zip', help: null, length: 3, required: true, example: '95014', regex: '(\\d{5})(?:[ \\-](\\d{4}))?'}], cfmt: '%N%n%A%n%B%n%C, %S %Z'}
          : Object.assign({}, this.postalDataForCountry(this.ctry))
      } else return null
    },
    requiredParts () {
      return this.countryData && this.countryData.require
        ? this.countryData.require.split('').concat(['alt1', 'countryiso'])
        : ['A', 'C', 'alt1', 'countryiso']
    },
    formatted () {
      if (this.countryFields && Array.isArray(this.countryFields)) {
        return this.countryFields
          .filter(({type}) => this.usesAlternateFormat
            ? /alt|country/.test(type)
            : /A|B|D|C|S|X|Z|country/.test(type))
          .map(part => Object.assign({}, part, {
            messages: this.v && this.v[part.type].$error
              ? Object.entries(this.v[part.type]).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(([k, v]) => this.$t(`request.${this.fieldName}.messages.${part.type}-${k}`, { label: this.localizeLabel(part.label), zipExample: part.example }))
              : '',
            displayType: this.v && this.v[part.type].$error ? 'is-danger' : '',
            class: {
              'is-required': this.requiredParts.includes(part.type),
              'is-optional': !this.requiredParts.includes(part.type),
              'hide': Boolean(this.adr && this.adr[part.type]) || (this.v && this.v[part.type].$error)
            }
          }))
      } else return ['']
    },
    adr: {
      get () { return this.getCurrent[this.fieldName] || {} },
      set (val) { this.update({[this.fieldName]: Object.assign({}, this.adr, val, {formatted: this.formattedAddress})}) }
    },
    toolTipTitle () { return this.$te(`request.${this.fieldName}.tooltipTitle`) ? this.$t(`request.${this.fieldName}.tooltipTitle`) : null },
    toolTipContent () { return this.$te(`request.${this.fieldName}.tooltip`) ? snarkdown(this.$t(`request.${this.fieldName}.tooltip`)) : null },
    ...mapGetters('data', ['countriesWithPostalData', 'postalMetadataHasCountry', 'postalDataForCountry']),
    ...mapGetters('requests', ['getCurrent']),
    ...mapGetters('userauth', ['userCountry']),
    ...mapState('data', ['postal'])
  },
  methods: {
    camelize (str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    localizeLabel (label) {
      return this.$te(`addressPart.${this.camelize(label)}`)
        ? this.$t(`addressPart.${this.camelize(label)}`)
        : label
    },
    focusCountry () {
      this.$refs.ctry[0].$refs.input.focus()
    },
    closeAutocomplete () {
      this.$refs.A[0].isActive = false
    },
    async getAsyncData (val) {
      await this.$nextTick()
      await this.$nextTick()
      placesAutocomplete.call(this, this.tempA, this.ctry, 'abrAdr')
    },
    fillData (opt) {
      this.autocompleteFocused = false
      placeDetails.call(this, opt)
    },
    createFormattedAddress () {
      // console.log('creatingFormattedaddress')
      this.countryFields = [1, 2, 3, 4, 5]
        .map(x => ({help: '', label: `address line ${x}`, length: 1, required: x === 1, type: `alt${x}`}))
        .concat({help: '', type: 'countryiso', label: 'Country', required: true, length: 1})
        .concat(this.ctry && this.countryData
          ? this.countryData.format
          : [{help: '', label: 'Street Address', length: 1, required: true, type: 'A'}, {help: '', label: 'Apartment', length: 1, required: false, type: 'B'}, {help: '', label: 'City', length: 1, required: true, type: 'C'}, {help: '', label: 'Province', length: 1, required: false, type: 'S'}])
    },
    toggleInfo () { this.isInfoOpen = !this.isInfoOpen },
    updateAddress: async function (addressPart, value) {
      let cleanAdr = !this.countryData || !this.formatted || !this.adr
        ? this.adr
        : Object.entries(this.adr).reduce((obj, [k, v]) => {
          if (this.countryFields.concat({type: 'usesAlternateFormat'}).map(({type}) => type).includes(k)) obj[k] = v
          return obj
        }, {})
      await this.update({[this.fieldName]: Object.assign({}, cleanAdr, {[addressPart]: cleanString(value) || null, formatted: this.formattedAddress})})
      this.$emit('delayTouch', addressPart)
    },
    ...mapActions('data', ['updateCountryData']),
    ...mapMutations('requests', ['update'])
  },
  watch: {
    postal: function (val) {
      this.createFormattedAddress()
    },
    ctry: async function (val, oldVal) {
      if (this.fieldName === 'abrAdr') this.$ga.set('dimension3', val)
      if (val) {
        if (this.postalMetadataHasCountry(val)) {
          this.createFormattedAddress()
        } else {
          await this.updateCountryData(val)
          // await this.$nextTick()
          this.createFormattedAddress()
        }
      }
    },
    userCountry (val) {
      if (!this.ctry && val) {
        this.updateAddress('countryiso', val)
      }
    }
  },
  mounted: async function () {
    this.sessionToken = uuidv4()
    if (this.ctry) {
      await this.updateCountryData(this.ctry)
      await this.$nextTick()
      this.createFormattedAddress()
    }
    if (!this.ctry && this.userCountry) {
      this.updateAddress('countryiso', this.userCountry)
      await this.updateCountryData(this.userCountry)
      await this.$nextTick()
      this.createFormattedAddress()
    }
    if (process.browser) {
      // window.onNuxtReady(() => {
      this.isInfoOpen = true
      setTimeout(() => {
        this.isInfoOpen = false
      }, 10)
      // })
    }
    if (this.adr.A) this.tempA = this.adr.A || ''
    //   })
    // }
  },
  beforeDestroy: async function () {
    await this.updateCountryData(this.ctry)
    await this.$nextTick()
    this.createFormattedAddress()
    let cleanAdr = !this.countryData || !this.formatted || !this.adr
      ? this.adr
      : Object.entries(this.adr).reduce((obj, [k, v]) => {
        if (this.countryFields.concat({type: 'usesAlternateFormat'}).map(({type}) => type).includes(k)) obj[k] = v && typeof v === 'string' ? v.trim() : v
        return obj
      }, {})
    this.update({[this.fieldName]: Object.assign({}, cleanAdr, {formatted: this.formattedAddress})})
  }
}
</script>

<style>
.slide-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.slide-enter, .slide-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.slide-leave-active {
  position: absolute;
}
.slide-move {
  transition: transform 1s;
}
</style>
