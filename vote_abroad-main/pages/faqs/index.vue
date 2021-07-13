<template>
<div class="hero-body">
<div class="columns is-centered">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
        <li class="is-active"><a href="#" aria-current="page">{{$t('menu.helpfaq')}}</a></li>
      </ul>
    </nav>
    <h1 class="title">{{$t('faq.title')}}</h1>
    <p class="subtitle is-4">
      {{$t('faq.intro')}}
    </p>
    <i18n tag="h3" path="faq.intro2" class="subtitle is-4">
      <a place="emailLink" class="has-text-primary" href="mailto:helpdesk@votefromabroad.org">helpdesk@votefromabroad.org</a>
      <a place="intercom" class="has-text-primary" @click="launchIntercom">{{$t('faq.voterHelpDesk')}}</a>
      <a place="zoomLink" class="has-text-primary" target="_blank" href="https://qrco.de/bbh0zg">
        Global Voter Assistance (Live via Zoom).
      </a>
    </i18n>
    <div class="columns is-multiline">
      <div v-for="category in categories" :key="category.category" class="column is-6">
        <nav class="panel">
          <p class="panel-heading">{{$t(`faq.${category.category}`)}}</p>
          <nuxt-link v-for="faq in category.faqs" :key="faq.title" :to="localePath({path: faq.permalink})" class="panel-block">
            <span class="panel-icon">
              <i class="fas fa-question-circle"></i>
            </span>
            {{faq.question || faq.title}}
          </nuxt-link>
        </nav>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  asyncData: async ({ app, route }) => {
    let orderedCategories
    try {
      orderedCategories = process.static && process.server
        ? (await import('~/static/site-settings.json'))['faq-categories']
        : (await axios.get('/site-settings.json')).data['faq-categories']
    } catch (error) {
      console.log(error)
    }
    return {
      orderedCategories,
      faqs: {
        es: await app.$content('es/faqs').getAll(),
        en: await app.$content('en/faqs').getAll()
      }
    }
  },
  computed: {
    lang () {
      return this.$i18n.locale
    },
    categories: function () {
      const allFaqs = this.faqs[this.lang]
      return this.orderedCategories.map(({category, faqs}) => ({
        category,
        faqs: faqs.map(({faq}) => allFaqs.find(({title}) => title === faq))
      }))
    }
  },
  methods: {
    launchIntercom () {
      this.$intercom.show()
    }
  }
}
</script>

<style>

</style>
