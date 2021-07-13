<template>
  <b-autocomplete
    v-model="countrySearch"
    :data="filteredCountries"
    field="name"
    open-on-focus
    :class="requiredClass"
    :type="messageType"
    keep-first
    expanded
    ref="input"
    :icon="countryFocused && !type ? `flag-icon flag-icon-${value ? value.toLowerCase() : 'un'}` : null"
    icon-pack="flag-icon"
    @blur="sendblur"
    @focus="countryFocused = true; select($event)"
    @select="(option) => { if (option && option.code) {countrySearch = option.name; $emit('input', option.code); $emit('newCountry')} }">
    <template slot="header">
      <label for="country" class="is-size-6 has-text-grey">{{$t('request.abrAdr.countryHint')}}</label>
    </template>
    <!-- :expanded="countryFocused" -->
    <!-- :class="!countryFocused ? 'shrink' : ''" -->
    <template slot="empty">{{$t('request.abrAdr.countryNoResults', {typed: countrySearch})}}</template>
    <template slot-scope="props">
      <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} <span v-if="phone">{{ props.option.exPhone ? props.option.exPhone.split(' ')[0] : '' }}</span>
    </template>
  </b-autocomplete>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CountrySelector',
  props: {
    value: String,
    phone: Boolean,
    type: String,
    messageType: String,
    requiredClass: Object
  },
  data () {
    return {
      countrySearch: '',
      countryFocused: false
    }
  },
  computed: {
    filteredCountries () {
      if (this.allowedCountries.find(x => x.name.toLowerCase() === this.countrySearch.toLowerCase())) {
        return [this.allowedCountries.find(x => x.name.toLowerCase() === this.countrySearch.toLowerCase())].concat(this.allowedCountries.filter((country, index) => country.name.toLowerCase() !== this.countrySearch.toLowerCase() || index > 6))
      } else if (this.countrySearch) {
        return this.allowedCountries.filter((option) => {
          return option.name.toString().toLowerCase().includes(this.countrySearch.toLowerCase()) ||
            option.code.toString().toLowerCase().includes(this.countrySearch.toLowerCase()) ||
            (option.exPhone && option.exPhone.split(' ')[0].replace('+', '').includes(this.countrySearch.replace('+', '')))
        })
      } else return this.allowedCountries
    },
    mustBeEmail () { return false },
    allowedCountries () {
      return this.type === 'abrAdr' ? this.countries.filter(x => !/^AS|GU|PR|VI$/.test(x.code)) : this.countries
    },
    ...mapState('data', [
      'countries'
    ])
  },
  watch: {
    // countryFocused (val) {
    //   if (val) {
    //     setTimeout(() => {
    //       this.focusCountry()
    //     }, 480)
    //   }
    // },
    value (val) {
      if (val) this.countrySearch = this.countries.find(x => x.code === val).name
      this.updateCountryData(val)
      this.$ga.event('formAction', `${this.type} Country Selected`, val)
      if (this.type === 'abrAdr') {
        this.$ga.event('voterSegment', 'abroadCountry', val)
        this.$ga.set('dimension3', val)
      }
    }
  },
  methods: {
    // focusCountry () { this.$refs.input.focus() },
    // focus () { this.$refs.input.focus() },
    select (event) {
      event.target.setSelectionRange(0, 9999)
      this.$emit('focus')
    },
    sendblur () {
      this.countryFocused = false
      setTimeout(() => {
        this.$emit('blur')
      }, 480)
    },
    ...mapActions('data', ['updateCountryData'])
  },
  mounted () {
    if (this.value) {
      this.countrySearch = this.countries && this.countries.find(x => x.code === this.value) ? this.countries.find(x => x.code === this.value).name : ''
      this.updateCountryData(this.value)
    }
  }
}
</script>

<style>


</style>
