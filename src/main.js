import Vue
  from 'vue'
import App
  from '@/App.vue'
import router
  from 'router'
import store
  from '@/store'
import vuetify
  from '@/plugins/vuetify'
import {firestorePlugin} from 'vuefire'
import {auth} from '@/firebase-config'
import * as moment
  from "moment";
import '@/assets/less/styles.less'


Vue.use(firestorePlugin)

moment.locale('fr')

// String.prototype.toHex = function() {
//   let hash = 0;
//   if (this.length === 0) return hash;
//   for (let i = 0; i < this.length; i++) {
//     hash = this.charCodeAt(i) + ((hash << 5) - hash);
//     hash = hash & hash;
//   }
//   let color = '#';
//   for (let i = 0; i < 3; i++) {
//     let value = (hash >> (i * 8)) & 255;
//     color += ('00' + value.toString(16)).substr(-2);
//   }
//   return color;
// }


let app = ''

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    objectIsEmpty(a) {
      return Object.keys(a).length === 0
    },
  }
})

// auth.onAuthStateChanged(user => {
//   if (user) {
//     user.getIdToken(true).then(token => {
//       store.dispatch('user/setToken', token)
//     })
//   }
// })

// Prevents loading anything before Firebase is initialized
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})

