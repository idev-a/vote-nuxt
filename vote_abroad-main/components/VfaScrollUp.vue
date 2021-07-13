<template>
  <div>&nbsp;</div>
</template>

<script>
export default {
  mounted () {
    if (process.browser) {
      window.scrollTo(0, 0)
    }
  }
}
</script>
