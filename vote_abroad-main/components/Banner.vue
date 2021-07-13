<template>
  <div class="notification has-background-warning" :hide="!show">
    <!-- <button
      class="wrapper-close-btn button is-small is-transparent"
      @click="$emit('close')"
    >
      <span class="icon is-small has-text-primary">
        <i class="fa fa-times fa-2x"></i>
      </span>
    </button> -->
    <h1 class="subtitle is-size-3 is-size-5 has-text-primary">
      <i18n tag="span" path="homepage.bannerFrom19Sept_part1">
        <a class="has-text-primary" href="https://www.votefromabroad.org/how-to-return-your-ballot" target="_blank">
          {{ $t('clickHere') }}
        </a>
      </i18n>
      <br>
      <br>
      <span v-html="$t('homepage.bannerFrom19Sept_part2')">
      </span>
      <span>
        <a
          class="has-text-primary"
          :href="$t('homepage.bannerFrom19Sept_part2_link')"
          target="_blank"
        >
          {{ $t('clickHere') }}
        </a>
      </span>
      <br>
      <br>
      <span v-html="$t('homepage.bannerFrom26Sept_part3')">
      </span>
      <span
        <a class="has-text-primary" :href="`https://www.votefromabroad.org/es/fwab/`" target="_blank">
          {{ $t('clickHere') }}
        </a>
      </span>
    </h1>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  watch: {
    show (value) {
      if (!value) {
        const delay = setInterval(() => {
          this.$destroy()
          clearInterval(delay)
        }, 1200)
      }
    }
  }
}
</script>
