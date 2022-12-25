import type { PrinterOptions } from './types'
import { syntheticEvent } from './synthetic-event'
import { removeNode } from './utils'
import { CanvasImageClassName, CanvasImageSelector, HTMLStandards } from './constants'

const each = Array.prototype.forEach

export class Printer {
  private options: PrinterOptions

  constructor(options: PrinterOptions) {
    if (!options.id) {
      throw new Error(`[browswer-print] Make sure options.id is provided`)
    }

    const defaultOptions: Omit<PrinterOptions, 'id'> = {
      standard: HTMLStandards.HTML5,
    }

    this.options = { ...options, ...defaultOptions }
    this.init()
  }

  private init() {
    const timeStamp = new Date().getTime()
    const frameId = `print-iframe-${timeStamp}`

    const iframe = this.createIframe(frameId, String(timeStamp))
    this.writeIframe(iframe.contentDocument)
  }

  private createIframe(frameId: string, url: string) {
    const iframe = document.createElement('iframe')

    iframe.style.border = '0px';
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.right = '0px';
    iframe.style.top = '0px';
    iframe.setAttribute('id', frameId);
    iframe.setAttribute('src', url);

    const remove = syntheticEvent.addListener(iframe, 'load', () => {
      this.print(iframe)
      remove()
    })

    document.body.appendChild(iframe)

    return iframe
  }

  private writeIframe(doc: Document | null) {
    if (!doc) return

    doc.open()
    doc.write(`${this.generateDocType()}<html>${this.generateHead()}${this.generateBody()}</html>`)
    doc.close()
  }

  private generateDocType() {
    if (this.options.standard === HTMLStandards.HTML5) {
      return '<!DOCTYPE html>';
    }

    const transitional = this.options.standard === HTMLStandards.Loose ? ' Transitional' : '';
    const dtd = this.options.standard === HTMLStandards.Loose ? 'loose' : 'strict';
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
  }

  private generateHead() {
    const links: string[] = []
    const styles: string[] = []

    each.call(document.querySelectorAll('link'), (link: HTMLLinkElement) => {
      if (/\.css$/.test(link.href)) {
        links.push(`<link type="text/css" rel="stylesheet" href="${link.href}" >`)
      }
    })
    each.call(document.styleSheets, (sheet: CSSStyleSheet) => {
      try {
        // 这里只处理内联样式，外部链接样式通过上面的 link 标签处理
        if (sheet.href) {
          return
        }
      
        if (sheet.cssRules || sheet.rules) {
          const rules = sheet.cssRules || sheet.rules
  
          each.call(rules, (rule: CSSRule) => {
            styles.push(rule.cssText)
          })
        }
      } catch(e) {
        console.error(`[browser-print] ${sheet.href} ${e}`)
      }
    })

    if (this.options.extraCss) {
      this.options.extraCss.forEach(href => {
        links.push(`<link type="text/css" rel="stylesheet" href="${href}" >`)
      })
    }

    const title = this.options.iframeTitle ?? ''
    const extraHead = this.options.extraHead ?? []

    return `<head><title>${title}</title>${extraHead.join('')}${links.join('')}<style type="text/css">${styles.join('')}</style></head>`
  }

  private generateBody() {
    const target = document.getElementById(this.options.id.replace(/^#/, ''))

    if (!target) {
      console.warn(`[browser-print] cannot found element '${this.options.id}'`)
      return '<body></body>'
    }

    const el = this.preprocess(target)
    return `<body>${el.outerHTML}</body>`
  }

  private preprocess(target: HTMLElement) {
    const canvases = target.querySelectorAll('canvas')

    each.call(canvases, canvas => {
      const dataUrl = canvas.toDataURL('image/png')
      const image = new Image()
      image.className = CanvasImageClassName
      image.src = dataUrl
      image.style.display = 'none'
      canvas.parentNode?.appendChild(image)
    })

    const el = target.cloneNode(true) as HTMLElement
    const canvasLikes = el.querySelectorAll(`${CanvasImageSelector}, canvas`)

    each.call(canvasLikes, (element) => {
      if (element.tagName.toLowerCase() === 'canvas') {
        element.parentNode?.removeChild(element)
      } else {
        (element as HTMLElement).style.display = 'block'
      }
    })

    const inputs = el.querySelectorAll('input')
    each.call(inputs, input => {
      const type = input.getAttribute('type')
      
      if (!type) return

      if (['checkbox', 'radio'].indexOf(type) > -1) {
        if (input.checked) {
          input.checked = true
          input.setAttribute('checked', 'true')
        } else {
          input.checked = false
        }
      } else {
        input.setAttribute('value', input.value)
      }
    })

    const selects = el.querySelectorAll('select')
    const originalSelects = target.querySelectorAll('select')
    each.call(selects, (select, i) => {
      const { selectedIndex } = originalSelects[i].options
      select.options[selectedIndex].setAttribute('selected', 'true')
    })

    const textareas = el.querySelectorAll('textarea')
    each.call(textareas, textarea => {
      textarea.setAttribute('html', textarea.value)
      textarea.innerHTML = textarea.value
    })

    return el
  }

  private print(iframe: HTMLIFrameElement) {
    const win = iframe.contentWindow

    if (!win) return null

    win.focus()
    this.options.onBeforeOpen?.()
    win.print()
    this.options.onOpen?.()
    removeNode(iframe)
    this.clear(iframe)
  }

  private clear(iframe: HTMLIFrameElement) {
    const canvasImages = document.querySelectorAll(CanvasImageSelector)
    each.call(canvasImages, el => {
      el.parentNode?.removeChild(el)
    })

    removeNode(iframe)
  }
}
