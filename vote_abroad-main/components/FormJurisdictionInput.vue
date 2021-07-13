<template>
  <div class="field">
    <!-- <div v-if="isSingleLeoState">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span> -->
      <!-- <slot name="instructions"></slot> -->
      <!-- <p></p>
      <b-field>
        <b-input disabled :value="jurisdiction"></b-input>
      </b-field>
    </div> -->
    <!-- <div v-else> -->
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <slot name="instructions"></slot>
      <!-- Jurisdiction: {{leos.length}} leos found -->
      <!-- <button class="button">Wake County</button> -->
      <b-field v-if="loading">
        <b-input disabled>{{$t('request.jurisdiction.loading')}}</b-input>
      </b-field>
      <b-field v-else
        :type="validations.$error ? 'is-danger' : ''"
        :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.jurisdiction.messages.${x}`)) : '' ">
            <!-- v-model="typedJurisdiction" -->
        <b-field>
          <b-autocomplete
            :value="typedJurisdiction || jurisdiction || ''"
            open-on-focus
            keep-first
            expanded
            @input="(val) => {typedJurisdiction = val; updated()}"
            ref="jurisdiction"
            :data="filteredLeos"
            field="n"
            :placeholder="placeholder"
            @select="option => updateLeo(option)">
            <template slot="empty">No results for {{ typedJurisdiction || jurisdiction }} <a class="button is-primary is-small" @click="() => { typedJurisdiction = ''; $refs.jurisdiction.focus() }">Show all</a></template>
            <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{decodeHtmlEntity(props.option.n)}}&nbsp;</small><span v-if="props.option.suggested" class="tag is-info">{{$t('request.jurisdiction.suggested')}}</span></template>
            </b-autocomplete>
            <p class="control">
                <button class="button is-grey is-inverted is-outlined"
                  @click.prevent="$refs.jurisdiction.focus()">
                  <b-icon icon="chevron-down"></b-icon>
                </button>
            </p>
          </b-field>
        </b-field>
      <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
        <slot name="tooltip"></slot>
      </b-message>
    </div>
  <!-- </div> -->
</template>

<script>
import axios from 'axios'

export default {
  name: 'Jurisdiction',
  props: [
    'value',
    'state',
    'type',
    'label',
    'message',
    'validations',
    'toolTipTitle',
    'placeholder'
  ],
  async mounted () {
    this.loading = true
    let leos = (await axios.get(`/leos/${this.state}-leos.json`)).data
    if (this.state === 'NJ') {
      // leos = leos.filter(x => /FPCA/.test(x.n))
      leos = leos.filter(leo => leo.fpcaOffice)
    }
    this.leos = leos
    // console.log(this.leos)
    // this.leos = await (
    //   await import(
    //     /* webpackChunkName: "leodata" */ `@/data/leos/${this.state}-leos.json`
    //   )
    // )
    if (this.leos.length === 1) {
      this.isSingleLeoState = true
      this.updateLeo(this.leos[0])
    } else {
      this.isSingleLeoState = false
    }
    this.loading = false
  },
  data () {
    return {
      leos: [],
      isSingleLeoState: false,
      typedJurisdiction: '',
      isOpen: false,
      loading: true
    }
  },
  computed: {
    votAdr () {
      return this.$store.getters['requests/getCurrent'].votAdr
    },
    leo () {
      return this.$store.getters['requests/getCurrent'].leo
    },
    jurisdiction () {
      return this.leo && this.leo.n ? this.leo.n : ''
    },
    leoTypes () {
      return [...new Set(this.leos.map(x => x.t))]
    },
    // isSingleLeoState () { return this.leos.length === 1 },
    street: {
      get () {
        return this.votAdr.thoroughfare || ''
      },
      set (value) {
        this.updateAddress('thoroughfare', value)
      }
    },
    myLeos () {
      let villageLeos = []
      let townLeos = []
      let cityLeos = []
      let countyLeos = []
      this.leos.forEach(x => {
        switch (x.t.toLowerCase()) {
          case 'all':
            break
          case 'village':
            if (
              this.votAdr.C &&
              (x.n.toLowerCase().indexOf(
                this.votAdr.C.toLowerCase()
                  .replace('village', '')
                  .trim()
              ) > -1 ||
                x.j.toLowerCase().indexOf(
                  this.votAdr.C.toLowerCase()
                    .replace('village', '')
                    .trim()
                ) > -1)
            ) {
              villageLeos.push(x)
            }
            break
          case 'town':
          case 'township':
            if (
              this.votAdr.C &&
              (x.n.toLowerCase().indexOf(
                this.votAdr.C.toLowerCase()
                  .replace('township', '')
                  .replace('town', '')
                  .trim()
              ) > -1 ||
                x.j.toLowerCase().indexOf(
                  this.votAdr.C.toLowerCase()
                    .replace('township', '')
                    .replace('town', '')
                    .trim()
                ) > -1)
            ) {
              townLeos.push(x)
            }
            break
          case 'parish':
          case 'borough':
          case 'city':
            if (
              this.votAdr.C &&
              (x.n.toLowerCase().indexOf(
                this.votAdr.C.toLowerCase()
                  .replace('parish', '')
                  .replace('borough', '')
                  .replace('city', '')
                  .trim()
              ) > -1 ||
                x.j.toLowerCase().indexOf(
                  this.votAdr.C.toLowerCase()
                    .replace('parish', '')
                    .replace('borough', '')
                    .replace('city', '')
                    .trim()
                ) > -1)
            ) {
              cityLeos.push(x)
            }
            break
          case 'county':
          case 'island':
            if (
              this.votAdr.Y &&
              (x.n.toLowerCase().indexOf(
                this.votAdr.Y.toLowerCase()
                  .replace('county', '')
                  .replace('island', '')
                  .trim()
              ) > -1 ||
                x.j.toLowerCase().indexOf(
                  this.votAdr.Y.toLowerCase()
                    .replace('county', '')
                    .replace('island', '')
                    .trim()
                ) > -1)
            ) {
              countyLeos.push(x)
            }
            break
          default:
            break
        }
      })
      // this.leos.forEach(x => {
      //   switch (x.toLowerCase()) {
      //     case 'county':
      //     case 'island':
      //       if (this.votAdr.Y) {
      //         arr.push(this.leos.filter(x => x.n.indexOf(this.votAdr.Y) > -1))
      //       }
      //       break
      //     case 'town':
      //     case 'village':
      //     case 'city':
      //     case 'parish':
      //     case 'township':
      //     case 'borough':
      //       if (this.votAdr.C) {
      //         arr.unshift(this.leos.filter(x => x.n.indexOf(this.votAdr.C) > -1)[0])
      //       }
      //       break
      //     default:
      //       console.log('other jurisdiction type: ', x)
      //   }
      // })
      // console.log('types', arr)
      return [].concat(villageLeos, townLeos, cityLeos, countyLeos).map(leo => {
        leo.suggested = true
        return leo
      })
    },
    prioritizedLeos () {
      return [].concat(this.myLeos, this.leos)
      // if (this.votAdr.Y) {
      //   let county = this.votAdr.Y.toLowerCase().replace('county', '').trim()
      //   return this.leos.slice()
      //     .sort((a, b) => a.n - b.n)
      //     .sort((a, b) => {
      //       if (
      //         a.n.toLowerCase().indexOf(county) > -1 &&
      //         b.n.toLowerCase().indexOf(county) > -1
      //       ) {
      //         return 1
      //       } else if (a.n.toLowerCase().indexOf(county) > -1) {
      //         return -1
      //       } else if (b.n.toLowerCase().indexOf(county) > -1) {
      //         return 1
      //       } else {
      //         return 0
      //       }
      //     })
      // } else {
      //   return this.leos
      // }
    },
    filteredLeos () {
      if (!this.typedJurisdiction) {
        return this.prioritizedLeos.filter(
          (e, i, a) =>
            !(
              i < 6 &&
              e.suggested &&
              a
                .slice(0, i)
                .map(x => x.i)
                .includes(e.i)
            )
        )
      }
      return this.leos.filter(
        leo =>
          leo.n.toLowerCase().includes(this.typedJurisdiction.toLowerCase()) ||
          leo.j.toLowerCase().includes(this.typedJurisdiction.toLowerCase())
      ).length === 1
        ? this.leos
          .filter(
            leo =>
              leo.n
                .toLowerCase()
                .includes(this.typedJurisdiction.toLowerCase()) ||
                leo.j
                  .toLowerCase()
                  .includes(this.typedJurisdiction.toLowerCase())
          )
          .concat(
            this.prioritizedLeos.filter(
              (e, i, a) =>
                !(
                  i < 6 &&
                    e.suggested &&
                    a
                      .slice(0, i)
                      .map(x => x.i)
                      .includes(e.i)
                )
            )
          )
        : this.leos.filter(
          leo =>
            leo.n
              .toLowerCase()
              .includes(this.typedJurisdiction.toLowerCase()) ||
              leo.j.toLowerCase().includes(this.typedJurisdiction.toLowerCase())
        )
      // return this.prioritizedLeos.filter(leo => leo.n.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1 || leo.j.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1)
    }
  },
  methods: {
    decodeHtmlEntity (str) {
      str = str
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec)
      })
    },
    updateLeo: function (value) {
      let leo = {}
      if (value) {
        Object.keys(value).forEach(x => {
          if (value[x]) leo[x] = value[x]
        })
      }
      delete leo.suggested
      this.$store.commit('requests/update', { leo: leo })
      this.$ga.event('formAction', 'LEO Selected', leo.j)
    },
    updated: function () {
      this.$emit('input')
    }
  }
}
</script>
