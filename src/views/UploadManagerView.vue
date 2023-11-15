<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <file-uploader @on-new-song-added="($event) => addSongToList($event)" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <app-song
              v-for="song in songs"
              :song="song"
              :key="song.docId"
              @on-song-deleted="($event) => removeSongFromList($event)"
              @on-user-changes-saved="($event) => (userSavedChangesFlag = $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, songsCollection } from '../includes/firebase'
import FileUploader from '@/components/FileUploader.vue'
import AppSong from '@/components/AppSong.vue'

export default {
  name: 'UploadManagerView',
  components: {
    FileUploader,
    AppSong
  },
  data() {
    return {
      songs: [],
      isLoading: false,
      userSavedChangesFlag: true
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    if (!snapshot.empty) {
      snapshot.forEach((_s) => this.songs.push({ docId: _s.id, ..._s.data() }))
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.userSavedChangesFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Do you really want to leave the page?')
      next(leave)
    }
  },
  methods: {
    removeSongFromList(docId) {
      const songIndex = this.songs.findIndex((s) => s.docId === docId)
      this.songs.splice(songIndex, 1)
    },
    addSongToList(song) {
      this.songs.push(song)
    }
  }
}
</script>
