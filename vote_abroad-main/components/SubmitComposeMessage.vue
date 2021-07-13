<template>
  <div>
    <h3 class="title is-3">{{ $t("request.sig.sendTitle") }}</h3>
    <p>{{ $t("request.sig.sendInstructions") }}</p>
    <!-- <ol>
      <li>Type a message to include with your email to your local election official.  We will attach your completed, signed and dated form. Click send to send the email. We will also send a copy to your email address for your records.</li>
    </ol>-->
    <section>
      <b-field horizontal :label="$t('request.sig.subject')">
        <b-input v-model="subject" name="subject" :disabled="isMailing === true" expanded></b-input>
      </b-field>

      <b-field horizontal :label="$t('request.sig.from')">
        <b-field>
          <b-input
            v-model="fromName"
            name="name"
            :placeholder="$t('request.sig.name')"
            :disabled="isMailing === true"
            expanded
          ></b-input>
        </b-field>
        <b-field>
          <b-input
            v-model="formEmail"
            ref="userEmail"
            name="email"
            type="email"
            :placeholder="$t('request.email.label')"
            :disabled="!!email"
            required
            expanded
          ></b-input>
        </b-field>
      </b-field>

      <b-field horizontal :label="$t('request.sig.to')">
        <b-input
          :value="leoName"
          name="LeoName"
          :placeholder="$t('request.sig.to')"
          disabled
          expanded
        ></b-input>
        <b-input
          :value="leoEmail"
          name="LeoEmail"
          type="email"
          placeholder="election@example.com"
          disabled
          expanded
        ></b-input>
      </b-field>

      <b-field horizontal :label="$t('request.sig.message')">
        <b-input v-model="message" :disabled="isMailing === true" type="textarea" rows="12"></b-input>
      </b-field>

      <!-- <button class="button is-primary is-medium is-fullwidth" @click="sendEmail">
        Send Email
      </button>-->

      <b-field horizontal>
        <b-field grouped>
          <b-field>
            <button
              :class="[
                'button',
                'is-light',
                'is-medium',
                { 'is-loading': isMailing }
              ]"
              @click="$emit('input', null)"
            >{{ $t("request.sig.cancel") }}</button>
          </b-field>
          <b-field expanded>
            <button
              :class="[
                buttonClass,
                'is-fullwidth',
                { 'is-loading': isMailing }
              ]"
              @click.prevent="sendEmail"
            >{{ $t("request.sig.sendEmail") }}</button>
          </b-field>
        </b-field>
      </b-field>
    </section>
    <section class="section">
      <b-field v-if="documentRequired" horizontal :label="$t('request.sig.attachments')">
        <b-upload
          accept="image/jpeg, image/gif, image/png, application/pdf"
          v-if="dropFiles.length === 0"
          @input="attachReqDoc"
          v-model="dropFiles"
          drag-drop
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>
                {{
                  /AK/.test(currentRequest.leo.s)
                    ? $t('request.sig.attachmentInstructionsSpecialAK')
                    : $t("request.sig.attachmentInstructions", {
                      document: documentRequired
                    })
                }}
                <!-- You are required to provide {{documentRequired}}. Drop your file here or click to upload. (jpg, png, gif or pdf) -->
              </p>
            </div>
          </section>
        </b-upload>
        <div v-if="dropFiles.length === 1" class="tags">
          <span v-for="(file, index) in dropFiles" :key="index" class="tag is-primary is-large">
            {{ file.name }}
            <button
              class="delete is-small"
              type="button"
              @click="deleteDropFile(index)"
            ></button>
          </span>
        </div>
      </b-field>
      <article class="media" v-if="/AR|CT|NJ|NY|WY/.test(currentRequest.leo.s)">
        <!-- TX|VT| -->
        <figure class="media-left">
          <b-icon icon="envelope" size="is-medium"></b-icon>
        </figure>
        <div class="media-content">
          <span
            class="is-size-5"
            v-html="
              md(
                $t(
                  `request.deadlineLanguage.${currentRequest.leo.s.toUpperCase()}Special`,
                  instructionsObject
                )
              )
            "
          ></span>
          <div class="box">
            <span v-if="currentRequest.leo.n">
              <strong>{{ currentRequest.leo.n }}</strong>
              <br />
            </span>
            <span v-if="currentRequest.leo.a1">
              <strong>{{ currentRequest.leo.a1 }}</strong>
              <br />
            </span>
            <span v-if="currentRequest.leo.a2">
              <strong>{{ currentRequest.leo.a2 }}</strong>
              <br />
            </span>
            <span v-if="currentRequest.leo.a3">
              <strong>{{ currentRequest.leo.a3 }}</strong>
              <br />
            </span>
            <span>
              <strong>{{ currentRequest.leo.c }},</strong>
              <strong>{{ currentRequest.leo.s }}</strong>
              <strong>{{ currentRequest.leo.z }}</strong>
              <br />
            </span>
            <span class="has-text-right">
              <strong>United States of America</strong>
              <br />
            </span>
          </div>
        </div>
      </article>

      <div class="field is-horizontal">
        <div class="field-label">
          <label v-if="!documentRequired" class="label">
            {{
            $t("request.sig.attachment")
            }}
          </label>
        </div>
        <div class="field-body">
          <figure class="field image" style="border: gray solid;">
            <img v-if="fpca" :src="fpca || null" />
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import snarkdown from 'snarkdown'

