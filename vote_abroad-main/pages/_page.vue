<template>
  <div class="section">
    <nuxt-child></nuxt-child>
    <div class="has-text-centered">
      <nuxt-link class="button is-vfa is-inverted" :to="localePath('index')">{{$t('home')}}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
