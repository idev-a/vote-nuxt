<template>
  <section>
        <div>
          <h3 class="title is-3">{{ $t('request.sig.title') }}</h3>
          <transition-group name="fade">
            <div class="content is-size-6" v-if="!webCamCapture && (!croppedPic || !croppedPic.imageSet)" key="start">
              <ul>
                <li>{{$t('request.sig.signName')}}</li>
                <i18n path="request.sig.scanInstructions" tag="li" v-if="canCaptureImage">
                  <a @click="() => {webcamCaptureError = false; webCamPic = null; croppedPic.remove(); startCameraFilePicker()}" class="has-text-primary">{{$t('request.sig.clickStart')}}</a>
                  <a @click="uploadPic" class="has-text-primary">{{$t('request.sig.uploadFileImageNoPDF')}}</a>
                </i18n>
                <i18n v-else  tag="li" path="request.sig.uploadInstructions">
                  <a @click="croppedPic.chooseFile()" class="has-text-primary">{{$t('request.sig.clickToUpload')}}</a>
                </i18n>
                <li v-if="canCaptureImage">{{$t('request.sig.adjustAfterTake')}}</li>
                <li v-else>{{$t('request.sig.adjustAfterUpload')}}</li>
              </ul>
          </div>
          <div key="capturingImage" class="content is-size-6" v-if="webCamCapture && !webcamCaptureError">
            <ul>
              <li>{{$t('request.sig.sigPlacementInstructions')}}</li>
            </ul>
          </div>
          <div key="imageAdjust" class="content is-size-6" v-if="!webCamCapture && croppedPic && croppedPic.imageSet">
            <ul>
              <li>{{$t('request.sig.resizeInstructions')}}</li>
              <li>{{$t('request.sig.moveInstructions')}}</li>
              <li>{{$t('request.sig.useSignatureInstructions')}}</li>
            </ul>
          </div>
          </transition-group>
          <b-message
            class="content"
            :active="webcamCaptureError && !(croppedPic && croppedPic.imageSet)"
            :closable="false"
            :title="$t('request.sig.captureErrorTitle')"
            type="is-danger">
            <i18n path="request.sig.captureErrorMessage" tag="span">
              <a @click="uploadPic" class="has-text-primary">{{$t('request.sig.uploadFile')}}</a>
            </i18n>
            <!-- We could not get access your device camera. (Either it is not connected/available or you have disallowed VoteFromAbroad.org from accessing it). You can still click <a @click="uploadPic" class="has-text-primary">upload a file</a> to upload your signature from a file. -->
          </b-message>
          <!-- <b-message
            class="content"
            :active="!webCamCapture && canCaptureImage && (!croppedPic || !croppedPic.imageSet)"
            :closable="false"
            :title="$t('request.sig.instructionsLabel')"
            type="is-info">
            {{$t('request.sig.captureSignInstructions')}}
          </b-message> -->
          <!-- <b-message
            class="content"
            :active="!webCamCapture && !canCaptureImage && (!croppedPic || !croppedPic.imageSet)"
            :closable="false"
            :title="$t('request.sig.instructionsLabel')"
            type="is-info">
            {{$t('request.sig.captureUploadInstructions')}}
          </b-message> -->
          <!-- <b-message
            class="content"
            :active="webCamCapture && !webcamCaptureError"
            :closable="false"
            :title="$t('request.sig.instructionsLabel')"
            type="is-info">
            {{$t('request.sig.sigPlacementInstructions')}}
          </b-message> -->
          <!-- <b-message
            :active="!webCamCapture && croppedPic && croppedPic.imageSet"
            :closable="false"
            class="content"
            :title="$t('request.sig.instructionsLabel')"
            type="is-info">
            <ul>
              <li>{{$t('request.sig.resizeInstructions')}}</li>
              <li>{{$t('request.sig.moveInstructions')}}</li>
              <li>{{$t('request.sig.useSignatureInstructions')}}</li>
            </ul> -->
            <!-- v-html="md($t('request.sig.sigAdjustmentInstructions'))"> -->
            <!-- {{$t('request.sig.sigAdjustmentInstructions')}} -->
            <!-- - Align your signature with the red line -- drag to move, scroll to zoom. If you don't see your signature, you may need to zoom out to get it back on the page.<br>- Adjust your signature with the 'Line Strength' buttons below so that the signature is clear and has minimal background noise<br>- If your signature is still unclear, you can click 'Clear Image' to try again.<br>- Click 'Use This Signature' to add it to your form and compose a message to your election official. -->
          <!-- </b-message> -->
            <h3 class="subtitle is-5 has-text-info has-text-centered" v-if="processingImage">{{$t('request.sig.pleaseWait')}}</h3>
            <submit-get-camera ref="webcam" @captureError="captureError" :isCapturing="webCamCapture" v-show="webCamCapture" @updatePic="drawThresholdToCanvas"></submit-get-camera>
            <nav class="level" v-if="croppedPic && croppedPic.hasImage()">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">{{$t('request.sig.resizeLabel')}}</p>
                  <b-field>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.zoomIn')">
                        <button
                          class="button"
                          @click="zoom('in')">
                          <span class="icon is-small">
                            <i class="fas fa-search-plus"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.zoomOut')">
                        <button
                          class="button"
                          @click="zoom('out')">
                          <span class="icon is-small">
                            <i class="fas fa-search-minus"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                  </b-field>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">{{$t('request.sig.positionLabel')}}</p>
                  <b-field>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.moveLeft')">
                        <button
                          class="button"
                          @click="move('left')">
                          <span class="icon is-small">
                            <i class="fas fa-chevron-left"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.moveUp')">
                        <button
                          class="button"
                          @click="move('up')">
                          <span class="icon is-small">
                            <i class="fas fa-chevron-up"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.moveDown')">
                        <button
                          class="button"
                          @click="move('down')">
                          <span class="icon is-small">
                            <i class="fas fa-chevron-down"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.moveRignt')">
                        <button
                          class="button"
                          @click="move('right')">
                          <span class="icon is-small">
                            <i class="fas fa-chevron-right"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                  </b-field>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">{{$t('request.sig.brightnessLabel')}}</p>
                  <b-field>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.darker')">
                        <button
                          class="button"
                          @click="decreaseCompensation">
                          <span class="icon is-small">
                            <i class="fas fa-minus"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.lighter')">
                        <button
                          class="button"
                          @click="increaseCompensation">
                          <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                  </b-field>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">{{$t('request.sig.rotateLabel')}}</p>
                  <b-field>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.rotateLeft')">
                        <button
                          class="button"
                          @click="rotate(-1)">
                          <span class="icon is-small">
                            <i class="fas fa-undo"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                    <p class="control">
                      <b-tooltip :label="$t('request.sig.rotateRight')">
                        <button
                          class="button"
                          @click="rotate(1)">
                          <span class="icon is-small">
                            <i class="fas fa-redo"></i>
                          </span>
                        </button>
                      </b-tooltip>
                    </p>
                  </b-field>
                </div>
              </div>
            </nav>
            <signature-cropper
              v-show="!webCamCapture"
              :style="!croppedPic || !croppedPic.imageSet ? 'background: whitesmoke; background-image:none;': ''"
              v-model="croppedPic"
              ref="cp"
              :placeholder="cropperPlaceholder"
              accept="image/*"
              :zoom-speed="2"
              :auto-sizing="true"
              :show-loading="true"
              :disable-click-to-choose="device && device.inputCaptureSupported ? false : true"
              :replace-drop="true"
              :quality="device.type === 'mobile' && device.orientation === 'portrait' ? 4 : 2"
              @click="() => { if (!canCaptureImage) { croppedPic.chooseFile() } if (!croppedPic || !(croppedPic.hasImage())) { startCameraFilePicker() } }"
              @image-remove="webCamPic = null"
              @file-choose="drawFromFile"
              @file-type-mismatch="handleFileTypeMismatch"
              @new-image="drawThresholdToCanvas"
              @draw="onDraw"
              :initial-image="thresholdedPic"
              initial-size="cover">
              <img slot="intitial" :src="webCamPic" />
            </signature-cropper>
              <!-- @init.once="$refs.cp.refresh()" -->
              <!-- :input-attrs="inputAttrs" -->
              <!-- :file-size-limit="1000000"
              @file-size-exceed="handleFileSizeExceed"
              @file-type-mismatch="handleFileTypeMismatch" -->
            <b-field>
              <b-field grouped>
                <b-field v-if="croppedPic && croppedPic.imageSet">
                  <button :class="['button', 'is-light', 'is-medium', {'is-loading': processingImage}]"
                    @click.prevent="clearImage"
                    :disabled="!croppedPic || !croppedPic.imageSet">
                    {{$t('request.sig.tryAgain')}}
                    <!-- Clear Image -->
                  </button>
                </b-field>
                <b-field expanded>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': processingImage}]"
                    v-if="croppedPic && croppedPic.imageSet"
                    @click.prevent="useSignature"
                    :disabled="!croppedPic || !croppedPic.imageSet">
                    {{$t('request.sig.useSignature')}}
                    <!-- Use This Signature -->
                    <!-- {{$t('request.sig.sendEmail')}} -->
                  </button>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    @click="captureWebcamImage"
                    v-else-if="webCamCapture && !webcamCaptureError">
                    {{$t('request.sig.takePhoto')}}
                    <!-- Take Photo -->
                  </button>
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': false}]"
                    @click="uploadPic"
                    v-else-if="webcamCaptureError || !canCaptureImage">
                    {{$t('request.sig.uploadFile')}}
                    <!-- Upload a File -->
                  </button>
                  <!-- <a @click="croppedPic.chooseFile()" class="has-text-primary">upload a file</a> -->
                  <button :class="[buttonClass, 'is-fullwidth', {'is-loading': processingImage}]"
                    v-else
                    @click.prevent="() => {webCamPic = null; croppedPic.remove(); startCameraFilePicker()}">
                    {{$t('request.sig.start')}}
                    <!-- Start -->
                  </button>
                </b-field>
              </b-field>
            </b-field>
        </div>
  </section>
