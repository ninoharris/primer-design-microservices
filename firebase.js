import * as firebase from 'firebase'


var config = {
  apiKey: "AIzaSyCbwCc9Bdc0QC7OgEx91K_y629J7Txr04c",
  authDomain: "primer-design-dd8e7.firebaseapp.com",
  databaseURL: "https://primer-design-dd8e7.firebaseio.com",
  projectId: "primer-design-dd8e7",
  storageBucket: "primer-design-dd8e7.appspot.com",
  messagingSenderId: "1072741661175"
}
firebase.initializeApp(config)

const db = firebase.database()
const emailAuthProvider = new firebase.auth.EmailAuthProvider()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export {
  db as default,
  googleAuthProvider,
  emailAuthProvider,
  firebase,
}
