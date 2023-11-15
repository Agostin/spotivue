<template>
  <vee-form :validation-schema="schema" @submit="handleLogin">
    <p
      class="rounded text-white text-center font-bold mb-4 p-2"
      :class="`bg-red-500 ${!submitStatusMsg && 'hidden'}`"
    >
      {{ submitStatusMsg || 'Loading...' }}
    </p>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message class="text-red-500" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <error-message class="text-red-500" name="password" />
    </div>
    <button
      :disabled="isPerformingLogin"
      type="submit"
      class="flex items-center justify-center gap-x-2 w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="isPerformingLogin && 'cursor-not-allowed'"
    >
      <i class="fa fa-solid fa-spinner animate-spin" v-if="isPerformingLogin" /> Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import useModalStore from '@/stores/modal'

export default {
  name: 'AppLoginForm',
  computed: {
    ...mapWritableState(useModalStore, {
      modalVisibility: 'isOpen'
    })
  },
  data() {
    return {
      isPerformingLogin: false,
      schema: {
        email: 'required|email',
        password: 'required|min:5|max:25'
      },
      submitStatusMsg: ''
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async handleLogin(values) {
      this.isPerformingLogin = true

      try {
        await this.authenticate(values)
        this.modalVisibility = false
      } catch (error) {
        console.error(error)
        this.submitStatusMsg = 'Error'
      }
      this.isPerformingLogin = false
    }
  }
}
</script>
