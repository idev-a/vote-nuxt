<template>
  <section>
    <div>
      <h3 class="title is-3">{{ $t('request.sig.specialInstructions', {state: state}) }}</h3>
      <b-message type="is-warning" :active="true" :closable="false" has-icon>
        {{ $t(`request.deadlineLanguage.${state.toLowerCase()}Special`)}}
      </b-message>
      <b-field>
        <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
      </b-field>
    </div>
  </section>
</template>

<script>
import fileSaver from 'file-saver'

export default {
  props: ['state', 'value', 'msPdf', 'firstName', 'lastName'],
  computed: {
    specialSubmissionRules () {
      return /AR|CT|NJ|NY|TX|VT|WY/.test(this.state)
        ? `${this.$t(`request.deadlineLanguage.${this.state.toLowerCase()}Special`)}`
        : ''
    }
  },
  methods: {
    saveFile: function () {
      fileSaver.saveAs(this.msPdf, `${this.firstName}-${this.lastName}-${new Date().getFullYear()}-fpca.pdf`)
      this.confirmPdfDownload()
    },
    confirmPdfDownload () {
      this.$store.dispatch('requests/updateRequest', {status: 'formDownloaded'})
      this.$store.commit('requests/update', {status: 'formDownloaded'})
      this.$toast.open({
        message: this.md(this.$t('request.fpcaDownload.downloadedAlertMessage')),
        type: 'is-success',
        duration: 7000
      })
      this.$router.push(this.localePath('dashboard'))
    }
  }
}
</script>

<style>

</style>
