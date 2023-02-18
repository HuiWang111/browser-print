import type { PluginObject } from 'vue'
import { PrintDirective } from './directive'

const print = PrintDirective();

(print as PluginObject<{}>).install = function(Vue) {
  Vue.directive('print', print)
}

export default print as PluginObject<{}>

export type { PrinterConfig } from './directive'
