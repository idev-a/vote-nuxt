<template>
<div class="columns is-centered">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
        <li><nuxt-link :to="localePath({name: 'faqs'})">{{$t('menu.helpfaq')}}</nuxt-link></li>
        <li class="is-active"><a href="#" aria-current="page">{{ page.question | truncate(50) }}</a></li>
      </ul>
    </nav>
    <div>
      <vfa-content-container>
        <div slot="lead" class="article-lead">
          <h1 class="title is-4">{{ page.question }}</h1>
        </div>
        <section slot="content" class="content">
          <nuxtent-body class="content" :body="page.body" />
        </section>
        <div slot="closer" class="article-closer"><img v-if="page.image" :src="`/img/articles/${page.image}`" class="article-image"/>
          <p v-if="page.quote" class="article-quote">{{ page.quote }}</p>
        </div>
      </vfa-content-container>
    </div>
  </div>
</div>
</template>

<script>
import VfaContentContainer from '~/components/VfaContentContainer'
export default {
  asyncData: async ({ app, route }) => ({
    pages: {
      en: await app.$content(`en/faqs`).get(`faqs/${route.params.slug}`),
      es: await app.$content(`es/faqs`).get(`es/faqs/${route.params.slug}`)
    }
  }),
  components: {
    VfaContentContainer
  },
  computed: {
    page () { return this.pages[this.$i18n.locale] }
  },
  filters: {
    truncate: function (text, stop, clamp) {
      return text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
    }
  }
}
</script>
