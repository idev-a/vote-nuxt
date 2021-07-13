<template>
  <div>
    <!-- <h3 class="title is-3">I swear or affirm, under penalty of perjury that:</h3> -->
    <div class="content" v-html="affirmation"></div>
    <div class="field is-grouped">
      <p class="control is-expanded">
        <button @click.prevent="$emit('input', null)" class="button is-fullwidth">{{$t('request.sig.disagree')}}</button>
      </p>
      <p class="control is-expanded">
        <button @click.prevent="$emit('input', 'addSignature')" class="button is-success is-fullwidth">{{$t('request.sig.agree')}}</button>
      </p>
    </div>
  </div>
</template>

<script>
import snarkdown from 'snarkdown'

export default {
  props: ['value'],
  computed: {
    affirmation () { return snarkdown(this.$t('request.sig.signatureAffirmation')) }
  }
}
</script>

<style>

</style>
