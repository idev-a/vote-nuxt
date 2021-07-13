<template>
  <div class="columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
          <li class="is-active"><a href="#" aria-current="page">{{$t('election.elections')}}</a></li>
        </ul>
      </nav>
      <h1 class="title">
        <!-- {{ page.title }} -->
        {{$t('election.elections')}}
      </h1>
      <nuxtent-body class="content" :body="page.body" />
        <!-- {{$t('election.elections')}} -->
      <b-field :label="$t('states.selectState')">
        <b-select :placeholder="$t('states.select')"
          v-model="selectedState"
          @input="$router.push(localePath({ name: 'elections-state', params: {state: selectedState} }))">
          <option
            v-for="state in statesSortedLocalized"
            :value="state.iso"
            :key="state.iso">
            {{ $t(`states.${state.iso}`) }}
          </option>
        </b-select>
      </b-field>

      <!-- <article
        class="media"
        v-for="(electionTypes, electionDate) in upcomingElections"
        :key="electionDate">
        <figure class="media-left">
          <div class="calendar">
            <header class="calendar-month">{{new Date(electionDate).toLocaleDateString(dateFormat, {month: 'short', timeZone: 'UTC'}) }}</header>
            <div class="calendar-date">
              {{ new Date(electionDate).toLocaleDateString(dateFormat, {day: 'numeric', timeZone: 'UTC'}) }}
            </div>
          </div> -->
          <!-- <p class="image is-64x64">
            <img src="https://bulma.io/images/placeholders/128x128.png">
          </p> -->
        <!-- </figure>
        <h3 class="is-size-5 has-text-darkgrey">{{new Date(electionDate).toLocaleDateString(dateFormat, {year: 'numeric', timeZone: 'UTC'}) }}</h3>
        <div class="media" v-for="(states, type) in electionTypes" :key="`${date} ${type}`">
          <div class="media-content">
            <h3 class="subtitle">{{type}}</h3>
            <p>
              <span v-for="state in states.states" :key="state">{{state}}</span>
            </p>

          </div>
        </div>
      </article> -->
      <!-- <ul>
        <li v-for="(electionType, date) in upcomingElections" :key="date">{{date}}</li>
      </ul> -->
    </div>
  </div>
</template>

