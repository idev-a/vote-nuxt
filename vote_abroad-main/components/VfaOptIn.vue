<template>
  <div class="card">
    <div class="card-content">
      <!-- <h3 class="subtitle is-5">Vote From Abroad helps US citizens register to vote quickly and easily, but to do so we need to collect your personal information. Your data privacy is our top concern, so please read and accept our <nuxt-link :to="privacyPage" class="has-text-primary">privacy policy</nuxt-link>, <nuxt-link :to="cookiePage" class="has-text-primary">cookie policy</nuxt-link> and <nuxt-link :to="tosPage" class="has-text-primary">terms of service.</nuxt-link> </h3> -->
      <i-18n path="optIn.optIn" tag="h3" class="subtitle is-5 is-size-6-mobile">
        <nuxt-link place="privacyPolicy" :to="localePath({ name: 'page', params: {page: 'privacy'}})" class="has-text-warning">{{$t('optIn.privacyPolicy')}}</nuxt-link>
        <nuxt-link place="cookiePolicy" :to="localePath({ name: 'page', params: {page: 'cookie-policy'}})" class="has-text-warning">{{ $t('optIn.cookiePolicy') }}</nuxt-link>
        <nuxt-link place="termsOfUse" :to="localePath({ name: 'page', params: {page: 'terms-of-use'}})" class="has-text-warning">{{ $t('optIn.termsOfUse') }}</nuxt-link>
      </i-18n>
      <!-- <b-field
        grouped
        position="is-centered">
        <b-checkbox :class="isDirty && !tos ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="tos" required type="is-vfa">Terms of Service</b-checkbox>
        <nuxt-link :to="tosPage" class="button is-vfa is-inverted is-small">
          (Read)
        </nuxt-link>
      </b-field>
      <b-field grouped position="is-centered">
        <b-checkbox :class="isDirty && !privacy ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="privacy" required type="is-vfa">Privacy Policy</b-checkbox>
        <nuxt-link :to="privacyPage" class="button is-vfa is-inverted is-small">
          (Read)
        </nuxt-link>
      </b-field>
      <b-field grouped position="is-centered">
        <b-checkbox :class="isDirty && !cookie ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="cookie" required type="is-vfa">Cookie Policy</b-checkbox>
        <nuxt-link :to="cookiePage" class="button is-vfa is-inverted is-small">
          (Read)
        </nuxt-link>
      </b-field>

      <p v-if="isError" class="help has-text-centered has-text-danger">You must agree to the terms to use VoteFromAbroad.</p> -->
      <b-field grouped position="is-right">
          <p class="control">
              <button
                @click="$emit('optIn')"
                class="button is-vfa">{{ $t('optIn.agree') }}</button>
          </p>
      </b-field>
    </div>
  </div>
</template>

<script>

export default {
  props: ['privacyPage', 'cookiePage', 'tosPage'],
  data () {
    return {
      privacy: false,
      tos: false,
      cookie: false,
      isDirty: false
    }
  },
  computed: {
    isError () { return this.isDirty && (!this.privacy || !this.tos || !this.cookie) }
  },
  methods: {
    optIn: function () {
      this.isDirty = true
      if (!this.isError) this.$emit('optIn')
    }
  }

}
</script>

<style>

</style>
