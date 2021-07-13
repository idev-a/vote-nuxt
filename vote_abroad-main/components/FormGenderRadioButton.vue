<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field
    :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.sex.messages.${x}`, {state: 'Idaho' })) : '' "
    :type="(validations.$error ? 'is-danger': '')">
    <b-field grouped group-multiline>
      <p class="control">
        <a
          @click="() => {sex = (sex === 'female' ? null : 'female'); $ga.event('formAction', 'focus/select', 'sex')}"
          :class="[baseClass, {'is-success': sex === 'female'}]">
          <span v-show="sex === 'female'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.female')}}
          </span>
        </a>
      </p>
      <p class="control">
        <a
          @click="() => {sex = (value === 'male' ? null : 'male'); $ga.event('formAction', 'focus/select', 'sex')}" :class="[baseClass, {'is-success': sex === 'male'}]">
          <span v-show="sex === 'male'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.male')}}
          </span>
        </a>
      </p>
      <p class="control" v-if="state !== 'ID'">
        <a @click="() => {sex = (sex === 'decline' ? null : 'decline'); $ga.event('formAction', 'focus/select', 'sex')}" :class="[baseClass, {'is-success': sex === 'decline'}]">
          <span v-show="sex === 'decline'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.decline')}}
          </span>
        </a>
      </p>
    </b-field>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Gender',
  props: [
    'label',
    'value',
    'state',
    'tooltipTitle',
    'validations'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      },
      isOpen: false
    }
  },
  computed: {
    sex: {
      get () { return this.getCurrent.sex || null },
      set (value) { this.$store.commit('requests/update', {sex: value}) }
    },
    ...mapGetters('requests', ['getCurrent'])
  },
  methods: {
    setVal: function (val) {
      // this.$emit('input', val)
      this.$store.commit('requests/update', {sex: val})
    }
  }
}
</script>