</template>

<script>
import SubmitGetCamera from '~/components/SubmitGetCamera'
import { mapState } from 'vuex'
import snarkdown from 'snarkdown'
const savePixels = require('save-pixels')
// const getPixels = require('get-pixels')
const ndarray = require('ndarray')
const adaptiveThreshold = require('adaptive-threshold')
const EXIF = require('exif-js')

export default {
  components: {
    SubmitGetCamera
  },
  props: ['value'],
  data () {
    return {
      croppedPic: null,
      processingImage: false,
      webCamPic: null,
      thresholdedPic: null,
      webCamCapture: false,
      sigLine: null,
      size: 24,
      compensation: 7,
      inputCaptureSupported: false,
      webcamCaptureError: false,
      metadata: null,
      blurred: null,
      inputAttrs: {capture: true, class: 'file-input'},
      imageNotSetClass: { background: 'whitesmoke', maxWidth: '640px', width: '100%', paddingBottom: '25%', position: 'relative' },
      imageSetClass: { background: 'url(/sigLine.png) no-repeat cover', maxWidth: '640px', width: '100%', paddingBottom: '25%', position: 'relative' },
      buttonClass: {
        button: true,
        'is-primary': true,
        'is-medium': true,
        'is-fullwidth': true
      }
    }
  },
  computed: {
    cropperPlaceholder () {
      if (this.processingImage) {
        return '...'
      } else return this.canCaptureImage ? this.$t('request.sig.clickToStart') : this.$t('request.sig.uploadAFile')
    },
    device () { return this.$store.state.userauth.device },
    ...mapState({
      canCaptureImage: state => state.userauth.device.hasWebCam
    })
  },
  methods: {
    md (md) { return snarkdown(md) },
    handleFileTypeMismatch () {
      this.processingImage = false
      this.clearImage()
    },
    clearImage () {
      this.webCamPic = null
      this.thresholdedPic = null
      this.croppedPic.remove()
    },
    async uploadPic () {
      this.inputAttrs = {class: 'file-input'}
      this.clearImage()
      this.croppedPic.refresh()
      // await this.$nextTick()
      this.croppedPic.chooseFile()
      setTimeout(() => {
        this.inputAttrs = {capture: true, class: 'file-input'}
        this.croppedPic.refresh()
      }, 500)
    },
    captureWebcamImage () {
      this.processingImage = true
      this.$nextTick()
        .then(() => {
          if (this.$refs && this.$refs.webcam) this.$refs.webcam.takePhoto()
        })
        .catch(e => { console.error('captureWebcamImage error', e) })
    },
    handleFileSizeExceed () {
      this.$dialog.alert({
        title: 'Image too large',
        message: 'That image is too large, please choose a smaller image.',
        type: 'is-danger'
      })
    },
    captureError () {
      this.webcamCaptureError = true
    },
    useSignature () {
      this.$emit('sigcap', this.croppedPic.generateDataUrl())
    },
    startCameraFilePicker () {
      if (!this.croppedPic || !this.croppedPic.hasImage()) {
        if (this.device && !this.device.inputCaptureSupported) {
          this.thresholdedPic = null
          this.webCamCapture = true
        } else { this.captureSignature() }
      }
    },
    captureSignature () {
      this.croppedPic.chooseFile()
    },
    rotate (val) {
      this.croppedPic.rotate(val)
    },
    move (dir) {
      let speed = 10
      switch (dir) {
        case 'up':
          this.croppedPic.moveUpwards(speed)
          break
        case 'down':
          this.croppedPic.moveDownwards(speed)
          break
        case 'left':
          this.croppedPic.moveLeftwards(speed)
          break
        case 'right':
          this.croppedPic.moveRightwards(speed)
          break
      }
    },
    zoom (dir) {
      switch (dir) {
        case 'in':
          this.croppedPic.zoomIn()
          break
        case 'out':
          this.croppedPic.zoomOut()
          break
      }
    },
    increaseCompensation () {
      this.processingImage = true
      this.$nextTick()
        .then(() => {
          this.metadata = this.croppedPic.getMetadata()
          this.thresholdedPic = null
          this.compensation = this.compensation + 3
          this.size = this.size + 3
          this.drawThresholdToCanvas(null)
        })
        .catch(e => { console.error('increaseCompensation error', e) })
    },
    decreaseCompensation () {
      this.processingImage = true
      this.$nextTick()
        .then(() => {
          this.metadata = this.croppedPic.getMetadata()
          this.thresholdedPic = null
          this.compensation = this.compensation - 3
          this.size = this.size - 3
          this.drawThresholdToCanvas(null)
        })
        .catch(e => { console.error('decreaseCompensationError', e) })
    },
    increaseSize () {
      this.metadata = this.croppedPic.getMetadata()
      this.size = this.size + 1
      this.drawThresholdToCanvas()
    },
    drawFromFile (file) {
      this.processingImage = true
      this.$nextTick()
        .then(() => {
          let needsRotation
          EXIF.getData(file, function () { needsRotation = (EXIF.getTag(this, 'Orientation')) > 4 })
          this.thresholdedPic = null
          let reader = new FileReader()
          reader.onload = () => {
            let img = new Image()
            img.onload = () => {
              let maxWidth = 1280
              let maxHeight = 720
              let width = img.width
              let height = img.height
              let isTooLarge = false

              if (width >= height && width > maxWidth) {
                height *= maxWidth / width
                width = maxWidth
                isTooLarge = true
              } else if (height > maxHeight) {
                width *= maxHeight / height
                height = maxHeight
                isTooLarge = true
              }

              if (!isTooLarge) {
                // return file here
                this.webCamPic = reader.result
                this.drawThresholdToCanvas(reader.result)
              } else {
                let canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                if (width < height || needsRotation) {
                  ctx.rotate(-Math.PI / 2)
                }
                this.drawThresholdToCanvas(canvas.toDataURL())
                ctx = null
                canvas = null
              }
            }
            img.src = reader.result
          }
          reader.readAsDataURL(file)
        })
        .catch(e => { console.error('drawFromFileError', e) })
    },
    async drawThresholdToCanvas (imgUrl) {
      function getPix (imgUrl) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.onload = function () {
            var canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            let pixels = ctx.getImageData(0, 0, img.width, img.height)
            let arr = ndarray(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4 * img.width, 1], 0)
            ctx = null
            canvas = null
            resolve(arr)
          }
          img.onerror = function (err) {
            console.error('img.onload error', err)
            reject(err)
          }
          img.src = imgUrl
        })
      }
      this.processingImage = true
      this.$nextTick()
        .then(async () => {
          if (!this.thresholdedPic) {
            this.webCamCapture = false
            this.webCamPic = imgUrl || this.webCamPic
            let pixels
            try {
              pixels = await getPix(this.webCamPic)
            } catch (e) {
              console.error('await getPixels', e)
            }
            let thresholded = adaptiveThreshold(pixels, {size: this.size, compensation: this.compensation})
            let cnv = savePixels(thresholded, 'canvas') // returns canvas element
            let ctx = cnv.getContext('2d')
            let imgData = ctx.getImageData(0, 0, cnv.width, cnv.height)
            for (let x = 3; x < imgData.data.length; x += 4) {
              imgData.data[x] = Math.abs(255 - imgData.data[x - 1])
            }
            ctx.putImageData(imgData, 0, 0)
            this.thresholdedPic = cnv.toDataURL()
            ctx = null
            cnv = null
            this.croppedPic.refresh()
            this.processingImage = false
          } else {
            this.croppedPic.refresh()
            this.processingImage = false
          }
        })
        .catch(e => { console.error('nextTick adaptiveThreshold error', e) })
    },
    onDraw: function (ctx) {
      ctx.save()
      ctx.globalAlpha = 0.9
      ctx.restore()
      if (this.metadata) this.croppedPic.applyMetadata(this.metadata)
      this.metadata = null
    },
    editImg: function (imgData, canvasWidth, canvasHeight, lowerBound, upperBound) {
      var data = imgData.data.slice()
      let monoData = []
      for (var i = 0; i < data.length; i += 4) {
        monoData[i / 4] = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3)
      }
      let sorted = monoData.slice().sort()
      let lowerBoundPix = sorted[Math.floor(lowerBound / 100 * monoData.length)]
      let upperBoundPix = sorted[Math.floor(upperBound / 100 * monoData.length)]

      for (let i = 0; i < monoData.length; i++) {
        let adj
        if (monoData[i] < lowerBoundPix) {
          adj = 0
        } else if (monoData[i] > upperBoundPix) {
          adj = 255
        } else {
          adj = Math.floor(255 - ((upperBoundPix - monoData[i]) / (upperBoundPix - lowerBoundPix) * 255))
        }
        var alpha = 255 - adj
        data[i * 4] = adj // red
        data[i * 4 + 1] = adj // green
        data[i * 4 + 2] = adj // blue
        data[i * 4 + 3] = alpha // alpha
      }
      var imgd = new ImageData(1200, 800)
      imgd.data.set(data)
      return imgd
    }
  },
  mounted () {
    this.sigLine = new Image()
    this.sigLine.src = '/lineOnly.png'
  }
}
</script>

