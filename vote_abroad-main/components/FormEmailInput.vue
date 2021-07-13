<template>
<div class="field">
  <vfa-basic-label :fieldName="fieldName"></vfa-basic-label>
  <b-field
    v-if="typeof fieldValue === 'string' || fieldValue === null || fieldValue === undefined"
    :type="fieldType"
    :message="fieldMessages">
    <!-- :message="v.$error ? Object.entries(v).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.${fieldName}.messages.${x[0]}`)) : '' "> -->
    <b-field
      :type="fieldType">
      <a @click.prevent="$el.querySelector('input').focus()"
        :class="['button', 'is-static', 'control']">
        <b-icon
          pack="fas"
          icon="at">
        </b-icon>
      </a>
      <b-input v-model="fieldValue"
        expanded
        :class="requiredClass"
        :id="fieldName"
        :placeholder="placeholderAddress"
        :autocomplete="autoComplete"
        :maxlength="maxLength"
        @input="() => { $emit('input'); $emit('delayTouch', v) }"
        @focus="$ga.event('formAction', 'focus/select', fieldName)"
        :ref="fieldName"></b-input>
    </b-field>
  </b-field>
  <i18n tag="span" path="request.email.messages.didYouMean" v-if="mailcheck && mailcheck !== fieldValue.toLowerCase()" class="help is-vfa">
    <a @click="fieldValue = mailcheck" class="has-text-primary">{{ mailcheck }}</a>
  </i18n>
  <!-- <span v-if="mailcheck && mailcheck !== fieldValue.toLowerCase()" class="help is-vfa">Did you mean <a @click="fieldValue = mailcheck"><span class="has-text-primary">{{ mailcheck }}</span></a>?</span> -->
</div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import fieldMixin from '~/mixins/fieldMixin.js'
import { randomPresAddress } from '~/utils/helpers'

export default {
  name: 'EmailInput',
  mixins: [fieldMixin],
  computed: {
    placeholderAddress () { return this.$t('request.email.placeholder', {example: randomPresAddress()}) },
    mailcheck () { return this.mailCheck(this.fieldValue) },
    ...mapGetters('requests', ['getCurrent']),
    ...mapGetters('data', ['mailCheck'])
  },
  methods: {
    ...mapMutations('requests', ['update'])
  }

}
</script>

<style>

</style>
