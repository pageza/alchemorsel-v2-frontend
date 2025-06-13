// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#304F38', // Deep Green Accent
          secondary: '#F28C28', // Pumpkin Orange
          background: '#DCE7D0', // Background
          surface: '#F8F8F6', // Off White
          accent: '#7EA16B', // Leafy Green
          warning: '#F4E3B5', // Soft Yellow/Beige
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
}) 