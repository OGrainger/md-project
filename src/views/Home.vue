<template>
  <v-container fluid fill-height class="full-container-mood" :style="'background-color: ' + bgColor">
    <v-layout align-center justify-center>
      <v-flex xs12
              sm8
              class="text-center"
              md4>
        <v-slider v-model="moodMeter"
                  :color="color"
                  :dark="dark"
                  left
                  always-dirty
                  thumb-label="always"
                  min="-5"
                  style="padding-top: 60px"
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
               elevation="0"
               class="save-btn-instant"
               @click="save()">
          <v-icon v-if="saved">mdi-check</v-icon>
          <span v-else>Maintenant</span>
        </v-btn>

        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn :color="saved ? 'success' : 'primary'"
                   :dark="dark"
                   :loading="loading"
                   x-small
                   fab
                   class="ml-1"
                   v-on="on"
                   elevation="0">...
            </v-btn>

          </template>
          <v-list shaped>
            <v-list-item @click="saveLastHour">
              <v-list-item-title>Pour la dernière heure</v-list-item-title>
            </v-list-item>
            <v-list-item @click="saveTimespan">
              <v-list-item-title>Pour {{literalTimespan}}</v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-title>Depuis... (bientôt)</v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-title>Personnaliser... (bientôt)</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn color="warning"
               :dark="dark"
               :loading="loading"
               x-small
               fab
               disabled
               class="ml-1"
               elevation="0">
          <v-icon>mdi-history</v-icon>
        </v-btn>

        <v-timeline>
          <v-timeline-item v-for="entry in lastEntries"
                           v-bind:key="entry.id"
                           :color="colorEntry(entry)"
                           fill-dot>
            <template v-slot:icon >
              <span @click.stop="openLastEntry(entry)" style="color: white">{{entry.meter}}</span>
            </template>

            <v-btn rounded
                   class="mt-1"
                   color="secondary"
                   style="color: black"
                   elevation="0"
                  @click.stop="openLastEntry(entry)">

              <span>{{formatDate(entry.created)}}</span>
            </v-btn>

          </v-timeline-item>
        </v-timeline>

      </v-flex>
    </v-layout>
    <v-dialog v-model="lastEntryDetailDialog" width="500" @click="lastEntryDetailDialog = false">
      <v-card>
        <v-card-text class="pa-4">
          <span class="title text-uppercase">{{formatDate(lastEntrySelected.created)}}, {{formatDateFrom(lastEntrySelected.created)}}</span>
          <br>
          <span class="subtitle-1" v-show="lastEntrySelected.start">Valable de {{formatTime(lastEntrySelected.start)}} à {{formatTime(lastEntrySelected.end || lastEntrySelected.created)}}</span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {auth, db} from '@/firebase-config'
  import moment from "moment";
  import Constants from "@/utils/constants"

  export default {
    name: 'Home',
    data: () => ({
      moodMeter: 0,
      loading: false,
      saved: false,
      lastEntryDetailDialog: false,
      lastEntrySelected: {},
      lastEntries: []
    }),
    computed: {
      dark() {
        return false
      },
      bgColor() {
        if (this.moodMeter < 0) return '#ffebee'
        if (this.moodMeter > 0) return '#e8f5e9'
        return '#fbfaf8'
      },
      color() {
        if (this.moodMeter < 0) return 'error'
        if (this.moodMeter > 0) return 'success'
        return '#cfd8dc'
      },
      timespan() {
        let now = moment()
        if (now.hours() < 6) return Constants.TIMESPAN.NIGHT
        if (now.hours() < 13) return Constants.TIMESPAN.MORNING
        if (now.hours() < 18) return Constants.TIMESPAN.AFTERNOON
        if (now.hours() < 21) return Constants.TIMESPAN.EVENING
        return Constants.TIMESPAN.NIGHT
      },
      literalTimespan() {
        let timespan = this.timespan
        if (timespan === Constants.TIMESPAN.MORNING) return 'ce matin'
        if (timespan === Constants.TIMESPAN.AFTERNOON) return 'cette après-midi'
        if (timespan === Constants.TIMESPAN.EVENING) return 'cette soirée'
        if (timespan === Constants.TIMESPAN.NIGHT) return 'cette nuit'
        return null
      }
    },
    methods: {
      formatTime(date) {
        return moment(date).format('LT')
      },
      formatDate(date) {
        return moment(date).calendar()
      },
      formatDateFrom(date) {
        return moment(date).fromNow()
      },
      fetchLastEntries() {
        let user = auth.currentUser.uid
        db.collection(process.env.VUE_APP_COLLECTION).where('user', '==', user).orderBy('created', 'desc').limit(5).get().then(query => {
          this.lastEntries = query.docs.map(doc => {
            return {
              ...doc.data(),
              id: doc.id
            }
          })
        }).finally(() => {
          this.loading = false
        })
      },
      colorEntry(entry) {
        if (entry.meter < 0) return 'error'
        if (entry.meter > 0) return 'success'
        return '#cfd8dc'
      },

      openLastEntry(entry) {
        this.lastEntrySelected = entry
        this.lastEntryDetailDialog = true
      },

      saveLastHour() {
        let toSave = {
          user: auth.currentUser.uid,
          meter: this.moodMeter,
          created: moment().format(),
          start: moment().subtract(1, 'hours').format()
        }
        console.log(toSave)
        this.save(toSave)
      },
      saveTimespan() {
        let start = moment()
        if (this.timespan === Constants.TIMESPAN.MORNING) start = start.hours(8).minutes(0).seconds(0).milliseconds(0).format()
        if (this.timespan === Constants.TIMESPAN.AFTERNOON) start = start.hours(12).minutes(0).seconds(0).milliseconds(0).format()
        if (this.timespan === Constants.TIMESPAN.EVENING) start = start.hours(18).minutes(0).seconds(0).milliseconds(0).format()
        if (this.timespan === Constants.TIMESPAN.NIGHT) start = start.hours(22).minutes(0).seconds(0).milliseconds(0).format()
        let toSave = {
          user: auth.currentUser.uid,
          meter: this.moodMeter,
          created: moment().format(),
          start
        }
        this.save(toSave)
      },

      save(toSaveOverride) {
        if (this.saved) {
          return
        }
        this.loading = true
        let toSave = toSaveOverride || {
          user: auth.currentUser.uid,
          meter: this.moodMeter,
          created: moment().format()
        }
        db.collection(process.env.VUE_APP_COLLECTION).add(toSave).then(() => {
          this.moodMeter = 0
          this.saved = true
          setTimeout(() => {
            this.saved = false
            this.fetchLastEntries()
          }, 3000);
          this.loading = false
        })
      },
      decrement() {
        this.moodMeter--
      },
      increment() {
        this.moodMeter++
      }
    },
    created() {
      this.fetchLastEntries()
  }
}
</script>
