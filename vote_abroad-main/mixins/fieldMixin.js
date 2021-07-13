import { mapMutations, mapGetters } from 'vuex'
import snarkdown from 'snarkdown'
import VfaBasicLabel from '~/components/VfaBasicLabel'

export default {
  props: {
    fieldName: {
      type: String,
      required: false
    },
    v: { }
  },
  components: {
    VfaBasicLabel
  },
  data () {
    return {
      isInfoOpen: false
    }
  },
  computed: {
    requiredClass: function () {
      return {
        'hide': Boolean(this.fieldValue || (this.v && this.v.$error)),
        'is-required': this.v && this.v.required !== undefined,
        'is-optional': this.v && this.v.required === undefined
      }
    },
    autoComplete () {
      switch (this.fieldName) {
        case 'firstName':
          return 'given-name'
        case 'middleName':
          return 'additional-name'
        case 'lastName':
          return 'family-name'
        case 'suffix':
          return 'honorific-suffix'
        default:
          break
      }
    },
    fieldValue: {
      get () {
        return this.getCurrent ? this.getCurrent[this.fieldName] : ''
      },
      set (val) { this.update({ [this.fieldName]: val || null }) }
    },
    maxLength () {
      let max = this.v && this.v.$params.maxLength ? this.v.$params.maxLength.max : 0
      if (max) return (this.fieldValue && !this.v.$dirty) || (this.v && this.v.$error) || (this.fieldValue && this.fieldValue.length > max - 6) ? max.toString() : ''
    },
    fieldType () {
      return this.v && this.v.$error ? 'is-danger' : ''
    },
    fieldMessages () { return this.v && this.v.$error ? Object.entries(this.v).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => this.$t(`request.${this.fieldName}.messages.${x[0]}`)) : '' },
    toolTipTitle () { return this.$te(`request.${this.fieldName}.tooltipTitle`) ? this.$t(`request.${this.fieldName}.tooltipTitle`) : null },
    toolTipContent () { return this.$te(`request.${this.fieldName}.tooltip`) ? snarkdown(this.$t(`request.${this.fieldName}.tooltip`)) : null },
    ...mapGetters('requests', ['getCurrent'])
  },
  methods: {
    toggleInfo () { this.isInfoOpen = !this.isInfoOpen },
    ...mapMutations('requests', ['update'])
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  }
}
