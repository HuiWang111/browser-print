/* eslint-disable @typescript-eslint/ban-ts-comment */
export function isIE(): boolean {
  return 'ActiveXObject' in window
}

export function isIE11(): boolean {
  return (/Trident\/7\./).test(navigator.userAgent)
}

export function removeNode(node: Element | null): void {
  if (!node) return

  if (isIE()) {
    // @ts-ignore
    node.removeNode(true)
  } else {
    node.remove()
  }
}

export function getComputedStyle(el: HTMLElement | null, prop: string): any {
  if (!el) return

  // @ts-ignore
  if (window.getComputedStyle) {
    return window.getComputedStyle(el, null).getPropertyValue(prop)
  }
  // @ts-ignore
  return el.currentStyle[prop]
}
