// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

class SyntheticEvent {
  addListener(el: any, type: string, listener: () => void) {
    if (!el) return noop

    if (el.addEventListener) {
      el.addEventListener(type, listener)
      return () => {
        el.removeEventListener(type, listener)
      }
    }

    const event = `on${type}`
    if (el.attachEvent) {
      el.attachEvent(event, listener)
      return () => {
        el.detachEvent(event, listener)
      }
    }

    el[event] = listener
    return () => {
      el[event] = null
    }
  }
}

export const syntheticEvent = new SyntheticEvent()