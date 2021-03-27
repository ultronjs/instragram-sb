import firebase from "firebase"

const firebaseApp =  firebase.initializeApp({  
  apiKey: "AIzaSyCfrUIPyuSJj5XQrfOYS-cxK-jX0NUy_Uw",
  authDomain: "instagram-sb.firebaseapp.com",
  projectId: "instagram-sb",
  storageBucket: "instagram-sb.appspot.com",
  messagingSenderId: "726073033072",
  appId: "1:726073033072:web:689fb860a9661ded5b4fb5",
  measurementId: "G-L32NKNSP38"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export  { db,auth,storage};