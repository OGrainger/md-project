import firebase from 'firebase'

const config = {
    apiKey: "X",
    authDomain: "X",
    databaseURL: "X",
    projectId: "X",
    storageBucket: "X",
    messagingSenderId: "X",
    appId: "X"
}
firebase.initializeApp(config)

export const db = firebase.firestore()
export const auth = firebase.auth()
