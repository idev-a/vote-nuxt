<template>
  <b-checkbox :value="value" ref="c-noId" @input="value => $emit('input', value)">
    <span v-text="message" />
  </b-checkbox>
</template>

<script>
export default {
  props: ['value', 'message']
}
</script>
