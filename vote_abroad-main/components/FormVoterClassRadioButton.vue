<template>
  <div class="field">
      <b-field :label="$t('request.voterClass.civilianOrMilitary')"
        type='is-danger'
        :message="!isCivilianType && !isMilitaryType  && validations.$error ? $t(`request.voterClass.messages.typeRequired`) : ''">
        <b-field grouped group-multiline>
          <p class="control">
            <button
              @click.prevent="voterClass = 'civilianType'"
              :class="[baseClass, {'is-success': isCivilianType}]">
              <span v-show="isCivilianType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.civilianType')}}
              </span>
            </button>
          </p>
          <p class="control">
            <button
              @click.prevent="voterClass = 'militaryType'"
              :class="[baseClass, {'is-success': isMilitaryType}]">
              <span v-show="isMilitaryType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.militaryType')}}
              </span>
            </button>
          </p>
        </b-field>
      </b-field>

      <div class="field">
        <span class="is-flex">
          <label class="label">
            {{ isMilitaryType ? $t('request.voterClass.whatMilType') : $t('request.voterClass.whatCivType') }}
          </label>
          <span
            @click.prevent="isOpen = !isOpen; $ga.event('formAction', 'focus/select', 'voterClass')"
            class="icon has-text-info"
            style="cursor: pointer;">
            <i class="fas fa-info-circle"></i>
          </span>
        </span>
        <p v-if="isCivilianType  && validations.$error" class="help is-danger">{{ $t(`request.voterClass.messages.civilianRequired`) }}</p>
        <p v-if="isMilitaryType  && validations.$error" class="help is-danger">{{ $t(`request.voterClass.messages.militaryRequired`) }}</p>
      <!-- <b-field disabled :label="isMilitaryType ? 'What type of military voter are you?' : 'Which best describes you?'"> -->
        <b-field grouped group-multiline>
          <p class="control" v-show="isMilitaryType">
            <button
              @click.prevent="voterClass = 'military'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isMilitary}]">
              <span v-show="isMilitary" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.military')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button
              @click.prevent="voterClass = 'milSpouse'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isMilSpouse}]">
              <span v-show="isMilSpouse" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.milSpouse')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button
              @click.prevent="voterClass = 'natGuard'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isNatGuard}]">
              <span v-show="isNatGuard" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.natGuard')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button
              @click.prevent="voterClass = 'uncertainReturn'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isUncertainReturn}]">
              <span v-show="isUncertainReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.uncertainReturn')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button
              @click.prevent="voterClass = 'intendToReturn'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isIntendToReturn}]">
              <span v-show="isIntendToReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.intendToReturn')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType" v-if="allowsNeverResided">
            <button
              @click.prevent="voterClass = 'neverResided'; $ga.event('formAction', 'focus/select', 'voterClass')"
              :class="[baseClass, {'is-success': isNeverResided}]">
              <span v-show="isNeverResided" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.neverResided')}}
              </span>
            </button>
          </p>
        </b-field>
        <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
          <slot name="tooltip"></slot>
        </b-message>
      </div>
    <!-- </section> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Voter-Class',
  props: [
    'label',
    'value',
    'state',
    'toolTipTitle',
    'allowsNeverResided',
    'validations'
  ],
  data () {
    return {
      milOrCiv: '',
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      },
      isOpen: false
    }
  },
  methods: {
    ...mapMutations('requests', ['update'])
  },
  computed: {
    voterClass: {
      get () { return this.getCurrent.voterClass },
      set (val) {
        if (/civilianType|militaryType/.test(val)) {
          this.milOrCiv = val
          this.$emit('delayTouch')
          this.update({voterClass: ''})
        } else this.update({voterClass: val})
      }
    },
    isMilitaryType: function () { return this.isMilitary || this.isMilSpouse || this.isNatGuard || this.milOrCiv === 'militaryType' },
    isCivilianType: function () { return this.isUncertainReturn || this.isIntendToReturn || this.isNeverResided || this.milOrCiv === 'civilianType' },
    isMilitary: function () { return this.voterClass === 'military' },
    isMilSpouse: function () { return this.voterClass === 'milSpouse' },
    isNatGuard: function () { return this.voterClass === 'natGuard' },
    isUncertainReturn: function () { return this.voterClass === 'uncertainReturn' },
    isIntendToReturn: function () { return this.voterClass === 'intendToReturn' },
    isNeverResided: function () {
      return this.allowsNeverResided ? this.voterClass === 'neverResided' : ''
    },
    ...mapGetters('requests', ['getCurrent'])
  },
  watch: {
    voterClass: function (newVal, oldVal) {
      if (this.state && this.state === 'VA' && newVal && newVal !== 'uncertainReturn') {
        this.update({
          stateSpecial: null
        })
      }
    }
  }
}
</script>