<style>
.sk-fading-circle {
  position: absolute; }
  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; }
  .sk-fading-circle .sk-circle .sk-circle-indicator {
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1s infinite ease-in-out both;
            animation: sk-circleFadeDelay 1s infinite ease-in-out both; }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
            transform: rotate(30deg); }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
            transform: rotate(60deg); }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
            transform: rotate(90deg); }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
            transform: rotate(120deg); }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
            transform: rotate(150deg); }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
            transform: rotate(180deg); }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
            transform: rotate(210deg); }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
            transform: rotate(240deg); }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
            transform: rotate(270deg); }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
            transform: rotate(300deg); }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
            transform: rotate(330deg); }
  .sk-fading-circle .sk-circle2 .sk-circle-indicator {
    -webkit-animation-delay: -0.91667s;
            animation-delay: -0.91667s; }
  .sk-fading-circle .sk-circle3 .sk-circle-indicator {
    -webkit-animation-delay: -0.83333s;
            animation-delay: -0.83333s; }
  .sk-fading-circle .sk-circle4 .sk-circle-indicator {
    -webkit-animation-delay: -0.75s;
            animation-delay: -0.75s; }
  .sk-fading-circle .sk-circle5 .sk-circle-indicator {
    -webkit-animation-delay: -0.66667s;
            animation-delay: -0.66667s; }
  .sk-fading-circle .sk-circle6 .sk-circle-indicator {
    -webkit-animation-delay: -0.58333s;
            animation-delay: -0.58333s; }
  .sk-fading-circle .sk-circle7 .sk-circle-indicator {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s; }
  .sk-fading-circle .sk-circle8 .sk-circle-indicator {
    -webkit-animation-delay: -0.41667s;
            animation-delay: -0.41667s; }
  .sk-fading-circle .sk-circle9 .sk-circle-indicator {
    -webkit-animation-delay: -0.33333s;
            animation-delay: -0.33333s; }
  .sk-fading-circle .sk-circle10 .sk-circle-indicator {
    -webkit-animation-delay: -0.25s;
            animation-delay: -0.25s; }
  .sk-fading-circle .sk-circle11 .sk-circle-indicator {
    -webkit-animation-delay: -0.16667s;
            animation-delay: -0.16667s; }
  .sk-fading-circle .sk-circle12 .sk-circle-indicator {
    -webkit-animation-delay: -0.08333s;
            animation-delay: -0.08333s; }

