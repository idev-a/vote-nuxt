<template>
  <div class="field">
    <span class="is-flex"><label class="label">{{ label }}</label><span v-if="idOptions" class="has-text-weight-light">&nbsp;({{$t('request.field.req')}})</span><span v-else>&nbsp;({{$t('request.field.opt')}})</span><span @click.prevent="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <br/>

        <!-- :message="validations.ssn.$anyError ? $t(`request.id.messages.fullSSNRequired`) : '' " -->
    <b-field v-if="idOptions && idOptions.includes('SSN')"
        :label="$t('request.id.SSN')"
        label-for="ssn"
      :message="validations.ssn.$anyError ? Object.entries(validations.ssn).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.id.messages.ssn-${x[0]}`)) : '' "
        :type="(validations.ssn.$anyError ? 'is-danger': '')">
      <b-input
        id="ssn"
        ref="ssn"
        v-model="ssn"
        type="tel"
        v-mask="'###-##-####'"
        :placeholder="$t('request.id.placeholder', {example: '123-45-6789'})">
      </b-input>
    </b-field>

    <div v-if="idOptions && idOptions.includes('SSN') && idOptions.includes('SSN4')" class="has-text-centered"><strong>{{ $t('request.id.or')}}</strong></div>

      <!-- :message="validations.ssn4.$anyError ? $t(`request.id.messages.SSN4Required`) : '' " -->
    <b-field v-if="!idOptions || (idOptions && (idOptions.length === 0 || idOptions.includes('SSN4')))"
      :message="validations.ssn4.$anyError ? Object.entries(validations.ssn4).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.id.messages.ssn4-${x[0]}`)) : '' "
      :type="(validations.ssn4.$anyError ? 'is-danger': '')"
      :label="$t('request.id.SSN4')"
      label-for="ssn4">
      <b-input
        v-mask="'✱✱✱-✱✱-####'"
        id="ssn4"
        type="tel"
        ref="ssn4"
        v-model="ssn4"
        :placeholder="$t('request.id.placeholder', {example: '✱✱✱-✱✱-1111'})" expanded></b-input>
    </b-field>

    <div class="has-text-centered"
      v-if="!idOptions || (idOptions && (idOptions.length === 0 || idOptions.filter(x => !/SSN/.test(x)).length > 0))"><strong>{{ $t('request.id.or')}}</strong></div>

      <!-- :message="validations.stateId.$anyError ? $t(`request.id.messages.stateIdRequired`) : '' " -->
    <b-field v-if="!idOptions || (idOptions && (idOptions.length === 0 || idOptions.filter(x => !/SSN/.test(x)).length > 0))"
      :message="validations.stateId.$anyError ? Object.entries(validations.stateId).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.id.messages.stateId-${x[0]}`)) : '' "
      :type="(validations.stateId.$anyError ? 'is-danger': '')"
      :label="stateIdLabel"
      label-for="stateId">
      <b-input id="stateId"
        v-model="stateId"
        maxlength="25"
        ref="StateId">
      </b-input>
    </b-field>

    <div class="field">
      <b-checkbox v-model="noId" ref="noId">
        <span v-if="idOptions && idOptions.length === 1">{{$t('request.id.noid1', {id: $t(`request.id.${idOptions[0].includes('SSN') ? 'SSN' : idOptions[0]}`)})}}</span>
        <span v-else>{{$t('request.id.noid2')}}</span>
      </b-checkbox>
    </div>

    <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
      <slot name="tooltip"></slot>
    </b-message>

  </div>
</template>

<script>
import {mask, TheMask} from 'vue-the-mask'
export default {
  name: 'id-input',
  directives: {mask},
  components: {TheMask},
  props: [
    'label',
    'value',
    'tooltipTitle',
    'idOptions',
    'validations'
  ],
  data () {
    return {
      toolTipOpen: false,
      temp: undefined
    }
  },
  computed: {
    ssn: {
      get () { return this.value && this.value.ssn ? this.value.ssn : null },
      set (val) { this.update({ssn: val}) }
    },
    ssn4: {
      get () { return this.value && this.value.ssn4 ? this.value.ssn4 : null },
      set (val) { this.update({ssn4: val}) }
    },
    stateId: {
      get () { return this.value && this.value.stateId ? this.value.stateId : null },
      set (val) { this.update({stateId: val}) }
    },
    noId: {
      get () { return this.value && this.value.noId ? this.value.noId : false },
      set (val) {
        if (val) {
          this.temp = this.value
          this.$emit('input', {
            ssn: null,
            ssn4: null,
            stateId: null,
            noId: true
          })
        } else {
          this.$emit('input', this.temp)
          this.temp = undefined
        }
        // this.update({noId: val})
      }
    },
    usesStateId: function () { return Boolean(this.stateIDTypes && this.stateIDTypes.length > 0) },
    stateIDTypes: function () {
      if (!this.idOptions) {
        return null
      }
      return this.idOptions.filter(opt => opt !== 'SSN4' && opt !== 'SSN')
    },
    stateIdLabel: function () {
      return !this.usesStateId
        ? this.$t('request.id.StateID')
        : this.stateIDTypes.reduce((label, cur, i, arr) => {
          if (i === 0) {
            return label + this.$t(`request.id.${cur}`)
          } else if (i === arr.length - 1) {
            return `${label} ${this.$t('request.id.or')} ${this.$t(`request.id.${cur}`)}`
          } else {
            return `${label}, ${this.$t(`request.id.${cur}`)}`
          }
        }, '')
    }
  },
  methods: {
    update (val) {
      // console.log(val)
      let newVal = Object.assign({}, this.value, val)
      if (Object.keys(val).includes('ssn') && val.ssn) { newVal.ssn4 = null; newVal.noId = false }
      if (Object.keys(val).includes('ssn4') && val.ssn4) { newVal.ssn = null; newVal.noId = false }
      if (Object.keys(val).includes('stateId') && val.stateId) { newVal.ssn = null; newVal.noId = false }
      // if (val.noId) {
      //   this.temp = this.value
      //   newVal.ssn4 = null
      //   newVal.ssn = null
      //   newVal.stateId = null
      // }
      // if (Object.keys(val).includes('noId') && val.noId === false && this.temp) { newVal = Object.assign({}, this.temp); this.temp = undefined }
      // console.log('fin', newVal)
      this.$emit('input', newVal)
    }
  }
}
</script>
