<template>
<!-- empty note -->
<div>
  <div>
    <h1 class="has-text-centered title is-3">{{$t('dashboard.ballotRequestStatus')}}</h1>
    <h3 class="has-text-centered subtitle is-4">{{$t('dashboard.nextSteps')}}</h3>
  </div>
  <div class="columns is-centered">
    <div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
      <!-- level menu -->
      <div class="level is-mobile">
        <div class="level-left">
          <span class="level-item">
            <h1 class="subtitle is-3">
              <i18n tag="span" path="dashboard.greeting" class="has-text-grey-light">
                <span><strong>{{ name }}</strong></span>
              </i18n>
            </h1>
          </span>
        </div>
        <div class="level-right">
          <div v-if="isAdmin" class="select level-item">
            <select>
              <option>2018</option>
              <option>2016</option>
              <option>2017</option>
              <option selected>2018</option>
              <option>2019</option>
              <option>2020</option>
            </select>
          </div>
          <div class="level-item button" @click="logoutRestart">
            <h1 class="subtitle is-5 has-text-grey">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              <span class="is-uppercase is-size-7">{{ isAuthenticated ? $t('menu.logout') : $t('dashboard.clearSession').replace('.', '') }}</span>
            </h1>
          </div>
        </div>
      </div>

      <!-- main section -->
      <div class="columns">
        <div v-if="isAdmin" class="column is-4-tablet is-3-desktop is-2-widescreen">
          <!-- The sidebar -->
          <nav class="menu">
            <p class="menu-label">
              Menu
            </p>
            <ul class="menu-list">
              <li>
                <a href="dashboard.html">
                  <span class="icon">
                    <i class="fa fa-tachometer-alt"></i>
                  </span>
                  Dashboard
                  </a>
              </li>
              <li>
                <a class="is-active" href="books.html">
                  <span class="icon">
                    <i class="fa fa-book"></i>
                  </span>
                  Books
                </a>
              </li>
              <li>
                <a href="customers.html">
                  <span class="icon">
                    <i class="fa fa-address-book"></i>
                  </span>
                  Customers
                </a>
              </li>
              <li>
                <a href="orders.html">
                  <span class="icon">
                    <i class="fa fa-file-text-o"></i>
                  </span>
                  Orders
                </a>
              </li>
            </ul>
          </nav>
        </div>
          <div class="column">
            <div class="columns">
              <div class="column">
                <section class="section">
                  <div>
                    <p class="subtitle is-4" v-html="md($t('dashboard.thankYou'))"></p>
                    <p class="subtitle is-4" v-if="stage === 'formEmailed'" v-html="md(formSubmitted)"></p>
                    <p class="subtitle is-4" v-if="stage !== 'formEmailed'" v-html="md(transmitInstructions)"></p>
                    <b-message v-if="transmitRules && stage !== 'formEmailed'" type="is-info" has-icon>
                      <span v-html="md(transmitRules)"></span>
                    </b-message>
                    <!-- <p class="is-size-5"
                      v-if="$te(`request.deadlineLanguage.${votState}Special`) && stage !== 'formEmailed'"
                      v-html="md(specialSubmissionRules)"></p> -->

                    <div class="box" v-if="stage !== 'formEmailed'">
                      <p>
                      <span class="title is-5" v-if="currentRequestObject.leo && currentRequestObject.leo.n"><strong>{{ currentRequestObject.leo.n }}</strong><br/><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a1"><strong>{{ currentRequestObject.leo.a1 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a2"><strong>{{ currentRequestObject.leo.a2 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a3"><strong>{{ currentRequestObject.leo.a3 }}</strong><br/></span>
                      <span><strong>{{ currentRequestObject.leo ? currentRequestObject.leo.c : '' }}, </strong>
                      <strong>{{ currentRequestObject.leo ? currentRequestObject.leo.s : '' }} </strong>
                      <strong>{{ currentRequestObject.leo ? currentRequestObject.leo.z : '' }}</strong><br/></span>
                      <span class="has-text-right"><strong>United States of America</strong><br/><br/></span></p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.e" v-html="md(`**${$t('dashboard.email')}:** [${ currentRequestObject.leo.e }](mailto:${ currentRequestObject.leo.e })`)"></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.p" v-html="md(`**${$t('dashboard.phone')}:** [${ '+1' + currentRequestObject.leo.p }](tel:${ ('+1' + currentRequestObject.leo.p).replace(/[()]/g, '-').replace(/ /g, '') })`)"><br/><br/></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.f" v-html="md(`**${$t('dashboard.fax')}:** [${ '+1' + currentRequestObject.leo.f }](tel:${ ('+1' + currentRequestObject.leo.f).replace(/[()]/g, '-').replace(/ /g, '')  })`)"></span>
                      </p>
                    </div><br/>
                    <p class="subtitle is-4" v-if="stage !== 'formEmailed'" v-html="md($t('dashboard.requiresSubmit'))"></p>
                    <article class="message is-danger" v-if="stage !== 'formEmailed'">
                      <div class="message-header">
                        <p v-html="md(deadlineLanguage.split('\n')[0])"></p>
                      </div>
                      <div class="message-body" v-html="md(deadlineLanguage.split('\n').slice(1).join('\n\n').replace(/(https?:\/\/[A-Za-z0-9\/:\.]*)/gi, '[$1]($1)'))">
                      </div>
                    </article>
                    <p class="is-size-5" v-html="md(deadlineFormConfirmation)"></p>
                    <!-- <p class="is-size-5" v-html="md($t('dashboard.verify'))"></p> -->
                    <div class="box" v-if="stage === 'formEmailed'">
                      <p>
                      <span class="title is-5" v-if="currentRequestObject.leo && currentRequestObject.leo.n"><strong>{{ currentRequestObject.leo.n }}</strong><br/><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a1"><strong>{{ currentRequestObject.leo.a1 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a2"><strong>{{ currentRequestObject.leo.a2 }}</strong><br/></span>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.a3"><strong>{{ currentRequestObject.leo.a3 }}</strong><br/></span>
                      <span><strong>{{ currentRequestObject.leo ? currentRequestObject.leo.c : '' }}, </strong>
                      <strong>{{ currentRequestObject.leo ? currentRequestObject.leo.s : '' }} </strong>
                      <strong>{{ currentRequestObject.leo ? currentRequestObject.leo.z : '' }}</strong><br/></span>
                      <span class="has-text-right"><strong>United States of America</strong><br/><br/></span></p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.e" v-html="md(`**${$t('dashboard.email')}:** [${ currentRequestObject.leo.e }](mailto:${ currentRequestObject.leo.e })`)"></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.p" v-html="md(`**${$t('dashboard.phone')}:** [${ '+1' + currentRequestObject.leo.p }](tel:${ ('+1' + currentRequestObject.leo.p).replace(/[()]/g, '-').replace(/ /g, '') })`)"><br/><br/></span>
                      </p>
                      <p>
                      <span v-if="currentRequestObject.leo && currentRequestObject.leo.f" v-html="md(`**${$t('dashboard.fax')}:** [${ '+1' + currentRequestObject.leo.f }](tel:${ ('+1' + currentRequestObject.leo.f).replace(/[()]/g, '-').replace(/ /g, '')  })`)"></span>
                      </p>
                    </div><br/>
                    <p class="is-size-5" v-html="md(deadlineReceiveBallot + ' ' + deadlineBallotReturn.replace(/(https?:\/\/[A-Za-z0-9\/:\.]*)/gi, '[$1]($1)'))"></p><br/>
                    <p class="is-size-5">
                      <span class="content" v-html="md($t('dashboard.makeChanges', {link: localePath({ name: 'request-stage', params: {stage: 'your-information'} })}))"></span>
                      <!-- <span>If you need to change anything on your form, </span>
                      <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'your-information'} })" class="has-text-primary">click here</nuxt-link>
                      <span>to go back. If you are finished, please close the browser window to delete any information saved in this session. Or </span> -->
                      <a @click.prevent="logoutRestart" class="has-text-primary"> {{$t('dashboard.clearSession')}}</a>
                    </p><br/>
                    <p class="is-size-5" v-html="md($t('dashboard.helpThanks'))"></p><br/>
                    <a @click="logoutRestart" class="button is-primary is-medium is-fullwidth is-capitalized">{{$t('dashboard.clearSession').replace('.', '')}}</a>
                  </div>
                </section>
              </div>
            </div>

          <!-- stats and buttons -->
          <div class="columns is-multiline is-centered">
            <div class="column">
              <nuxt-link to="/FAQs">
                <div class="notification is-info has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-graduation-cap"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">{{$t('dashboard.learn.title')}}</p>
                      <p class="subtitle is-6">{{$t('dashboard.learn.content')}}</p>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </div>

            <div class="column">
              <a  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvotefromabroad.org" target="_blank">
                <div class="notification is-danger has-text">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-3x fa-share"></i>
                      </span>
                    </div>
                    <div class="media-content" style="overflow:hidden;">
                      <p class="title is-3">{{$t('dashboard.share.title')}}</p>
                      <p class="subtitle is-6">{{$t('dashboard.share.content')}}</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <img src="https://p1.zemanta.com/p/7069/7419/" height="1" width="1" border="0" alt="" />
