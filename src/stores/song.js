import { defineStore } from 'pinia'
import { songsCollection, storage } from '../includes/firebase'
import { formatTime } from '@/includes/helpers'
import { Howl } from 'howler'

export default defineStore('song', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    progress: 0
  }),
  actions: {
    async updateSong(newSongData) {
      console.log(newSongData)
      await songsCollection.doc(newSongData.docId).update(newSongData)
    },
    async deleteSong(docId, original_name) {
      // Remove song file from storage
      try {
        const storageRef = storage.ref()
        const songRef = storageRef.child(`songs/${original_name}`)
        await songRef.delete()
      } catch (error) {
        console.error(error)
      }

      // Remove song from Firestore
      try {
        await songsCollection.doc(docId).delete()
      } catch (error) {
        console.error(error)
      }
    },
    async setupSongAudio(song) {
      this.current_song = song

      this.sound = new Howl({
        src: [this.current_song.url],
        html5: true,
        onload: () => {
          this.duration = formatTime(this.sound.duration())
        }
      })

      this.sound.on('play', () => {
        requestAnimationFrame(this.updateProgress)
      })
    },
    toggleAudio() {
      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }

      this.is_playing = !this.is_playing
    },
    updateProgress() {
      const seek = this.sound.seek()

      this.seek = formatTime(seek)
      this.progress = (seek / this.sound.duration()) * 100

      if (this.sound.playing()) {
        requestAnimationFrame(this.updateProgress)
      }
    },
    updateSeek(event) {
      if (!this.sound.playing()) {
        return
      }

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickCoordX = event.clientX - x
      const percentage = clickCoordX / width

      this.sound.seek(this.sound.duration() * percentage)
      this.sound.once('seek', this.updateProgress)
    }
  },
  getters: {
    playing: (state) => {
      return state.sound?.playing?.()
    }
  }
})