@-webkit-keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0; }
  40% {
    opacity: 1; } }

@keyframes sk-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0; }
  40% {
    opacity: 1; } }

.croppa-container {
  display: inline-block;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  position: relative;
  font-size: 0;
  -ms-flex-item-align: start;
      align-self: flex-start;
  background-color: #e6e6e6;
}
.croppa-container canvas {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.croppa-container:hover {
  opacity: 0.7;
}
.croppa-container.croppa--dropzone {
  -webkit-box-shadow: inset 0 0 10px #333;
          box-shadow: inset 0 0 10px #333;
}
.croppa-container.croppa--dropzone canvas {
  opacity: 0.5;
}
.croppa-container.croppa--disabled-cc {
  cursor: default;
}
.croppa-container.croppa--disabled-cc:hover {
  opacity: 1;
}
.croppa-container.croppa--has-target {
  cursor: move;
}
.croppa-container.croppa--has-target:hover {
  opacity: 1;
}
.croppa-container.croppa--has-target.croppa--disabled-mz {
  cursor: default;
}
.croppa-container.croppa--disabled {
  cursor: not-allowed;
}
.croppa-container.croppa--disabled:hover {
  opacity: 1;
}
.croppa-container.croppa--passive {
  cursor: default;
}
.croppa-container.croppa--passive:hover {
  opacity: 1;
}
.croppa-container svg.icon-remove {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  -webkit-filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.7));
          filter: drop-shadow(-2px 2px 2px rgba(0,0,0,0.7));
  z-index: 10;
  cursor: pointer;
  border: 2px solid #fff;
}
.bAndW {
  filter: brightness(150%) contrast(130%) grayscale(100%)
}
.croppa-container {
  background: no-repeat url(/sigLine.png);
  background-size: cover;
  max-width: 640px;
  width: 100%;
  padding-bottom: 25%;
  position: relative;
}
.croppa-container > canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
