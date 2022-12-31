import type { Directive } from 'vue'
import type { PrinterOptions } from '@browser-print/core'
import Printer, { syntheticEvent } from '@browser-print/core'

export interface PrinterConfig extends PrinterOptions {
  shouldToPrint?: () => boolean;
  shouldToPrintAsync?: (resolve: (shouldPrint: boolean) => void) => void;
} 

const DEFAULT_SHOULD_TO_PRINT = () => true

export const PrintDirective = (): Directive<HTMLElement, PrinterConfig | string | undefined> => {
  const getOptions = (o: PrinterConfig | string | undefined) => {
    return typeof o === 'string'
      ? {
        id: o,
        shouldToPrint: DEFAULT_SHOULD_TO_PRINT,
      }
      : {
        shouldToPrint: DEFAULT_SHOULD_TO_PRINT,
        ...o,
      }
  }
  let remove: (() => void) | null = null

  return {
    mounted(el, binding) {
      const options = getOptions(binding.value)
      const print = (o: PrinterConfig | undefined) => {
        if (!o) {
          window.print()
          return
        }

        new Printer(o)
      }

      remove = syntheticEvent.addListener(el, 'click', () => {
        if (options.shouldToPrintAsync) {
          options.shouldToPrintAsync((shouldPrint) => {
            if (shouldPrint) {
              print(options)
            }
          })
        } else if (options.shouldToPrint()) {
          print(options)
        }
      })
    },
    beforeUnmount() {
      if (remove) {
        remove()
        remove = null
      }
    }
  }
}