export default {
  data () {
    return {
      customEmail: '',
      message: '',
      subject: '',
      isMailing: false,
      dropFiles: [],
      reqDoc: '',
      sendWithoutDocs: false,
      buttonClass: {
        button: true,
        'is-primary': true,
        'is-medium': true,
        'is-fullwidth': true
      }
    }
  },
  computed: {
    isStudentSite () {
      return process.env.isStudentSite === 'true'
    },
    voterMessage () {
      return (
        this.$t('email.voterEmail', {
          leoEmail: this.leoEmail,
          leoName: this.leoName,
          leoPhone: this.leoPhone
        }) + this.message
      )
    },
    testMessage () {
      return (
        this.$t('email.testEmail', {
          leoEmail: this.leoEmail,
          leoName: this.leoName
        }) + this.message
      )
    },
    formEmail: {
      get () {
        return this.email || this.customEmail
      },
      set (value) {
        this.customEmail = value
      }
    },
    currentRequest () {
      return this.requests[this.currentRequestIndex]
    },
    firstName () {
      return this.currentRequest && this.currentRequest.firstName
        ? this.currentRequest.firstName
        : ' '
    },
    lastName () {
      return this.currentRequest && this.currentRequest.lastName
        ? this.currentRequest.lastName
        : ' '
    },
    email () {
      return this.currentRequest && this.currentRequest.email
        ? this.currentRequest.email.toString()
        : ''
    },
    tel () {
      return this.currentRequest &&
        this.currentRequest.tel &&
        this.currentRequest.tel.intNumber
        ? this.currentRequest.tel.intNumber
        : ''
    },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e
        ? this.currentRequest.leo.e
        : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n
        ? this.currentRequest.leo.n
        : ''
    },
    leoPhone () {
      return this.currentRequest.leo && this.currentRequest.leo.p
        ? `+1 ${this.currentRequest.leo.p}`
        : ''
    },
    fromName () {
      return `${this.firstName} ${this.lastName}`
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  },
  props: ['value', 'fpca', 'documentRequired', 'instructionsObject'],
  methods: {
    md: function (md) {
      return snarkdown(md)
    },
    attachReqDoc (files) {
      let vm = this
      if (
        files &&
        files.length > 0 &&
        files[0].name &&
        /\.(jpe?g|png|gif|pdf)$/i.test(files[0].name)
      ) {
        var reader = new FileReader()

        reader.addEventListener(
          'load',
          function () {
            // console.log(reader, this)
            vm.reqDoc = this.result
            vm.sendWithoutDocs = false
          },
          false
        )

        reader.readAsDataURL(files[0])
      }
    },
    deleteDropFile (index) {
      this.dropFiles = []
      this.reqDoc = ''
      this.sendWithoutDocs = false
    },
    sendEmail () {
      if (this.documentRequired && !this.reqDoc && !this.sendWithoutDocs) {
        this.$dialog.confirm({
          title: this.documentRequired.toLocaleUpperCase(),
          message: this.$t('request.sig.attachmentRequiredAlertMessage', {
            document: this.documentRequired
          }),
          cancelText: this.$t('request.sig.cancel'),
          confirmText: this.$t('request.sig.attachmentRequiredConfirm'),
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.sendWithoutDocs = true
            this.sendEmail()
          }
        })
      } else if (
        !this.formEmail.trim() ||
        !/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(
          this.customEmail
        )
      ) {
        this.$refs.userEmail.checkHtml5Validity()
      } else {
        this.isMailing = true
        let headers = {}
        headers['Content-Type'] = 'application/json'
        headers['Accept'] = 'application/json'
        let voterMessage = this.voterMessage
        // this.isStudentSite || process.env.CONTEXT === 'prod'
        //   ? this.voterMessage
        //   : this.testMessage
        let body = {
          subject: this.subject,
          voterEmail: this.formEmail,
          voterMessage: voterMessage,
          leoMessage: this.message,
          leoName: (this.leoName || '').replace(/[^A-Za-z\s]/g, ''),
          leoEmail: this.leoEmail,
          image: this.fpca ? this.fpca.toString() : null,
          reqDoc: this.reqDoc ? this.reqDoc.toString() : null,
          firstName: this.firstName,
          lastName: this.lastName
        }
        // Remove leoMessage when in sandbox env
        if (process.env.stage !== 'prod') {
          body.leoMessage = ''
        }
        // if (this.isStudentSite || process.env.CONTEXT === 'prod') {
        // body = Object.assign({}, body, {leoMessage: this.message})
        // console.log('body', body)
        // console.log('body', JSON.parse(body))
        // }
        // console.log(typeof this.fpca)
        axios
          .post(
            `/api/mailer${process.env.stage === 'prod' ? '' : '/dev'}`,
            body,
            {
              headers: { 'Content-Type': 'application/json' }
            }
          )
          .then(response => {
            // console.log(response.data)
            this.isMailing = false
            this.$store.commit('requests/update', { status: 'formEmailed' })
            this.$store.dispatch('requests/updateRequest', {
              status: 'formEmailed'
            })
            // if (/AR|CT|NJ|NY|TX|VT/.test(this.state)) this.$emit('input', 'specialInstructions')
            // else
            this.$ga.event('formAction', 'completed', 'email')
            this.$router.push(this.localePath('dashboard'))
            this.$toast.open({
              message: this.$t('request.sig.successMessage', {
                email: this.formEmail
              }),
              type: 'is-success'
            })
          })
          .catch(error => {
            console.log(error)
            this.isMailing = false
            this.$dialog.alert({
              title: this.$t('request.sig.failureTitle'),
              message: this.$t('request.sig.failureMessage'),
              confirmText: this.$t('request.sig.failureConfirm'),
              type: 'is-danger',
              hasIcon: true,
              icon: 'error',
              iconPack: 'fas'
            })
          })
      }
    }
  },
  mounted () {
    this.subject = 'FPCA Submission'

    this.message = `Please see attached my FPCA form for the current calendar year. ${/NY/.test(this.currentRequest.leo.s) ? 'Can you confirm receipt and I will send the original signed copy by mail.' : 'Can you confirm receipt and let me know if you need any additional information?'} \n\nThank you so much for everything you do. Your work is much appreciated by Americans abroad! \n\nSincerely, \n\n${this.firstName} ${this.lastName} \n\n${this.formEmail} \n\n${this.tel}`
  }
}
</script>

<style>
.input[disabled] {
  background-color: #fcfcfc;
  color: #111;
}
</style>
