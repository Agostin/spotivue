<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="toggleAudio()"
        >
          <i v-if="playing" class="fas fa-pause"></i>
          <i v-else class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc('song.comment_count_label', song.comments_count, { count: song.comments_count })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <p
            class="rounded text-white text-center font-bold mb-4 p-2"
            :class="`${statusMessage.bgColor} ${!statusMessage.text && 'hidden'}`"
          >
            {{ statusMessage.text }}
          </p>
          <vee-form
            :validation-schema="schema"
            @submit="handleCommentSubmissionEvent"
            v-if="userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <error-message class="text-red-600 mb-3" name="comment" />
            <button
              type="submit"
              :disabled="isLoading"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :class="{ 'cursor-not-allowed': isLoading }"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i> Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto" id="comments">
      <li
        v-for="comment in sortedComments"
        :key="comment.id"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.authorName }}</div>
          <time>{{ comment.date }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { auth, songsCollection, commentsCollection } from '../includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import useSongStore from '@/stores/song'

export default {
  name: 'SongView',
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(useSongStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') return new Date(b.date) - new Date(a.date)

        return new Date(a.date) - new Date(b.date)
      })
    }
  },
  data() {
    return {
      song: {},
      sound: null,
      comments: [],
      schema: {
        comment: 'required|min:3|max:1023'
      },
      isLoading: false,
      statusMessage: {
        text: '',
        bgColor: 'bg-blue-500'
      },
      sort: '1'
    }
  },
  async beforeRouteEnter(to, from, next) {
    const snapshot = await songsCollection.doc(to.params.id).get()

    next((vm) => {
      if (!snapshot.exists) {
        vm.$router.push({ name: 'home' })
      }

      vm.song = snapshot.data()

      vm.getComments()
      vm.setupSongAudio(vm.song)
    })
  },
  methods: {
    ...mapActions(useSongStore, ['setupSongAudio', 'toggleAudio']),
    async getComments() {
      const snapshots = await commentsCollection.where('songId', '==', this.$route.params.id).get()

      if (!snapshots.empty) {
        snapshots.forEach((_c) => this.comments.push({ ..._c.data(), id: _c.id }))
      }
    },
    async handleCommentSubmissionEvent(values, { resetForm }) {
      this.isLoading = true

      const comment = {
        content: values.comment,
        date: new Date().toString(),
        songId: this.$route.params.id,
        authorName: auth.currentUser.displayName,
        authorUid: auth.currentUser.uid
      }

      try {
        await commentsCollection.add(comment)

        this.song.comments_count += 1
        await songsCollection
          .doc(this.$route.params.id)
          .update({ comments_count: this.song.comments_count })

        this.statusMessage.bgColor = 'bg-green-500'
        this.statusMessage.text = 'Comment succesfully stored!'
        this.comments.push(comment)

        resetForm()
      } catch (error) {
        this.statusMessage.bgColor = 'bg-red-500'
        this.statusMessage.text = 'Oops! Something weird just happened...'
      }

      this.isLoading = false
    }
  }
}
</script>
