<template>
  <v-app>
    <v-content>
        <v-btn color="error"
               small
               class="logout-btn"
               fixed
               right
               fab
               elevation="0"
               v-show="!!user"
               @click="logout"><v-icon small>mdi-logout</v-icon>
        </v-btn>

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
