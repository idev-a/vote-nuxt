<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}<span v-if="ballotReceiptOptions.includes('Email')" class="is-size-7 has-text-info has-text-weight-semibold has-text-centered" style="margin-left: 10px; padding-bottom: 2px;">{{$t('request.receiveBallot.emailRecommended')}}</span></label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <p v-if="validations.$error" class="help is-danger">{{ $t(`request.receiveBallot.messages.required`) }}</p>
  <b-field grouped group-multiline>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Email') > -1">
      <button
        @click.prevent="recBallot = 'email'; $ga.event('formAction', 'focus/select', 'recBallot')"
        :class="[baseClass, {'is-success': email}]">
        <span v-show="email" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.email')}}
        </span>
      </button>
    </p>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Mail') > -1">
      <button
        @click.prevent="recBallot = 'mail'; $ga.event('formAction', 'focus/select', 'recBallot')"
        :class="[baseClass, {'is-success': mail}]">
        <span v-show="mail" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.mail')}}
        </span>
      </button>
    </p>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Fax') > -1">
      <button
        @click.prevent="recBallot = 'fax'; $ga.event('formAction', 'focus/select', 'recBallot')"
        :class="[baseClass, {'is-success': fax}]">
        <span v-show="fax" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.fax')}}
        </span>
      </button>
    </p>
  </b-field>
  <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Receive-Ballot',
  props: [
    'label',
    'value',
    'toolTipTitle',
    'ballotReceiptOptions',
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
  methods: {
    ...mapMutations('requests', ['update'])
  },
  computed: {
    recBallot: {
      get () { return this.getCurrent.recBallot },
      set (val) { this.update({recBallot: this.recBallot === val ? null : val}) }
    },
    email: function () { return this.value === 'email' },
    mail: function () { return this.value === 'mail' },
    fax: function () { return this.value === 'fax' },
    ...mapGetters('requests', ['getCurrent'])
  }
}
</script>

