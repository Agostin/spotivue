import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAdMwPeSEv5MJjYWEPntXxCkbc1J9oB0ng',
  authDomain: 'spotivue-music-player.firebaseapp.com',
  projectId: 'spotivue-music-player',
  storageBucket: 'spotivue-music-player.appspot.com',
  appId: '1:957138977643:web:00418c6587f0f2ef25c22e'
}

const app = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth(app)
const db = firebase.firestore(app)
const storage = firebase.storage(app)

db.enablePersistence().catch((error) => {
  console.error('Firebase Persistance error: ', error.code)
})

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, storage, songsCollection, usersCollection, commentsCollection }
