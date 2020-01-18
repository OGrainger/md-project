<template>
  <v-container fluid fill-height class="full-container-mood" :style="'background-color: ' + bgColor">
    <v-layout align-center justify-center>
      <v-flex xs12
              sm8
              class="text-center"

              md4>
        <v-slider
                v-model="moodMeter"
                :color="color"
                :dark="dark"
                :track-color="trackColor"
                always-dirty
                ticks="always"
                tick-size="6"
                thumb-label="always"
                min="-5"
                :tick-labels="ticksLabels"
                max="5"
        >
          <template v-slot:prepend>
            <v-icon
                    :color="color"
                    @click="decrement"
            >
              mdi-minus
            </v-icon>
          </template>

          <template v-slot:append>
            <v-icon
              :color="color"
              @click="increment"
            >
              mdi-plus
            </v-icon>
          </template>
        </v-slider>
        <v-btn color="info"
               :disabled="saved"
               :loading="loading"
               fab
               elevation="0"
               @click="save"><v-icon>{{saved ? 'mdi-check' : 'mdi-plus'}}</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {db, auth} from '@/firebase-config'
  import moment from "moment";
export default {
  name: 'Home',
  data: () => ({
    moodMeter: 0,
    loading: false,
    saved: false,
    ticksLabels: [
      '-5',
      '',
      '',
      '',
      '',
      '0',
      '',
      '',
      '',
      '',
      '5'
    ],
  }),
  computed: {
    dark () {
      if (this.moodMeter === -5) return true
      if (this.moodMeter === 5) return true
      return false

    },
    bgColor () {
      if (this.moodMeter === -5) return 'black'
      if (this.moodMeter === 5) return '#00e676'
      if (this.moodMeter < 0) return '#ffebee'
      if (this.moodMeter > 0) return '#e8f5e9'
      return '#fbfaf8'
    },
    color () {
        if (this.moodMeter === -5) return 'white'
        if (this.moodMeter === -4) return '#795548'
      if (this.moodMeter === -3) return '#d50000'
      if (this.moodMeter === -2) return '#ff5722'
      if (this.moodMeter === -1) return '#ec407a'
        if (this.moodMeter === 5) return 'white'
        if (this.moodMeter > 0) return '#1b5e20'
      return '#607d8b'
      },
    trackColor () {
      if (this.moodMeter === -5) return 'white'
      if (this.moodMeter === -4) return '#795548'
      if (this.moodMeter === -3) return '#d50000'
      if (this.moodMeter === -2) return '#ff5722'
      if (this.moodMeter === -1) return '#ec407a'
      if (this.moodMeter === 5) return 'white'
      if (this.moodMeter > 0) return '#1b5e20'
      return '#607d8b'
      },
  },
  methods: {
    save () {
      this.loading = true
      let toSave = {
        user: auth.currentUser.uid,
        meter: this.moodMeter,
        created: moment().format()
      }
      db.collection('DEV_entries').add(toSave).then(() => {
        this.moodMeter = 0
        this.saved = true
        setTimeout(() => {
          this.saved = false
          }, 3000);
        this.loading = false
      })
    },
    decrement () {
      this.moodMeter--
    },
    increment () {
      this.moodMeter++
    }
  }
}
</script>
