<template>
  <div class="field"><br/>
  <!-- AK -->
    <div v-if="state === 'AK' && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.akRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.akRules.tooltip')}}</vue-markdown> -->
      </b-message>
      {{$t('request.akRules.resInstructions')}}
      <b-field :label="$t('request.akRules.label')">
        <b-input v-model="scratch" @input="(val) => setVal(`I will provide the following proof of Alaska Residency: ${val}`)"></b-input>
      </b-field>
      <!-- <div v-if="isFWAB">
        {{$t('request.akRules.fwabWitness')}}
      </div> -->
    </div>
  <!-- AZ -->
    <div v-if="state === 'AZ' && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.azRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.azRules.tooltip')}}</vue-markdown> -->
      </b-message>
      {{$t('request.azRules.citInstructions')}}
      <b-field :label="$t('request.azRules.label')">
        <b-input v-model="scratch" @input="(val) => setVal(`I will provide the following proof of citizenship: ${val}`)"></b-input>
      </b-field>
    </div>
  <!-- OK -->
    <div v-if="state === 'OK' && isIndNoParty">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.okRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.okRules.tooltip')}}</vue-markdown> -->
      </b-message>
      <span v-html="md($t('request.okRules.primaryInstructions'))"></span>
      <b-field :label="$t('request.okRules.label')">
        <b-input v-model="scratch" @input="(val) => setVal(`I request to be able to vote in the following party primary: ${val}`)"></b-input>
      </b-field>
    </div>
  <!-- PR -->
    <div v-if="state === 'PR'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.prRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.prRules.tooltip')}}</vue-markdown> -->
      </b-message>
      {{ $t('request.prRules.parentsInstructions')}}
      <b-field>
        <b-input v-model="scratch" @input="val => setVal(`My father and mother's first names: ${val}`)" :label="$t('request.prRules.parentsInstructions')"></b-input>
      </b-field>
    </div>
  <!-- SC -->
    <div v-if="state === 'SC'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.scRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.scRules.tooltip')}}</vue-markdown> -->
      </b-message>
      {{$t('request.scRules.raceInstructions')}} {{$t('request.scRules.prevRegInstructions')}}
      <b-field :label="$t('request.scRules.label')">
        <b-input @keydown.native.enter.prevent="$refs.scPrev.focus()" v-model="scRace" @input="setVal(scVal)"></b-input>
      </b-field>
      <!-- Your previous state of registration (if any) -->
      <b-field :label="$t('request.scRules.prevRegLabel')">
        <b-input ref="scPrev" v-model="scPrev" @input="setVal(scVal)"></b-input>
      </b-field>
    </div>
  <!-- VA -->
    <div v-if="state === 'VA' && isReturnUncertain">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.vaRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.vaRules.tooltip')}}</vue-markdown> -->
      </b-message>
      <b-field :label="$t('request.vaRules.label')">
      <!-- {{$t('request.vaRules.employerInstructions')}} -->
        <b-input v-model="scratch" @input="(val) => setVal(`The name of your employer or the name of your spouse's or parent/guardian's employer: ${val}`)"></b-input>
      </b-field>
    </div>
  <!-- VT -->
    <div v-if="state === 'VT'  && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-field :label="$t('request.vtRules.label')">
        {{$t('request.vtRules.oathInstructions')}}
        <b-input @input="val => setVal(val)" :value="value"></b-input>
      </b-field>
      <b-message :title="$t('request.stateSpecial.tooltipTitle')" type="is-info" has-icon :active.sync="isOpen">
        <p v-html="$options.filters.markdown($t('request.vtRules.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.vtRules.tooltip')}}</vue-markdown> -->
      </b-message>
    </div>
  </div>
</template>

<script>
import snarkdown from 'snarkdown'

export default {
  name: 'State-Special',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    // isFWAB: {
    //   type: Boolean,
    //   default: false
    // },
    isIndNoParty: {
      type: Boolean,
      default: false
    },
    isReturnUncertain: {
      type: Boolean,
      default: false
    },
    isRegistering: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.value) {
      switch (this.state.toLowerCase()) {
        case 'vt':
          if (!this.isRegistering) {
            this.setVal(null)
          } else {
            this.scratch = this.value
          }
          break
        case 'va':
          if (!this.isReturnUncertain) {
            this.setVal(null)
          } else {
            this.scratch = this.value.length > 85 ? this.value.slice(86, this.value.length + 1) : ''
          }
          break
        case 'sc':
          this.scRace = /Race: (.*) -- /.test(this.value) ? /Race: (.*) -- /.exec(this.value)[1] : ''
          this.scPrev = /I was formerly registered in: /.test(this.value) ? /I was formerly registered in: (.*)/.exec(this.value)[1] : ''
          break
        case 'pr':
          this.scratch = this.value.length > 35 ? this.value.slice(36, this.value.length + 1) : ''
          break
        case 'ok':
          if (!this.isIndNoParty) {
            this.setVal(null)
          } else this.scratch = this.value.length > 60 ? this.value.slice(61, this.value.length + 1) : ''
          break
        case 'az':
          if (!this.isRegistering) {
            this.setVal(null)
          } else this.scratch = this.value.length > 51 ? this.value.slice(52, this.value.length + 1) : ''
          break
        case 'ak':
          if (!this.isRegistering) {
            this.setVal(null)
          } else this.scratch = this.value.length > 55 ? this.value.slice(56, this.value.length + 1) : ''
          break
        default:
          break
      }
    }
  },
  computed: {
    scVal () {
      // return this.scRace ? `Race ${this.scRace}` : '' + this.scRace && this.scPrev ? ', ' : '' + this.scPrev ? `I was formerly registered in ${this.scPrev}` : ''
      return `${this.scRace ? 'Race:' + ' ' : ''}${this.scRace + ' -- ' || ''}${this.scPrev ? 'I was formerly registered in:' : ''} ${this.scPrev || ''}`
    }
  },
  data () {
    return {
      scRace: '',
      scPrev: '',
      scratch: '',
      isOpen: false
    }
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  },
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    },
    md: function (md) {
      return snarkdown(md)
    }
  }
}
</script>
