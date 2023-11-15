import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  appId: ''
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
