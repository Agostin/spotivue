<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <label for="manual_uploader" class="cursor-pointer">
        <div
          class="w-full px-10 py-20 rounded text-center border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          @drag.stop.prevent=""
          @dragstart.stop.prevent=""
          @dragend.stop.prevent="is_dragover = false"
          @dragover.stop.prevent="is_dragover = true"
          @dragenter.stop.prevent="is_dragover = true"
          @dragleave.stop.prevent="is_dragover = false"
          @drop.stop.prevent="($event) => upload($event)"
        >
          <h5>Drop your files here</h5>
          <input
            type="file"
            id="manual_uploader"
            class="hidden"
            @change="($event) => upload($event)"
          />
        </div>
      </label>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <p v-if="songs.length === 0">No songs uploaded yet</p>
      <div class="mb-4" v-else v-for="song in songs" :key="song.name">
        <!-- File Name -->
        <div class="font-bold text-sm"><i :class="song.icon" /> {{ song.name }}</div>
        <div v-if="song.upload_progress !== 0" class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :style="{ width: `${song.upload_progress}%` }"
          ></div>
        </div>
        <p class="text-red-500" v-if="song.hasError">
          Oops! An error occoured... Please retry uploading the file
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, storage, songsCollection } from '@/includes/firebase'

export default {
  name: 'FileUploader',
  emits: ['on-new-song-added'],
  data() {
    return {
      is_dragover: false,
      songs: []
    }
  },
  beforeUnmount() {
    this.songs.forEach((song) => song.task.cancel())
  },
  methods: {
    upload($event) {
      this.is_dragover = false

      const files =
        $event.dataTransfer !== undefined
          ? [...$event.dataTransfer.files]
          : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return

        if (!navigator.onLine) {
          this.songs.push({
            task: {},
            name: file.name,
            upload_progress: 100,
            icon: 'fas fa-times',
            hasError: true
          }) - 1
          return
        }

        const storageRef = storage.ref()
        const songsRef = storageRef.child(`songs/${file.name}`)
        const task = songsRef.put(file)

        const currentSongIndex =
          this.songs.push({
            task,
            name: file.name,
            upload_progress: 0,
            icon: 'fas fa-spinner fa-spin',
            hasError: false
          }) - 1

        task.on(
          'state_changed',
          (snapshot) => {
            const { bytesTransferred, totalBytes } = snapshot
            this.songs[currentSongIndex].upload_progress = (bytesTransferred / totalBytes) * 100
          },
          (error) => {
            this.songs[currentSongIndex].icon = 'fas fa-times'
            this.songs[currentSongIndex].hasError = true
            this.songs[currentSongIndex].upload_progress = 0
            console.error(error)
          },
          async () => {
            const firebaseSong = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              comments_count: 0,
              genre: ''
            }

            firebaseSong.url = await task.snapshot.ref.getDownloadURL()

            try {
              const { id } = await songsCollection.add(firebaseSong)
              this.$emit('on-new-song-added', { ...firebaseSong, docId: id })
            } catch (error) {
              this.songs[currentSongIndex].hasError = true
            }

            this.songs[currentSongIndex].icon = 'fas fa-check'
            this.songs[currentSongIndex].upload_progress = 0
          }
        )
      })
    }
  }
}
</script>
