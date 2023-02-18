declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>

  export interface HTMLAttributes {
    vModel?: any;
  }
  export default component
}