<template>
<b-field :label="label"
  type='is-danger'
  :message="validations.$error ? $t(`request.isRegistered.messages.required`) : ''">
  <b-field grouped
    group-multiline>
    <p class="control">
      <button
        @click.prevent="isRegistered = 'registered'"
        :class="[baseClass, {'is-success': registered}]">
        <span v-show="registered" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.yes')}}
        </span>
      </button>
    </p>
    <p class="control">
      <button
        @click.prevent="isRegistered = 'notRegistered'; $ga.event('formAction', 'focus/select', 'isRegistered')"
        :class="[baseClass, {'is-success': notRegistered}]">
        <span v-show="notRegistered" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.no')}}
        </span>
      </button>
    </p>
    <p class="control">
      <button
        @click.prevent="isRegistered = 'unsure'; $ga.event('formAction', 'focus/select', 'isRegistered')"
        :class="[baseClass, {'is-success': unsure}]">
        <span v-show="unsure" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.unsure')}}
        </span>
      </button>
    </p>
  </b-field>
</b-field>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Is-Registered',
  props: [
    'label',
    'value',
    'jurisdiction',
    'jurisdictionType',
    'validations'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      }
    }
  },
  methods: {
    ...mapMutations('requests', ['update'])
  },
  computed: {
    isRegistered: {
      get () { return this.getCurrent.isRegistered },
      set (val) {
        this.update({isRegistered: this.isRegistered === val ? null : val})
        this.$emit('delayTouch')
      }
    },
    registered: function () { return this.isRegistered === 'registered' },
    notRegistered: function () { return this.isRegistered === 'notRegistered' },
    unsure: function () { return this.isRegistered === 'unsure' },
    ...mapGetters('requests', ['getCurrent'])
  }
}
</script>

