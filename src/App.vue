<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />

  <app-auth />
</template>

<script>
import { auth } from './includes/firebase'
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'

import AppAuth from '@/components/Auth/AppAuth.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppPlayer from '@/components/AppPlayer.vue'

export default {
  name: 'App',
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  components: {
    AppAuth,
    AppHeader,
    AppPlayer
  },
  created() {
    this.userLoggedIn = !!auth.currentUser
  }
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
