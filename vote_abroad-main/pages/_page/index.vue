<template>
  <div class="columns is-centered">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
          <li class="is-active"><a href="#" aria-current="page">{{ page.title }}</a></li>
        </ul>
      </nav>
      <div class="article-lead">
        <h1 class="title">{{ page.title }}</h1>
      </div>
      <nuxtent-body class="content" :body="page.body" />
    </div>
    <img v-if="page.zemantaPixel" :src="page.zemantaPixel" height="1" width="1" border="0" alt="" />
  </div>
</template>

<script>
export default {
  asyncData: async ({ app, route }) => {
    let en
    let es

    try {
      en = await app.$content(`en/pages`).get(`${route.params.page}`)
    } catch (error) {
      console.log('error loading English page content')
    }
    try {
      es = await app.$content(`es/pages`).get(`es/${route.params.page}`)
    } catch (error) {
      console.log('error loading Spanish page content')
    }

    return {
      pages: {
        en: en || es || { title: '', body: '' },
        es: es || en || { title: '', body: '' }
      }
    }
  },
  computed: {
    page () { return this.pages[this.$i18n.locale] }
  },
  mounted () {
    console.log(this.pages.es)
  }
}
</script>
