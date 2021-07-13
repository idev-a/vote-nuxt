<template>
  <div class="section">
    <h1 class="title">{{$t('envelopes.title')}}</h1>
    <h3 class="subtitle is-4">{{$t('envelopes.intro')}}</h3>
    <p class="help">{{$t('envelopes.help')}}</p>
    <h3 class="subtitle is-4">{{$t('envelopes.usSize')}}</h3>
    <ul>
      <li><a title="FPCA Postage-Paid Envelope" href="/envelopes/fpca_envelope.pdf" target="_blank">{{$t('envelopes.fpcaEnvelope')}}</a></li>
      <li><a title="FWAB Postage-Paid Envelope" href="/envelopes/fwab_envelope.pdf" target="_blank">{{$t('envelopes.ballotReturnEnvelope')}}</a></li>
      <li><a title="FWAB Security Envelope" href="/envelopes/fwabsecenv.pdf" target="_blank">{{$t('envelopes.securityEnvelope')}}</a></li>
    </ul>

    <h3 class="subtitle is-4">{{$t('envelopes.euSize')}}</h3>

    <ul>
      <li><a title="FPCA Postage-Paid Envelope" href="/envelopes/fpca_envelopeC4.pdf" target="_blank">{{$t('envelopes.fpcaEnvelope')}}</a></li>
      <li><a title="FWAB Postage-Paid Envelope" href="/envelopes/fwab_envelopeC4.pdf" target="_blank">{{$t('envelopes.ballotReturnEnvelope')}}</a></li>
    </ul>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
