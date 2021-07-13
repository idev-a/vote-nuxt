<template>
  <div class="field">
    <vfa-basic-label
      :label="label"
      :fieldName="fieldName"
      @toggleInfo="toggleInfo"></vfa-basic-label>
    <b-field :type="fieldType" :message="fieldMessages">
      <b-input
        key="input"
        icon="lock"
        :ref="fieldName"
        :id="fieldName"
        :placeholder="loading ? $t('auth.sendingCode') : $t(`request.${fieldName}.placeholder`)"
        :maxlength="6"
        :minlength="6"
        size="is-medium"
        max=999999
        pattern="[0-9]{6}"
        type="tel"
        :loading="loading"
        @input="val => $emit('input', val)"
        @keyup.native.enter="$emit('pressEnter')"></b-input>
    </b-field>
  </div>
</template>

<script>
import fieldMixin from '~/mixins/fieldMixin.js'
export default {
  name: 'CodeInput',
  mixins: [fieldMixin],
  props: ['loading', 'v', 'loginType', 'phoneOrEmail'],
  data () {
    return {
      code: ''
    }
  },
  computed: {
    email () { return this.$store.state.userauth.user.emailAddress || '' },
    phone () { return this.$store.state.userauth.user.mobileIntFormat || '' },
    label () { return this.loginType === 'sms' ? this.$t(`request.codeInput.label-sms`, {phone: this.phone || this.phoneOrEmail}) : this.$t(`request.codeInput.label-email`, {email: this.email || this.phoneOrEmail}) }
  }
}
</script>

<style>

</style>
