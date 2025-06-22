import type { App } from 'vue'
// TODO: Remove ant-design-vue if not needed
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/reset.css'

// LINT-FIX-2025: Disable unused vars check for disabled plugin function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (app: App) {
  // app.use(Antd) - Ant Design is disabled, but signature must match plugin interface
  console.log('Ant Design plugin disabled - remove this file if not needed')
}
