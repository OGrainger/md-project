<template>
  <v-app>
    <v-content>
        <router-view :key="$route.fullPath" />
    </v-content>
  </v-app>
</template>

<script>

  import {auth} from "@/firebase-config";

  export default {
    name: 'App',
    components: {},
    data() {
      return {
        user: {}
      }
    },

    computed: {
      //
    },
    methods: {
      logout() {
        auth.signOut().then(() => {
          this.$router.push({name: 'Login'})
        }, (e) => {
          window.alert(e)
        })
      },
      navigate(action) {
        this.$router.push({name: action})
      }
    },

    mounted() {
      auth.onAuthStateChanged(user => {
        this.user = user
      })
    }
  };
</script>
