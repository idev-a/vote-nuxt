<template>
  <video :autoplay="autoplay"
    :playsinline="playsinline"
    class="bAndW"
    @click="takePhoto"
    @playing="getDimensions"
    ref="video"></video>
    <!-- @play="timerCallback()" -->
              <!-- :controls="controls" -->
              <!-- @play="timerCallback()" -->
</template>

<script>
require('webrtc-adapter')
export default {
  props: ['isCapturing'],
  data () {
    return {
      autoplay: 'autoplay',
      playsinline: 'playsinline',
      canvas: null,
      image: null
      // controls: false
    }
  },
  methods: {
    getDimensions () {
      // console.log('dimensions', this.$el, this.$el.videoWidth, this.$el.videoHeight)
      this.canvas.width = this.$el.videoWidth
      this.canvas.height = this.$el.videoHeight
    },
    takePhoto () {
      this.$el.pause()
      this.canvas.getContext('2d').drawImage(this.$el, 0, 0)
      this.image.src = this.canvas.toDataURL()
      this.$emit('updatePic', this.canvas.toDataURL(), this.canvas.width, this.canvas.height)
    },
    // step () {
    //   if (!this.canvas) {
    //     this.canvas = document.createElement('canvas')
    //     this.canvas.width = this.$el.clientWidth
    //     this.canvas.height = this.$el.clientHeight
    //   }
    //   if (this.canvas) {
    //     this.canvas.getContext('2d').drawImage(this.$el, 0, 0)
    //     this.image.src = this.canvas.toDataURL()
    //     this.$emit('updatePic', this.image)
    //   }
    //   window.requestAnimationFrame(this.step)
    // },
    // timerCallback () {
    //   window.requestAnimationFrame(this.step)
    // },
    startCapture () {
      // console.log(this.$el)
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        this.$emit('captureError')
        // console.log('bad browser - add user intervace here')
      } else {
        navigator.mediaDevices.enumerateDevices().then(devices => {
          // console.log('devices', devices)
          devices = devices.filter(v => (v.kind === 'videoinput'))
          // console.log('Found ' + devices.length + ' video devices')
          let lastDevice = devices[devices.length - 1]
          devices = devices.filter(v => (v.label.indexOf('back') > 0))
          // console.log(devices)
          let device = null
          if (devices.length > 0) {
            // console.log("Taking a 'back' camera")
            device = devices[devices.length - 1]
          } else {
            // console.log('Taking last camera')
            device = lastDevice
          }

          if (!device) {
            // console.log('No devices!')
            return
          }

          let constraints =
          {
            audio: false,
            // video: true
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: { ideal: 'environment' }
            }
            // video: true
          }
          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              // console.log('stream', stream)
              if (this.$el.srcObject) { this.$el.srcObject = stream } else { this.$el.src = URL.createObjectURL(stream) }
              this.canvas.width = this.$el.clientWidth
              this.canvas.height = this.$el.clientHeight
              // console.log('width', this.canvas.width, 'height', this.canvas.height)
              // info.innerHTML+= "<pre>DONE</pre>";
              // console.log('DONE')
            })
            .catch(err => {
              this.$emit('captureError')
              console.log(err.name + ': ' + err.message)
              // console.log('We could not get access your device camera. (Either it is not connected/available or you have disallowed VoteFromAbroad.org from accessing it). You can still click the \'upload a file\' button to upload your signature from a file.')
            })
        })
          .catch(err => {
            this.$emit('captureError')
            console.error(err)
            // console.log(err.name + ': ' + err.message)
            // console.log('We could not get access your device camera. (Either it is not connected/available or you have disallowed VoteFromAbroad.org from accessing it). You can still click the \'upload a file\' button to upload your signature from a file.')
          })
      }
    }
  },
  watch: {
    isCapturing (val) {
      if (val) {
        this.startCapture()
      } else {
        if (this.$el && this.$el.srcObject) this.$el.srcObject.getTracks()[0].stop()
        this.$el.pause()
      }
    }
  },
  mounted: function () {
    this.canvas = document.createElement('canvas')
    this.image = new Image()
  },
  beforeDestroy: function () {
    this.$el.pause()
    if (this.$el && this.$el.srcObject) this.$el.srcObject.getTracks()[0].stop()
  }
  // mounted () {
  //   console.log(this.$el)
  //   navigator.mediaDevices.enumerateDevices().then(devices => {
  //     console.log('devices', devices)
  //     devices = devices.filter(v => (v.kind === 'videoinput'))
  //     console.log('Found ' + devices.length + ' video devices')
  //     let lastDevice = devices[devices.length - 1]
  //     devices = devices.filter(v => (v.label.indexOf('back') > 0))
  //     let device = null
  //     if (devices.length > 0) {
  //       console.log("Taking a 'back' camera")
  //       device = devices[devices.length - 1]
  //     } else {
  //       console.log('Taking last camera')
  //       device = lastDevice
  //     }

  //     if (!device) {
  //       console.log('No devices!')
  //       return
  //     }

  //     let constraints =
  //     {
  //       audio: false,
  //       video: true
  //     }
  //     navigator.mediaDevices.getUserMedia(constraints)
  //       .then(stream => {
  //         if (this.$el.srcObject) { this.$el.srcObject = stream } else { this.$el.src = URL.createObjectURL(stream) }
  //         // info.innerHTML+= "<pre>DONE</pre>";
  //         console.log('DONE')
  //       })
  //       .catch(err => {
  //         console.log(err.name + ': ' + err.message)
  //       })
  //   })
  //     .catch(err => {
  //       console.error(err)
  //       console.log(err.name + ': ' + err.message)
  //     })
  // }
}
</script>

<style>

</style>
