<template>
  <div class="field">
    <span class="is-flex"><label @click.prevent="$refs.A.focus()" class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
      <!-- :message="validations.A.$error ? Object.keys(validations.A.$params).map(x => $t(`request.votAdr.messages.A-${x}`)) : '' " -->
    <b-field
      :message="validations && validations.A.$error ? Object.entries(validations.A).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.votAdr.messages.A-${x[0]}`)) : ''"
      :type="(validations.A.$error ? 'is-danger': '')">
      <b-autocomplete ref="A"
        :placeholder="$t('request.votAdr.A')"
        :data="data"
        field="structured_formatting.main_text"
        v-model="tempStreet"
        name="street-address"
        autocomplete="section-abroad shipping street-address"
        :loading="isFetching"
        @keypress.native="getAsyncData"
        @keyup.delete.native="getAsyncData"
        @select="option => fillData(option)"
        @focus="$ga.event('formAction', 'focus/select', 'votAdr.A')">
        <template slot-scope="props">{{ props.option.description }}</template>
        <template slot="empty">No results found</template>
        <template slot="header">
          <div class="buttons has-addons is-right">
              <a @click="closeAutocomplete" class="delete is-small"></a>
          </div>
        </template>
      </b-autocomplete>
        <!-- @input="getAsyncData" -->
    </b-field>
    <b-field>
      <b-input
        :placeholder="$t('request.votAdr.B')"
        autocomplete="section-voting shipping address-line2"
        ref="B"
        name="Apartment"
        v-model="apt"
        @focus="$ga.event('formAction', 'focus/select', 'votAdr.B')"></b-input>
    </b-field>
    <div class="field is-horizontal">
      <div class="field-body">
        <b-field
          :message="validations.C.$error ? Object.keys(validations.C.$params).map(x => $t(`request.votAdr.messages.C-${x}`)) : '' "
          :type="(validations.C.$error ? 'is-danger': '')">
          <b-autocomplete ref="C"
            :placeholder="$t('request.votAdr.C')"
            :data="data"
            expanded
            field="structured_formatting.main_text"
            v-model="city"
            name="city"
            autocomplete="section-voting shipping address-level2"
            :loading="isFetchingCity"
            @keyup.native="getAsyncDataCity"
            @select="option => option ? fillDataCity(option) : ''"
            @focus="$ga.event('formAction', 'focus/select', 'votAdr.C')">
            <template slot-scope="props">{{ props.option.description.replace(', USA', '') }} </template>
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
        <b-field
          :message="validations.S.$error ? Object.keys(validations.S.$params).map(x => $t(`request.votAdr.messages.S-${x}`)) : '' "
          :type="(validations.S.$error ? 'is-danger': '')">
          <b-select v-model="state"
            ref="S"
            name="state"
            autocomplete="section-voting shipping address-level1"
            expanded
            :placeholder="$t('request.votAdr.S')"
            @focus="$ga.event('formAction', 'focus/select', 'votAdr.S')">
            <option
              v-for="state in statesSortedLocalized"
              :value="state.iso"
              :key="state.iso">
              {{ $t(`states.${state.iso}`) }}
            </option>
          </b-select>
        </b-field>
          <!-- :message="validations.Z.$anyError ? Object.keys(validations.Z.$params).map(x => $t(`request.votAdr.messages.Z-${x}`)) : '' " -->
        <b-field
          :message="validations.Z.$anyError ? Object.entries(validations.Z).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(([k, v]) => $t(`request.votAdr.messages.Z-${k}`, {state: $t(`states.${state || 'US'}`), example1: zipEx[0], example2: zipEx[1]})) : '' "
          :type="(validations.Z.$anyError ? 'is-danger': '')">
          <b-input
            :placeholder="$t('request.votAdr.Z')"
            ref="Z"
            name="zip"
            autocomplete="section-voting shipping postal-code"
            expanded
            v-model="zip"
            @focus="$ga.event('formAction', 'focus/select', 'votAdr.Z')"></b-input>
        </b-field>
      </div>
    </div>
    <b-field :label="$t('request.votAdr.Y')">
      <b-input ref="Y"
        :placeholder="$t('request.votAdr.Y')"
        name="county"
        :disabled="state === 'DC' || state === 'PR' || state === 'VI' || state === 'AS' || state === 'GU'"
        v-model="county"
        @focus="$ga.event('formAction', 'focus/select', 'votAdr.Y')"></b-input>
    </b-field>
  </div>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash/debounce'
