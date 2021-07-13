<template>
  <div class="my-canvas-wrapper">
    <b-loading></b-loading>
    <canvas class="fpca target" ref="my-canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        context: null
      }
    }
  },

  // Allows any child component to `inject: ['provider']` and have access to it.
  provide () {
    return {
      provider: this.provider
    }
  },

  mounted () {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.provider.context = this.$refs['my-canvas'].getContext('2d')

    this.$refs['my-canvas'].width = 2550
    this.$refs['my-canvas'].height = 3300
  }
}
</script>

<style>
.my-canvas-wrapper {
  height: 0;
  padding-bottom: 129.4%;
  position: relative
}

canvas {
  width: 100%
}

</style>
