import type { App } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

export default function (app: App) {
  app.use(Antd)
}