<template>
  <div class="field">
  <span class="is-flex"><label class="label">{{ $t('request.dob.label') }}</label><span @click.prevent="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field
    :message="v.$error ? Object.entries(v).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.dob.messages.${x[0]}`)) : '' "
    :type="(v.$error ? 'is-danger': '')">
    <b-datepicker v-model="tempDate"
      :date-formatter="dateFormatter"
      :date-parser="dateParser2"
      :readonly="false"
      :mobile-native="allowNative"
      :inline="!allowNative"
      ref="dob"
      @input="val => {showVal(val); $ga.event('formAction', 'focus/select', 'dob')}"
      :focused-date="focusedDate"
      @changeMonth="val => changeMonth(val)"
      @changeYear="val => changeYear(val)"
      @focus="focusDate"
      icon="calendar"
      icon-pack="fas"
      :placeholder="$t('request.dob.placeholder')">
      <div slot="header">
        <div class="field is-centered" v-if="componentLoaded">
          <span class="help is-primary is-size-6" v-html="$t('request.dob.selectDate')"></span>
          <b-input
            v-if="!allowNative"
            v-model="dateNoNative"
            @keyup.enter="dob = dateParser2(dateNoNative)"
            @blur="dob = dateParser2(dateNoNative)"
            :placeholder="$t('request.dob.placeholder')"></b-input>
        </div>
        <div class="pagination field is-centered" v-if="componentLoaded">
          <div class="pagination-list">
            <b-field>
              <b-select
                :value="focusedDateData.year"
                @input="val => changeYear(val)">
                <option
                  v-for="year in listOfYears"
                  :value="year"
                  :key="year">
                  {{ year }}
                </option>
              </b-select>
              <b-select
                :value="focusedDateData.month"
                @input="val => changeMonth(val)">
                <option
                  v-for="(month, index) in monthNames"
                  :value="index"
                  :key="month">
                  {{ month }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
      </div>
    </b-datepicker>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
    <slot name="tooltip"></slot>
  </b-message>
  <b-modal :active.sync="isCardModalActive" :width="640" scroll="keep" has-modal-card v-if="componentLoaded">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{$t('request.dob.disambiguationTitle')}}</p>
      </header>
      <section class="modal-card-body">
        <i18n tag="span" path="request.dob.disambiguationMessage">
          <span class="is-italic">"{{ inputText }}"</span>
        </i18n>
        <b-field v-for="date in dateChoices" :key="date.getTime()">
          <a @click="() => { addDate(date) }" class="button is-primary is-fullwidth">
            {{ dateFormatter(date) }}
          </a>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <a class="button" type="button" @click="closeModal">{{$t('request.dob.cancel')}}</a>
      </footer>
    </div>
  </b-modal>
</div>
</template>

<script>
import { returnArrayOfReasonableBirthDates } from '~/utils/helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'date-of-birth',
  props: [
    'value',
    'message',
    'v',
    'tooltipTitle'
  ],
  data () {
    return {
      tempDate: null,
      dateNoNative: '',
      // maxDate: new Date(2000, 10, 6),
      // minDate: new Date(1900, 0, 1),
      toolTipOpen: false,
      isCardModalActive: false,
      dateChoices: [],
      inputText: '',
      componentLoaded: false,
      monthNames: [
        this.$t('request.dob.months.jan'),
        this.$t('request.dob.months.feb'),
        this.$t('request.dob.months.mar'),
        this.$t('request.dob.months.apr'),
        this.$t('request.dob.months.may'),
        this.$t('request.dob.months.jun'),
        this.$t('request.dob.months.jul'),
        this.$t('request.dob.months.aug'),
        this.$t('request.dob.months.sep'),
        this.$t('request.dob.months.oct'),
        this.$t('request.dob.months.nov'),
        this.$t('request.dob.months.dec')
      ],
      focusedDate: new Date(2000, 10, 5),
      focusedDateData: {
        month: 10,
        year: 2000
      }
    }
  },
  created () {
    if (this.dob) {
      this.focusedDate = this.dob
      this.focusedDateData = {
        month: this.dob.getMonth(),
        year: this.dob.getFullYear()
      }
      this.tempDate = this.dob
    }
  },
  mounted () {
    this.$nextTick()
      .then(() => {
        this.componentLoaded = true
      })
  },
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
    listOfYears () {
      const latestYear = this.maxDate
        ? this.maxDate.getFullYear()
        : 2004
      const earliestYear = this.minDate
        ? this.minDate.getFullYear() : 1900
      const arrayOfYears = []
      for (let i = earliestYear; i <= latestYear; i++) {
        arrayOfYears.push(i)
      }
      return arrayOfYears.reverse()
    },
    dob: {
      get () {
        let dob = this.getCurrent.dob
        function createDateObj (d) { return new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2)) }
        return typeof dob === 'string' ? createDateObj(dob) : undefined
      },
      set (val) {
        this.$emit('test', val.getDate())
        function createDateString (d) { return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 10 ? '0' : ''}${d.getDate()}` }
        let d = val instanceof Date ? createDateString(val) : null
        this.$store.commit('requests/update', { dob: d })
        this.$emit('input', d)
        if (val && val instanceof Date) {
          this.focusedDate = val
          this.tempDate = val
          this.dateNoNative = this.dateFormatter(val)
        }
      }
    },
    allowNative () {
      return Boolean(!(/mobile|tablet/i.test(this.$store.state.userauth.device.type)))
      // return Boolean(!(/mobile|tablet/i.test(this.$store.state.userauth.device.type) && this.$store.state.userauth.device.os === 'android'))
      // test
    },
    ...mapGetters('requests', ['getCurrent'])
  },
  methods: {
    focusDate () {
      if (this.dob) {
        this.focusedDate = this.dob
        this.focusedDateData = {
          month: this.dob.getMonth(),
          year: this.dob.getFullYear()
        }
      } else {
        this.focusedDate = new Date(this.focusedDateData.year || 2000, this.focusedDateData.month || 10)
      }
    },
    closeModal () {
      this.dob = null
      this.isCardModalActive = false
    },
    showVal (val) {
      console.log(val)
    },
    changeMonth (month) {
      this.focusedDateData = Object.assign({}, this.focusedDateData, {month})
      this.focusedDate = new Date(this.focusedDateData.year, this.focusedDateData.month)
    },
    changeYear (year) {
      this.focusedDateData = Object.assign({}, this.focusedDateData, {year})
      this.focusedDate = new Date(this.focusedDateData.year, this.focusedDateData.month)
    },
    addDate (date) {
      // console.log('date', date, this)
      this.$nextTick()
        .then(() => {
          this.dob = date
          this.tempDate = date
          this.$nextTick()
            .then(() => {
              this.isCardModalActive = false
            })
        })
    },
    dateParser2 (input) {
      this.$emit('dateParser', input)
      let choices = returnArrayOfReasonableBirthDates(input)
      // console.log('date choices', choices)
      if (choices.length > 1) {
        this.inputText = input
        this.dateChoices = choices
        this.isCardModalActive = true
      } else if (choices.length === 1) {
        return choices[0]
      } else return null
    },
    dateFormatter (d) {
      let ahead2HoursDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 2)
      return ahead2HoursDate.toLocaleDateString(this.dateFormat, { year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  watch: {
    tempDate (val) {
      if (val instanceof Date) {
        this.$emit('tempDate', val)
        this.dob = val
      } else {
        this.dob = null
      }
    }
  }
}
</script>
