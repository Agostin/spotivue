import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register({ name, email, password, age, country }) {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)

      // Adds a new document with a custom UID
      await usersCollection.doc(user.uid).set({
        name,
        email,
        age,
        country
      })
      // Adds a new document with a random-generated UID
      // await usersCollection.add({ name, email, age, country })

      this.userLoggedIn = true
    },
    async authenticate({ email, password }) {
      await auth.signInWithEmailAndPassword(email, password)

      this.userLoggedIn = true
    },
    async logout() {
      await auth.signOut()

      this.userLoggedIn = false
    }
  }
})
