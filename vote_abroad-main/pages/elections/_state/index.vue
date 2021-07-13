<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-8">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
            <li><nuxt-link :to="localePath('states')">{{$t('election.elections')}}</nuxt-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ $t(`states.${$route.params.state.toUpperCase()}`) }}</a></li>
          </ul>
        </nav>
          <h1 class="title is-3">{{$t('election.title', {state: $t(`states.${$route.params.state.toUpperCase()}`) })}}</h1>
          <h3
            v-if="!elections || elections.length === 0"
            class="subtitle is-5 has-text-primary">There are no upcoming elections scheduled for {{$t(`states.${$route.params.state.toUpperCase()}`)}}.</h3>
          <b-table
            v-else
            hoverable
            :data="elections"
            detailed
            :has-detailed-visible="() => false"
            detail-key="date"
            :opened-detailed="elections.filter(x => JSON.stringify(x).includes('note')).map(x => x.date)">
            <template slot-scope="props">
              <b-table-column
                :label="$t('election.electionDay')">
                <h1 class="title is-6" style="white-space: nowrap">{{ localizeIfAvailable(props.row.electionType) }}</h1>
                <div style="margin-bottom: 12px;">
                  <span v-if="new Date().getTime() > new Date(props.row.date).getTime()" class="tag is-info is-large">Completed</span>
                </div>
                <div class="calendar" style="margin: 0">
                  <header class="calendar-month">{{new Date(props.row.date + '+00:00').toLocaleDateString(dateFormat, {month: 'short', timeZone: 'UTC'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date + '+00:00').toLocaleDateString(dateFormat, {day: 'numeric', timeZone: 'UTC'}) }}
                  </div>
                </div>
              </b-table-column>
              <!-- <b-table-column>
                <div class="calendar">
                  <header class="calendar-month">{{new Date(props.row.date).toLocaleDateString(dateFormat, {month: 'short'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date).toLocaleDateString(dateFormat, {day: 'numeric'}) }}
                  </div>
                </div>
              </b-table-column> -->
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label=" localizeIfAvailable(key) ">
                <ul>
                  <template  v-for="(deadline, index) in rule">
                    <li :key="index.toString() + deadline.rule + deadline.voterType"
                      v-if="deadline.rule !== 'Not Required'">
                      <template v-if="deadline.date">
                        <strong>{{ typeof deadline.voterType === 'string' ? localizeIfAvailable(deadline.voterType) : localizeIfAvailable('All Voters') }}</strong>
                        <sup v-if="deadline.note">{{deadline.note.replace(/[A-Z]/g, '')}}</sup>
                        <br/>
                        <span class="tag is-success">{{ localizeIfAvailable(deadline.rule) }}</span>
                        <br/>
                        <span>{{ new Date(deadline.date + '+00:00').toLocaleDateString(dateFormat, deadline.date && deadline.date.substr(11, 8) !== '00:00:00'  ? {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'} : {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'}) }}</span>
                        <!-- {{ new Date(deadline.date).toLocaleDateString(dateFormat, {year: 'numeric', month: 'short', day: 'numeric'}) }} -->
                        <hr v-if="index < rule.length - 1">
                      </template>
                      <span v-else>Check deadlines with your local election official.</span>
                    </li>
                    <li :key="index.toString() + deadline.rule + deadline.voterType" v-else><strong>{{ localizeIfAvailable(deadline.rule) }}</strong></li>
                  </template>
                </ul>
              </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
              <p
                class="help"
                v-for="note of rowNotes(props.row)"
                :key="note">{{note.replace(/[A-Z]/g, '')}}: {{$t(`request.deadlineLanguage.notes.${note}`)}}</p>
            </template>
          </b-table>
          <!-- <b-table
            hoverable
            :data="elections">
            <template slot-scope="props">
              <b-table-column :label="$t('election.electionDay')">
                <h1 class="title is-6">{{ localizeIfAvailable(props.row.electionType) }}</h1>
                <div class="calendar" style="margin: 0">
                  <header class="calendar-month">{{new Date(props.row.date).toLocaleDateString(dateFormat, {month: 'short'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date).toLocaleDateString(dateFormat, {day: 'numeric'}) }}
                  </div>
                </div>
              </b-table-column>
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label="localizeIfAvailable(key)">
                <ul>
                  <li v-for="(deadline, index) in rule"
                    :key="index.toString() + deadline.rule + deadline.voterType"
                    v-if="deadline.rule !== 'Not Required'">
                    <strong>{{ typeof deadline.voterType === 'string' ? localizeIfAvailable(deadline.voterType) : $t('election.allVoters') }}</strong><br/><span class="tag is-success">{{ localizeIfAvailable(deadline.rule) }}</span><br/>{{ new Date(deadline.date).toLocaleDateString(dateFormat, {year: 'numeric', month: 'short', day: 'numeric'}) }}
                    <hr v-if="index < rule.length - 1">
                  </li>
                  <li v-else><strong>{{ localizeIfAvailable(deadline.rule) }}</strong></li>
                </ul>
              </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
              <p
                class="help"
                v-if="props.row.note">{{ $t(`request.deadlineLanguage.notes.${note}`) }}</p>
            </template>
          </b-table> -->
        <!-- </section> -->
      </div>
    </div>
  </section>
</template>

<script>
import snarkdown from 'snarkdown'
// note

export default {
  async asyncData ({ app, route }) {
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state.toLowerCase() === route.params.state.toLowerCase())
      // states: (await app.$content('/state-rules').get(route.params.state))
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  },
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    }
  },
  methods: {
    rowNotes (row) {
      return Object.entries(row.rules)
        .filter(([k, v]) => v.reduce((bool, cur) => cur.note || bool, false))
        .map(([k, v]) => v.reduce((acc, cur) => cur.note ? acc.concat(cur.note) : acc, []))
        .reduce((acc, cur) => acc.concat(cur), [])
        .reduce((acc, cur) => acc.includes(cur) ? acc : acc.concat(cur), [])
    },
    localizeIfAvailable (str) {
      if (typeof str !== 'string') {
        return str
      }
      let newStr = str
      if (str.includes('*')) {
        newStr = str.replace(/\*/g, '')
      }
      return this.$te(`election.${this.camelize(newStr)}`)
        // ? this.$t(`election.${this.camelize(newStr)}`) + str.replace(/[^*]/g, '')
        ? this.$t(`election.${this.camelize(newStr)}`)
        : this.$te(`election.${newStr.toLowerCase().replace(/\s/gi, '')}`)
          ? this.$t(`election.${newStr.toLowerCase().replace(/\s/gi, '')}`)
          : newStr
    },
    camelize (str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
    decodeHtmlEntity (str) {
      str = str.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec)
      })
    },
    md (md) { return snarkdown(md) }
  },
  transition: 'test'
}
</script>

<style>

</style>
