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
                always-dirty
                tick-size="6"
                thumb-label="always"
                min="-5"
                max="5">
          <template v-slot:prepend>
            <v-icon :color="color"
                    @click="decrement">mdi-minus
            </v-icon>
          </template>

          <template v-slot:append>
            <v-icon
              :color="color"
              @click="increment">mdi-plus
            </v-icon>
          </template>
        </v-slider>
        <v-btn :color="saved ? 'success' : 'primary'"
               :dark="dark"
               :loading="loading"
               rounded
               style="color: black; font-weight: normal"
               elevation="0"
               @click="save"><span v-if="!saved">Maintenant</span><v-icon v-else>mdi-check</v-icon>
        </v-btn>
        <!--        <v-btn :color="saved ? 'success' : 'primary'"-->
        <!--               :dark="dark"-->
        <!--               :loading="loading"-->
        <!--               fab-->
        <!--               elevation="0"-->
        <!--               @click="save"><v-icon>{{saved ? 'mdi-check' : 'mdi-plus'}}</v-icon>-->

        <v-timeline >
          <v-timeline-item v-for="entry in lastEntries" v-bind:key="entry.id" :color="colorEntry(entry)" fill-dot>{{formatDate(entry)}}</v-timeline-item>
        </v-timeline>

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
    lastEntries: []
  }),
  computed: {
    dark () {
      if (this.moodMeter === -5) return true
      if (this.moodMeter === 5) return true
      return false

    },
    bgColor () {
      if (this.moodMeter === -5) return 'black'
      if (this.moodMeter === 5) return 'white'
      if (this.moodMeter < 0) return '#ffebee'
      if (this.moodMeter > 0) return '#e8f5e9'
      return '#fbfaf8'
    },
    color () {
      if (this.moodMeter === -5) return 'white'
      if (this.moodMeter < 0) return 'error'
      if (this.moodMeter > 0) return 'success'
      return '#cfd8dc'
      },
  },
  methods: {
    formatDate(entry) {
      return moment(entry.created).fromNow()
    },
    fetchLastEntries() {
      let user = auth.currentUser.uid
      db.collection('DEV_entries').where('user', '==', user).orderBy('created', 'desc').limit(5).get().then(query => {
        this.lastEntries = query.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })
        console.log(this.lastEntries)
      }).finally(() => {
        this.loading = false
      })
    },
    colorEntry(entry) {
      if (entry.meter === 5) return 'white'
      if (entry.meter === -5) return 'black'
      if (entry.meter < 0) return 'error'
      if (entry.meter > 0) return 'success'
      return '#cfd8dc'
    },
    save () {
      if (this.saved) {
        return
      }
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
          this.fetchLastEntries()
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
  },
  created() {
    this.fetchLastEntries()
  }
}
</script>
