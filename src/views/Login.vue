<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12
              sm8
              md4>
          <v-text-field
                  v-model="email"
                  label="E-mail"
                  required
                  outlined
                  rounded
                  :error-messages="errors.userNotFound ? 'Utilisateur inconnu' : ''"
          />
          <v-text-field
                  v-model="password"
                  label="Mot de passe"
                  required
                  outlined
                  rounded
                  type="password"
                  :error-messages="errors.wrongPassword ? 'Mot de passe incorrect' : ''"
          />

          <v-btn color="success"
                 :loading="loading"
                 class="mr-4"
                 rounded
                 elevation="0"
                 @click="login">Connexion
          </v-btn>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

  import {auth} from '@/firebase-config'

  export default {
    name: 'login',
    components: {},
    data: () => ({
      email: '',
      password: '',
      loading: false,
      errors: {
        wrongPassword: false,
        userNotFound: false
      }
    }),

    methods: {
      login() {
          this.loading = true
        this.errors = {
          wrongPassword: false,
            userNotFound: false
        }
        auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
            this.$router.push({name: 'Home'})
          }, (e) => {
            if (!e.code) {
              //
            } else if (e.code === 'auth/user-not-found') {
              this.errors.userNotFound = true
            } else if (e.code === 'auth/wrong-password') {
              this.errors.wrongPassword = true
            }
          }).finally(() => {
            this.loading = false
          })
      },
    },
  }
</script>
