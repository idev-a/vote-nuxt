<template>
  <div class="hero-body columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
          <li class="is-active"><a href="#" aria-current="page">{{$t('menu.stateGuide')}}</a></li>
        </ul>
      </nav>
      <h1 class="title">
        {{ $t('menu.stateGuide') }}
      </h1>
      <nuxtent-body class="content" :body="page.body" />
      <b-field :label="$t('states.selectState')">
        <b-select :placeholder="$t('states.select')"
          v-model="selectedState"
          @input="$router.push(localePath({ name: 'states-state', params: {state: selectedState} }))">
          <option
            v-for="state in statesSortedLocalized"
            :value="state.iso"
            :key="state.iso">
            {{ $t(`states.${state.iso}`) }}
          </option>
        </b-select>
      </b-field>
    </div>
  </div>
</template>
<script>
export default {
  asyncData: async ({ app }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}states`),
    states: (await app.$content('/rls').getAll())
    // .sort((a, b) => {
    //   if (a.title.toUpperCase() < b.title.toUpperCase()) { return -1 }
    //   if (a.title.toUpperCase() > b.title.toUpperCase()) { return 1 }
    //   return 0
    // })
  }),
  data () {
    return {
      selectedState: null
    }
  },
  computed: {
    statesSortedLocalized () {
      return this.states
        .map(x => ({iso: x.iso, name: this.$t(`states.${x.iso}`)}))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
  }
}
</script>
