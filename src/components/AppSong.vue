<template>
  <p
    class="rounded text-white text-center font-bold mb-4 p-2"
    :class="`${statusMessage.background} ${!statusMessage.text && 'hidden'}`"
  >
    {{ statusMessage.text }}
  </p>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showDetails">
      <h4 class="inline-block text-2xl font-bold truncate w-11/12">
        {{ selectedSong.modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        :class="{ 'cursor-not-allowed': isLoading }"
        :disabled="isLoading"
        @click.prevent="handleDeleteSong()"
      >
        <i v-if="!isDeleting" class="fa fa-times"></i>
        <i v-else class="fas fa-spinner fa-spin"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="toggleSongDetailsSection(true)"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showDetails">
      <vee-form :validation-schema="schema" @submit="confirmEditSongAction">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            :rule="['required']"
            name="song_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            v-model="selectedSong.modified_name"
          />
          <error-message class="text-red-600" name="song_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="song_genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            v-model="selectedSong.genre"
          />
          <error-message class="text-red-600" name="song_genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :class="{ 'cursor-not-allowed': isLoading }"
          :disabled="isLoading"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i> Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :class="{ 'cursor-not-allowed': isLoading }"
          :disabled="isLoading"
          @click.prevent="toggleSongDetailsSection(false)"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import useSongStore from '@/stores/song'

export default {
  name: 'AppSong',
  props: {
    song: {
      type: Object,
      required: true
    },
    userSavedChanges: {
      type: Function
    }
  },
  emits: ['on-song-deleted', 'on-user-changes-saved'],
  computed: {
    isLoading() {
      return this.isUpdating || this.isDeleting
    }
  },
  data() {
    return {
      showDetails: false,
      selectedSong: {},
      isDeleting: false,
      isUpdating: false,
      statusMessage: {
        background: 'bg-green-500',
        text: ''
      },
      schema: {
        song_name: 'required|min:5|max:255',
        song_genre: 'min:3|max:255|alpha_spaces'
      }
    }
  },
  beforeMount() {
    this.selectedSong = this.song
  },
  methods: {
    ...mapActions(useSongStore, ['updateSong', 'deleteSong']),
    toggleSongDetailsSection(statusFlag) {
      this.showDetails = statusFlag
      this.$emit('on-user-changes-saved', !statusFlag)
    },
    async confirmEditSongAction() {
      this.isUpdating = true

      try {
        await this.updateSong(this.selectedSong)
        this.statusMessage.text = 'Song correctly updated'
        this.showDetails = false
      } catch (error) {
        this.statusMessage.background = 'bg-red-500'
        this.statusMessage.text = error.toString()
      }
      this.isUpdating = false
      this.$emit('on-user-changes-saved', true)

      setTimeout(() => (this.statusMessage.text = ''), 3000)
    },
    async handleDeleteSong() {
      this.isDeleting = true

      try {
        const { docId, original_name } = this.selectedSong
        await this.deleteSong(docId, original_name)
        this.statusMessage.text = 'Song correctly deleted'
        this.$emit('on-song-deleted', docId)
      } catch (error) {
        this.statusMessage.background = 'bg-red-500'
        this.statusMessage.text = error.toString()
      }
      this.isDeleting = false

      setTimeout(() => {
        this.statusMessage.text = ''
        this.statusMessage.background = 'bg-green-500'
      }, 3000)
    }
  }
}
</script>