import { placesAutocomplete, placeDetails, uuidv4 } from '~/utils/helpers.js'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Voting-Address',
  props: [
    'value',
    'label',
    'toolTipTitle',
    'validations'
  ],
  data () {
    return {
      isOpen: false,
      sessionToken: '',
      fieldName: 'votAdr',
      tempStreet: '',
      states: [
        {'name': 'Alabama', 'iso': 'AL'},
        {'name': 'Alaska', 'iso': 'AK'},
        {'name': 'American Samoa', 'iso': 'AS'},
        {'name': 'Arizona', 'iso': 'AZ'},
        {'name': 'Arkansas', 'iso': 'AR'},
        {'name': 'California', 'iso': 'CA'},
        {'name': 'Colorado', 'iso': 'CO'},
        {'name': 'Connecticut', 'iso': 'CT'},
        {'name': 'Delaware', 'iso': 'DE'},
        {'name': 'District Of Columbia', 'iso': 'DC'},
        // {'name': 'Federated States Of Micronesia', 'iso': 'FM'},
        {'name': 'Florida', 'iso': 'FL'},
        {'name': 'Georgia', 'iso': 'GA'},
        {'name': 'Guam', 'iso': 'GU'},
        {'name': 'Hawaii', 'iso': 'HI'},
        {'name': 'Idaho', 'iso': 'ID'},
        {'name': 'Illinois', 'iso': 'IL'},
        {'name': 'Indiana', 'iso': 'IN'},
        {'name': 'Iowa', 'iso': 'IA'},
        {'name': 'Kansas', 'iso': 'KS'},
        {'name': 'Kentucky', 'iso': 'KY'},
        {'name': 'Louisiana', 'iso': 'LA'},
        {'name': 'Maine', 'iso': 'ME'},
        // {'name': 'Marshall Islands', 'iso': 'MH'},
        {'name': 'Maryland', 'iso': 'MD'},
        {'name': 'Massachusetts', 'iso': 'MA'},
        {'name': 'Michigan', 'iso': 'MI'},
        {'name': 'Minnesota', 'iso': 'MN'},
        {'name': 'Mississippi', 'iso': 'MS'},
        {'name': 'Missouri', 'iso': 'MO'},
        {'name': 'Montana', 'iso': 'MT'},
        {'name': 'Nebraska', 'iso': 'NE'},
        {'name': 'Nevada', 'iso': 'NV'},
        {'name': 'New Hampshire', 'iso': 'NH'},
        {'name': 'New Jersey', 'iso': 'NJ'},
        {'name': 'New Mexico', 'iso': 'NM'},
        {'name': 'New York', 'iso': 'NY'},
        {'name': 'North Carolina', 'iso': 'NC'},
        {'name': 'North Dakota', 'iso': 'ND'},
        // {'name': 'Northern Mariana Islands', 'iso': 'MP'},
        {'name': 'Ohio', 'iso': 'OH'},
        {'name': 'Oklahoma', 'iso': 'OK'},
        {'name': 'Oregon', 'iso': 'OR'},
        // {'name': 'Palau', 'iso': 'PW'},
        {'name': 'Pennsylvania', 'iso': 'PA'},
        {'name': 'Puerto Rico', 'iso': 'PR'},
        {'name': 'Rhode Island', 'iso': 'RI'},
        {'name': 'South Carolina', 'iso': 'SC'},
        {'name': 'South Dakota', 'iso': 'SD'},
        {'name': 'Tennessee', 'iso': 'TN'},
        {'name': 'Texas', 'iso': 'TX'},
        {'name': 'Utah', 'iso': 'UT'},
        {'name': 'Vermont', 'iso': 'VT'},
        {'name': 'Virgin Islands', 'iso': 'VI'},
        {'name': 'Virginia', 'iso': 'VA'},
        {'name': 'Washington', 'iso': 'WA'},
        {'name': 'West Virginia', 'iso': 'WV'},
        {'name': 'Wisconsin', 'iso': 'WI'},
        {'name': 'Wyoming', 'iso': 'WY'}
      ],
      isFetching: false,
      isFetchingCity: false,
      data: []
    }
  },
  computed: {
    currentRequest () { return this.$store.getters['requests/getCurrent'] || {} },
    leoState () { return this.currentRequest.leo && this.currentRequest.leo.s ? this.currentRequest.leo.s : null },
    votAdr () { return this.currentRequest.votAdr || {} },
    adr () { return this.currentRequest.votAdr || {} },
    statesSortedLocalized () {
      return this.states
        .map(x => ({iso: x.iso, name: this.$t(`states.${x.iso}`)}))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    street: {
      get () { return this.votAdr.A || null },
      set (value) { this.updateAddress('A', value) }
    },
    apt: {
      get () { return this.votAdr.B || null },
      set (value) { this.updateAddress('B', value) }
    },
    city: {
      get () { return this.votAdr.C || null },
      set (value) { this.updateAddress('C', value) }
    },
    state: {
      get () { return this.votAdr.S || null },
      set (value) {
        this.updateAddress('S', value)
        this.$ga.event('voterSegment', 'votingState', value)
        this.$ga.set('dimension2', value)
      }
    },
    zip: {
      get () { return this.votAdr.Z || null },
      set (value) { this.updateAddress('Z', value) }
    },
    zipEx () {
      return !this.state
        ? ['95014', '22162-1010']
        : this.postal.US['sub_zipexs'].split('~')[this.postal.US['sub_keys'].split('~').findIndex(x => x === this.state)].split(',').map((x, i) => i === 1 ? x + '-1010' : x)
    },
    county: {
      get () { return this.state === 'DC' || this.state === 'PR' || this.state === 'VI' || this.state === 'AS' || this.state === 'GU' ? '' : this.votAdr.Y || null },
      set (value) { this.updateAddress('Y', value) }
    },
    ...mapState('data', ['postal'])
  },
  watch: {
    tempStreet: function (val, oldVal) {
      if (val !== oldVal) {
        this.street = val
      }
    },
    state: function (newVal, oldVal) {
      this.$ga.set('dimension2', newVal)
      if (newVal) this.$emit('delayTouch', 'Z')
      if (this.leoState && this.leoState.toLowerCase() !== newVal.toLowerCase()) {
        this.$store.commit('requests/update', {leo: null})
      }
      if (!oldVal || newVal !== oldVal) {
        // this.county = ''
        this.$store.commit('requests/update', {
          stateSpecial: null,
          identification: null
        })
      }
    },
    street: function (val) {
      if (val && this.tempStreet !== val) {
        this.tempStreet = val
      }
    }
  },
  async mounted () {
    this.sessionToken = uuidv4()
    if (this.street) this.tempStreet = this.street
    if (this.street || this.city) this.findCounty()
  },
  beforeDestroy () {
    if (this.state === 'DC' || this.state === 'PR' || this.state === 'VI' || this.state === 'AS' || this.state === 'GU') {
      this.county = ''
    }
  },
  methods: {
    closeAutocomplete () {
      this.$refs.A.isActive = false
    },
    async findCounty () {
      if (!this.county && this.state && this.city && this.state !== 'DC') {
        let {data: { predictions }} = await axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.street || ''}%20${this.city || ''}%20${this.state || ''}%20${this.zip || ''}&types=geocode&language=en&components=country:US&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
        if (predictions.length > 0) {
          let {data: {result}} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${predictions[0].place_id}&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
          this.sessionToken = uuidv4()
          let Y = result.address_components.filter(y => y.types.includes('administrative_area_level_2'))[0].long_name
          // console.log('Y', Y)
          this.$store.commit('requests/update', {votAdr: Object.assign({}, this.votAdr, {Y: this.decodeHtmlEntity(Y) || null})})
        }
      }
    },
    updateAddress: function (field, value) {
      this.$store.commit('requests/update', {votAdr: Object.assign({}, this.votAdr, {[field]: this.decodeHtmlEntity(value) || null})})
      this.$emit('input')
      this.$emit('delayTouch', field)
    },
    decodeHtmlEntity (str) {
      return typeof str === 'string'
        ? str.replace(/&#(\d+);/g, function (match, dec) {
          return String.fromCharCode(dec)
        })
        : str
    },
    async getAsyncData (val) {
      await this.$nextTick()
      await this.$nextTick()
      placesAutocomplete.call(this, this.tempStreet, this.ctry, 'votAdr')
    },
    fillData (opt) {
      if (opt) {
        this.$refs.B.$el.querySelector('input').focus()
        this.autocompleteFocused = false
        placeDetails.call(this, opt)
      }
    },
    getAsyncDataCity: debounce(function () {
      this.isFetchingCity = true
      this.data = []
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.city}&types=(cities)&language=en&components=country:us|country:pr|country:vi|country:gu|country:mp&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetchingCity = false
        }, response => {
          this.isFetchingCity = false
        })
    }, 500),
    fillDataCity (option) {
      if (option && option.place_id) {
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
          .then(({ data }) => {
            this.sessionToken = uuidv4()
            this.county = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
            this.state = data.result.address_components.filter(n => n.types.indexOf('administrative_area_level_1') > -1)[0].short_name
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                } else if (myRe.test(item)) {
                  switch (item) {
                    case 'post-office-box':
                      // this.postOfficeBox = arr[index + 1]
                      break
                    case 'street-address':
                      this.street = arr[index + 1]
                      break
                    case 'locality':
                      this.city = arr[index + 1]
                      break
                    case 'region':
                      this.state = arr[index + 1]
                      break
                    case 'postal-code':
                      this.zip = arr[index + 1]
                      break
                  }
                }
              })
          })
      }
    },
    ...mapMutations('requests', ['update'])
  }
}
</script>
