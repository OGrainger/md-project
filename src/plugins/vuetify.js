import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import fr from 'vuetify/lib/locale/fr'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  lang: {
    locales: {fr},
    current: 'fr'
  },
  theme: {
    themes: {
      light: {
        primary: '#f1cfc9',
        secondary: '#f1c8a5',
        accent: '#b40129',
        error: '#e8b6c3',
        warning: '#e2664c',
        info: '#b3e1ee',
        success: '#9dcdbf',
      }
    }
  }

});