<script>
export default {
  asyncData: async ({ app }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}elections`),
    elections: (await app.$content('/elections').getAll())[0].body
  }),
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
    upcomingElections () {
      return this.elections.filter(e => new Date(e.date) > new Date())
        .reduce((acc, cur) => {
          if (!acc[cur.date]) {
            acc[cur.date] = {
              [cur.electionType]: {
                states: [cur.state]
              }
            }
          } else if (!acc[cur.date][cur.electionType]) {
            acc[cur.date][cur.electionType] = {states: [cur.state]}
          } else if (!acc[cur.date][cur.electionType].states.includes(cur.state)) {
            acc[cur.date][cur.electionType].states.push(cur.state)
          }
          return acc
        }, {})
    },
    // upcomingElectionArray () {
    //   return Object.entries(this.upcomingElections)
    //     .map(([date, eObj]) => ({ date, {[Object.keys(eObj)[0]]: eObj[Object.keys(eObj)[0]].states} }))
    //     .sort((a, b) => {
    //       if (new Date(a.date) < new Date(b.date)) return -1
    //       if (a.date === b.date) return 0
    //       else return 1
    //     })
    // },
    pastElections () {
      return this.elections.filter(e => new Date(e.date) < new Date())
        .reduce((acc, cur) => {
          if (acc[cur.date]) {
            if (acc[cur.date][cur.electionType]) {
              acc[cur.date][cur.electionType].states.push(cur.state)
            } else {
              acc[cur.date][cur.electionType] = {
                electionType: cur.electionType,
                states: [cur.state]
              }
            }
          } else {
            acc[cur.date] = {
              electionType: cur.electionType,
              states: [cur.state]
            }
          }
          return acc
        }, {})
    },
    pastElectionArray () {
      return Object.entries(this.pastElections)
        .map(([date, eObj]) => ({ date, type: eObj.electionType, states: eObj.states }))
        .sort((a, b) => {
          if (new Date(a.date) > new Date(b.date)) return -1
          if (a.date === b.date) return 0
          else return 1
        })
    },
    statesSortedLocalized () {
      return this.states
        .map(x => ({iso: x.iso, name: this.$t(`states.${x.iso}`)}))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  data () {
    return {
      selectedState: null,
      states: [
        {'name': 'Alabama', 'iso': 'AL'},
        {'name': 'Alaska', 'iso': 'AK'},
        {'name': 'American Samoa', 'iso': 'AS'},
        {'name': 'Arizona', 'iso': 'AZ'},
        {'name': 'Arkansas', 'iso': 'AR'},
        {'name': 'California', 'iso': 'CA'},
        {'name': 'Colorado', 'iso': 'CO'},
        {'name': 'Connecticut', 'iso': 'CT'},
        {'name': 'Delaware', 'iso': 'DE'},
        {'name': 'District Of Columbia', 'iso': 'DC'},
        // {'name': 'Federated States Of Micronesia', 'iso': 'FM'},
        {'name': 'Florida', 'iso': 'FL'},
        {'name': 'Georgia', 'iso': 'GA'},
        {'name': 'Guam', 'iso': 'GU'},
        {'name': 'Hawaii', 'iso': 'HI'},
        {'name': 'Idaho', 'iso': 'ID'},
        {'name': 'Illinois', 'iso': 'IL'},
        {'name': 'Indiana', 'iso': 'IN'},
        {'name': 'Iowa', 'iso': 'IA'},
        {'name': 'Kansas', 'iso': 'KS'},
        {'name': 'Kentucky', 'iso': 'KY'},
        {'name': 'Louisiana', 'iso': 'LA'},
        {'name': 'Maine', 'iso': 'ME'},
        // {'name': 'Marshall Islands', 'iso': 'MH'},
        {'name': 'Maryland', 'iso': 'MD'},
        {'name': 'Massachusetts', 'iso': 'MA'},
        {'name': 'Michigan', 'iso': 'MI'},
        {'name': 'Minnesota', 'iso': 'MN'},
        {'name': 'Mississippi', 'iso': 'MS'},
        {'name': 'Missouri', 'iso': 'MO'},
        {'name': 'Montana', 'iso': 'MT'},
        {'name': 'Nebraska', 'iso': 'NE'},
        {'name': 'Nevada', 'iso': 'NV'},
        {'name': 'New Hampshire', 'iso': 'NH'},
        {'name': 'New Jersey', 'iso': 'NJ'},
        {'name': 'New Mexico', 'iso': 'NM'},
        {'name': 'New York', 'iso': 'NY'},
        {'name': 'North Carolina', 'iso': 'NC'},
        {'name': 'North Dakota', 'iso': 'ND'},
        // {'name': 'Northern Mariana Islands', 'iso': 'MP'},
        {'name': 'Ohio', 'iso': 'OH'},
        {'name': 'Oklahoma', 'iso': 'OK'},
        {'name': 'Oregon', 'iso': 'OR'},
        // {'name': 'Palau', 'iso': 'PW'},
        {'name': 'Pennsylvania', 'iso': 'PA'},
        {'name': 'Puerto Rico', 'iso': 'PR'},
        {'name': 'Rhode Island', 'iso': 'RI'},
        {'name': 'South Carolina', 'iso': 'SC'},
        {'name': 'South Dakota', 'iso': 'SD'},
        {'name': 'Tennessee', 'iso': 'TN'},
        {'name': 'Texas', 'iso': 'TX'},
        {'name': 'Utah', 'iso': 'UT'},
        {'name': 'Vermont', 'iso': 'VT'},
        {'name': 'Virgin Islands', 'iso': 'VI'},
        {'name': 'Virginia', 'iso': 'VA'},
        {'name': 'Washington', 'iso': 'WA'},
        {'name': 'West Virginia', 'iso': 'WV'},
        {'name': 'Wisconsin', 'iso': 'WI'},
        {'name': 'Wyoming', 'iso': 'WY'}
      ]
    }
  }
}
</script>
