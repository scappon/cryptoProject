import firebase from 'firebase'
import firestore from 'firebase/firestore'
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA06xB3DGgHslSk2coW9cX5rJbGNtLnyeo",
    authDomain: "udemy-geo-ninjas-6ba83.firebaseapp.com",
    databaseURL: "https://udemy-geo-ninjas-6ba83.firebaseio.com",
    projectId: "udemy-geo-ninjas-6ba83",
    storageBucket: "",
    messagingSenderId: "1071219084502"
  };
  //firebase.initializeApp(config);

  const firebaseApp = firebase.initializeApp(config);
  

  export default firebaseApp.firestore