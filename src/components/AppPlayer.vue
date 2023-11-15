<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center">
      <span class="song-title font-bold">{{ current_song.modified_name }}</span> by
      <span class="song-artist">Artist</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleAudio()">
        <i v-if="playing" class="fa fa-pause text-gray-500 text-xl"></i>
        <i v-else class="fa fa-play text-gray-500 text-xl"></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
        @click.prevent="updateSeek"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: `${progress}%` }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: `${progress}%` }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import useSongStore from '@/stores/song'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'AppPlayer',
  computed: {
    ...mapState(useSongStore, ['current_song', 'playing', 'duration', 'seek', 'progress'])
  },
  methods: {
    ...mapActions(useSongStore, ['toggleAudio', 'updateSeek'])
  }
}
</script>
