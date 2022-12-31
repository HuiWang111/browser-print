import type { Plugin } from 'vue'
import { PrintDirective } from './directive'

const print = PrintDirective();

(print as Plugin).install = function(Vue) {
  Vue.directive('print', print)
}

export default print
