import devtools from '@vue/devtools'
import Vue from 'vue'

Vue.use(devtools)
// console.log(process.env.NODE_ENV)
// if (process.env.NODE_ENV === 'development') {
devtools.connect('http://10.0.1.12', 8098)
// }