</div>
</template>

<script>
import snarkdown from 'snarkdown'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  async fetch ({ store }) {
    await store.dispatch('data/getElections')
  },
  async asyncData ({ app, store }) {
    let state =
      store.getters['requests/getCurrent'] &&
      store.getters['requests/getCurrent'].leo
        ? store.getters['requests/getCurrent'].leo.s
        : ''
    let elections = (await app.$content('/elections').get('elections')).body
    return {
      registering:
        store.getters['requests/getCurrent'].isRegistered !== 'registered',
      state: state,
      submissionMethod: store.getters['requests/getCurrent'].recBallot,
      allStateRules: await app
        .$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll(),
      stateElections: (await app.$content('/elections').get('elections')).body
        .filter(
          election =>
            election.state &&
            state &&
            election.state.toLowerCase() === state.toLowerCase()
        )
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        }),
      elections: elections
    }
  },
  head () {
    return {
      script: [{
        src: 'https://secure.adnxs.com/px?id=1388184&t=1', async: true, defer: true
      }]
    }
  },
  data () {
    return {
      isAdmin: false,
      currentRequestStage: 'Fill & Sign'
    }
  },
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
    instructionsObject () {
      let votState = this.votState
      return {
        leoName: this.leoName || '',
        transmitOpts: this.transmitOpts,
        default: this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        }),
        specialDeadline: this.$te(
          `request.deadlineLanguage.${votState}SpecialDeadline`
        )
          ? this.$t(`request.deadlineLanguage.${votState}SpecialDeadline`, {
            leoName: this.leoName
          })
          : this.$t('request.deadlineLanguage.emailSuggested')
      }
    },
    transmitInstructions () {
      if (
        this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)
      ) {
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        })
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(
          `request.deadlineLanguage.${this.votState}Special`,
          Object.assign({}, this.instructionsObject, { specialDeadline: '' })
        )
      } else {
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        })
      }
    },
    transmitRules () {
      if (
        this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)
      ) {
        return this.$t(
          `request.deadlineLanguage.${this.votState}Special`,
          Object.assign({}, this.instructionsObject, { default: '' })
        )
      } else {
        return this.stateRules &&
          this.stateRules.fpcaSubmitOptionsRequest.includes('Email')
          ? this.$t('request.deadlineLanguage.emailSuggested')
          : ''
      }
    },
    electronicTransmissionNote () {
      if (
        this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)
      ) {
        return this.$t(
          `request.deadlineLanguage.${this.votState}SpecialDeadline`,
          { leoName: this.leoName }
        )
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, {
          leoName: this.leoName
        })
      } else return null
    },
    transmitOpts () {
      if (!this.stateRules) {
        return `mail, email or fax`
      }
      switch (this.stateRules.fpcaSubmitOptionsRegister.length) {
        case 1:
          return this.$t(
            `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`
          )
        case 2:
          return this.$t(`request.deadlineLanguage.opt2`, {
            item1: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`
            ).toLowerCase(),
            item2: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`
            ).toLowerCase()
          })
        case 3:
          return this.$t(`request.deadlineLanguage.opt3`, {
            item1: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`
            ).toLowerCase(),
            item2: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`
            ).toLowerCase(),
            item3: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`
            ).toLowerCase()
          })
        case 4:
          return this.$t(`request.deadlineLanguage.opt4`, {
            item1: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`
            ).toLowerCase(),
            item2: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`
            ).toLowerCase(),
            item3: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`
            ).toLowerCase(),
            item4: this.$t(
              `request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[3].toLowerCase()}`
            ).toLowerCase()
          })
        default:
          return `mail, email or fax`
      }
    },
    specialSubmissionRules () {
      return this.$te(`request.deadlineLanguage.${this.votState}Special`)
        ? this.$t(`request.deadlineLanguage.${this.votState}Special`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts,
          specialDeadline: this.$te(
            `request.deadlineLanguage.${this.votState}SpecialDeadline`
          )
            ? this.$t(
              `request.deadlineLanguage.${this.votState}SpecialDeadline`
            )
            : ''
        })
        : this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        })
    },
    stateRules () {
      if (this.state) {
        return this.allStateRules.find(
          x => x.iso.toLowerCase() === this.state.toLowerCase()
        )
      } else {
        return undefined
      }
    },
    newVoterDeadlineLanguageObject () {
      let elections = this.getCurrentDeadlines.filter(
        x => x.ruleType === 'Registration'
      )
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods =
        elections.length < 2 || elections[0].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.submissionMethod`, {
            method: elections[0].submissionOptions.join('/')
          })
      let altMethods =
        elections.length < 2 || elections[1].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {
            rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`),
            deadline: new Date(elections[1].ruleDate).toLocaleDateString(
              this.dateFormat,
              { month: 'short', day: 'numeric' }
            ),
            method: elections[1].submissionOptions.join('/')
          })
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(
          this.dateFormat,
          { month: 'short', day: 'numeric' }
        ),
        electionType: elections[0].electionType,
        note: elections[0].note
          ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`)
          : '',
        url: process.env.url,
        state: elections[0].state,
        documentRequired:
          this.documentRequired && (this.state === 'AK' || this.state === 'AZ')
            ? this.$t(`request.deadlineLanguage.documentRequired`, {
              document: this.$t(
                `request.deadlineLanguage.${this.state.toLowerCase()}Document`
              )
            })
            : ''
      }
    },
    registeredVoterDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(
        x => x.ruleType === 'Ballot Request'
      )
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods =
        elections.length < 2 || elections[0].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.submissionMethod`, {
            method: elections[0].submissionOptions.join('/')
          })
      let altMethods =
        elections.length < 2 || elections[1].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {
            rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`),
            deadline: new Date(elections[1].ruleDate).toLocaleDateString(
              this.dateFormat,
              { month: 'short', day: 'numeric' }
            ),
            method: elections[1].submissionOptions.join('/')
          })
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(
          this.dateFormat,
          { month: 'short', day: 'numeric' }
        ),
        electionType: elections[0].electionType,
        note: elections[0].note
          ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`)
          : '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    unsureVoterDeadlineObject () {
      let electionsNew = this.getCurrentDeadlines.filter(
        x => x.ruleType === 'Registration'
      )
      let newVoterRule = electionsNew[0].rule
      let newVoterDeadline = new Date(electionsNew[0].ruleDate)
      let newVoterMethods =
        electionsNew.length < 2 || electionsNew[0].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.submissionMethod`, {
            method: electionsNew[0].submissionOptions.join('/')
          })
      let newVoterAltMethods =
        electionsNew.length < 2 || electionsNew[1].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {
            rule: this.$t(`request.deadlineLanguage.${electionsNew[1].rule}`),
            deadline: new Date(electionsNew[1].ruleDate).toLocaleDateString(
              this.dateFormat,
              { month: 'short', day: 'numeric' }
            ),
            method: electionsNew[1].submissionOptions.join('/')
          })
      let electionsRegistered = this.getCurrentDeadlines.filter(
        x => x.ruleType === 'Ballot Request'
      )
      let registeredVoterRule = electionsRegistered[0].rule
      let registeredVoterDeadline = new Date(electionsRegistered[0].ruleDate)
      let registeredVoterMethods =
        electionsRegistered.length < 2 ||
        electionsRegistered[0].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.submissionMethod`, {
            method: electionsRegistered[0].submissionOptions.join('/')
          })
      let registeredVoterAltMethods =
        electionsRegistered.length < 2 ||
        electionsRegistered[1].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {
            rule: this.$t(
              `request.deadlineLanguage.${electionsRegistered[1].rule}`
            ),
            deadline: new Date(
              electionsRegistered[1].ruleDate
            ).toLocaleDateString(this.dateFormat, {
              month: 'short',
              day: 'numeric'
            }),
            method: electionsRegistered[1].submissionOptions.join('/')
          })
      return {
        newVoterRule: this.$t(`request.deadlineLanguage.${newVoterRule}`),
        newVoterDeadline: newVoterDeadline.toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        newVoterSubmissionMethod: newVoterMethods,
        newVoterAlternateSubmissionMethod: newVoterAltMethods,
        newVoterElectionDay: new Date(
          electionsNew[0].electionDate
        ).toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        newVoterElectionType: electionsNew[0].electionType,
        newVoterNote: electionsNew[0].note
          ? this.$t(`request.deadlineLanguage.notes.${electionsNew[0].note}`)
          : '',
        registeredVoterRule: this.$t(
          `request.deadlineLanguage.${registeredVoterRule}`
        ),
        registeredVoterDeadline: registeredVoterDeadline.toLocaleDateString(
          this.dateFormat,
          { month: 'short', day: 'numeric' }
        ),
        registeredVoterSubmissionMethod: registeredVoterMethods,
        registeredVoterAlternateSubmissionMethod: registeredVoterAltMethods,
        registeredVoterElectionDay: new Date(
          electionsRegistered[0].electionDate
        ).toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        registeredVoterElectionType: electionsRegistered[0].electionType,
        registeredVoterNote: electionsRegistered[0].note
          ? this.$t(
            `request.deadlineLanguage.notes.${electionsRegistered[0].note}`
          )
          : '',
        url: process.env.url,
        state: electionsNew[0].state,
        documentRequired:
          this.documentRequired && (this.state === 'AK' || this.state === 'AZ')
            ? this.$t(`request.deadlineLanguage.documentRequired`, {
              document: this.$t(
                `request.deadlineLanguage.${this.state.toLowerCase()}Document`
              )
            })
            : ''
      }
    },
    ballotReturnDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(
        x => x.ruleType === 'Ballot Return'
      )
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods =
        elections.length < 2 || elections[0].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.submissionMethod`, {
            method: elections[0].submissionOptions.join('/')
          })
      let altMethods =
        elections.length < 2 || elections[1].submissionOptions.length > 2
          ? ''
          : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {
            rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`),
            deadline: new Date(elections[1].ruleDate).toLocaleDateString(
              this.dateFormat,
              { month: 'short', day: 'numeric' }
            ),
            method: elections[1].submissionOptions.join('/')
          })
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString(this.dateFormat, {
          month: 'short',
          day: 'numeric'
        }),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString(
          this.dateFormat,
          { month: 'short', day: 'numeric' }
        ),
        electionType: elections[0].electionType,
        note: elections[0].note
          ? this.$t(`request.deadlineLanguage.notes.${elections[0].note}`)
          : '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    deadlineLanguage () {
      if (this.getCurrentDeadlines.length === 0) {
        return `There are no elections currently scheduled for ${
          this.votState
        }.  Voters should send in an FPCA every calendar year.`
      } else {
        switch (this.isRegistered) {
          case 'notRegistered':
            return this.$t(
              'request.deadlineLanguage.newVoters',
              this.newVoterDeadlineLanguageObject
            )
          case 'registered':
            return this.$t(
              'request.deadlineLanguage.registeredVoters',
              this.registeredVoterDeadlineObject
            )
          default:
            return this.$t(
              'request.deadlineLanguage.unsureRegistrationVoters',
              this.unsureVoterDeadlineObject
            )
        }
      }
    },
    isRegistered () {
      return this.currentRequestObject
        ? this.currentRequestObject.isRegistered
        : null
    },
    formSubmitted () {
      return this.$t('request.deadlineLanguage.formSubmitted', {
        alsoVoterRegistration:
          this.isRegistered === 'registered'
            ? ''
            : this.$t('request.deadlineLanguage.alsoVoterRegistration'),
        leoName: this.leoName,
        specialRules: this.$te(
          `request.deadlineLanguage.${this.votState}SpecialDeadline`
        )
          ? this.capitalizeFirstLetter(
            this.$t(
              `request.deadlineLanguage.${this.votState}SpecialDeadline`
            )
          )
          : ''
      })
    },
    deadlineFormConfirmation () {
      return this.$t('request.deadlineLanguage.formConfirmation')
    },
    deadlineReceiveBallot () {
      if (this.getCurrentDeadlines.length === 0) {
        return ''
      } else {
        let daysToNextElection = Math.ceil(
          (new Date(this.getCurrentDeadlines[0].electionDate).getTime() -
            new Date().getTime()) /
            (1000 * 3600 * 24)
        )
        return this.$t(
          `request.deadlineLanguage.${
            daysToNextElection > 44
              ? 'sendBallot45days'
              : 'sendBallotLessThan45days'
          }`
        )
      }
    },
    deadlineBallotReturn () {
      if (this.getCurrentDeadlines.length === 0) {
        return ''
      } else {
        return this.$t(
          'request.deadlineLanguage.ballotReturn',
          this.ballotReturnDeadlineObject
        )
      }
    },
    documentRequired () {
      switch (this.state.toLowerCase()) {
        case 'ak':
          return 'proof of Alaska Residency'
        case 'az':
          return this.isRegistered === 'unsure' ||
            this.isRegistered === 'notRegistered'
            ? 'proof of citizenship (for newly registered voters)'
            : null
        default:
          return null
      }
    },
    user () {
      return this.$store.state.userauth.user
    },
    requests () {
      return this.$store.state.requests.requests
    },
    currentRequest () {
      return this.$store.state.requests.currentRequest
    },
    currentRequestObject () {
      return this.$store.getters['requests/getCurrent']
    },
    stage () {
      return this.currentRequestObject && this.currentRequestObject.status
        ? this.currentRequestObject.status
        : 'start'
    },
    states () {
      return new Set(this.requests.map(x => x.votAdr.stateISO))
    },
    name () {
      return this.user && this.user.firstName
        ? this.user.firstName
        : this.requests && this.requests[0] && this.requests[0].firstName
          ? this.requests[0].firstName
          : ''
    },
    isAuthenticated: function () {
      return this.$store.getters['userauth/isAuthenticated']
    },
    leoAdr () {
      let leo = this.currentRequestObject.leo
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${
        leo.a2 ? leo.a2 + '\n' : ''
      }${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${
        leo.s ? leo.s + ' ' : ''
      }${leo.z ? leo.z + '\n' : '\n'}United States of America`
    },
    leoEmail () {
      return this.currentRequestObject.leo && this.currentRequestObject.leo.e
        ? this.currentRequestObject.leo.e
        : ''
    },
    leoName () {
      return this.currentRequestObject.leo && this.currentRequestObject.leo.n
        ? this.currentRequestObject.leo.n
        : ''
    },
    leoFax () {
      return this.currentRequestObject.leo && this.currentRequestObject.leo.f
        ? '+1 ' + this.currentRequestObject.leo.f
        : ''
    },
    leoPhone () {
      return this.currentRequestObject.leo && this.currentRequestObject.leo.p
        ? '+1 ' + this.currentRequestObject.leo.p
        : ''
    },
    votState () {
      return this.$store.getters['requests/getCurrent'] &&
        this.$store.getters['requests/getCurrent'].leo
        ? this.$store.getters['requests/getCurrent'].leo.s
        : ''
    },
    voterRegistrationStatus () {
      return this.$store.getters['requests/getCurrent'].isRegistered || null
    },
    voterType () {
      return this.$store.getters['requests/getCurrent'].voterClass || null
    },
    ...mapGetters('requests', ['getCurrent', 'getCurrentDeadlines'])
  },
  methods: {
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    logoutRestart () {
      this.$store.dispatch('userauth/logout')
      this.$router.push(
        this.localePath({
          name: 'request-stage',
          params: { stage: 'your-information' }
        })
      )
    },
    md (md) {
      return snarkdown(md)
    },
    share () {
      this.$dialog.alert({
        title: 'Tell a friend about VoteFromAbroad',
        message: 'To be added after launch',
        confirmText: 'OK',
        type: 'is-danger',
        hasIcon: true,
        icon: 'share',
        iconPack: 'fas'
      })
    }
  }
}
</script>

<style>
</style>
