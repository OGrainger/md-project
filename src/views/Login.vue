<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row>
      <v-flex xs12 class="text-center pt-4 pb-4">
        <span class="display-4 font-italic font-weight-thin ">The Mood Project</span>
      </v-flex>
      <v-flex xs12 md6>
        <v-form ref="form"
                v-model="valid"
                lazy-validation>
          <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  outlined
                  rounded
                  :loading="loading"
          />
          <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :loading="loading"
                  label="Mot de passe"
                  required
                  outlined
                  rounded
                  type="password"
          />

          <v-btn :disabled="!valid"
                 color="success"
                 :loading="loading"
                 class="mr-4"
                 rounded
                 elevation="0"
                 @click="login">Connexion
          </v-btn>
          <v-spacer />
          <v-btn color="error"
                 class="mr-4"
                 rounded
                 elevation="0"
                 disabled>Inscription (bientôt)
          </v-btn>
          <v-expand-transition>
            <v-subheader v-show="errors.userNotFound">Utilisateur inconnu.</v-subheader>
          </v-expand-transition>
          <v-expand-transition>
            <v-subheader v-show=errors.wrongPassword>Mot de passe incorrect.</v-subheader>
          </v-expand-transition>
        </v-form>
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
      valid: true,
      email: '',
      password: '',
      loading: false,
      emailRules: [
        v => !!v || 'Veuillez renseigner un mail',
        v => /.+@.+\..+/.test(v) || 'Le mail doit être valide',
      ],
      passwordRules: [
        v => !!v || 'Veuillez renseigner un mot de passe',
      ],
      errors: {
        wrongPassword: false,
        userNotFound: false
      }
    }),

    methods: {
      login() {
        if (this.$refs.form.validate()) {
          this.loading = true
          auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
            this.$router.push({name: 'Clients'})
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
        }
      },
    },
  }
</script>
