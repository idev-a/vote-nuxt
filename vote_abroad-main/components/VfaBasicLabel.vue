<template>
  <label :for="fieldName" class="label">
    {{label ? label : $t(`request.${fieldName}.label`)}}
    <a v-if="$te(`request.${fieldName}.tooltip`)" @click="$emit('toggleInfo')" class="button is-transparent is-small">
      <span>
        <b-icon
          type="is-info"
          icon="info-circle"></b-icon>
      </span>
    </a>
  </label>
</template>

<script>
export default {
  props: {
    fieldName: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    required: {
      type: Boolean
    }
  }

}
</script>

<style>

</style>
