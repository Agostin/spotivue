<template>
  <vee-form :validation-schema="schema" @submit="handleSubmit" :initial-values="userData">
    <p
      class="rounded text-white text-center font-bold mb-4 p-2"
      :class="`${alertMsgBg} ${!submitStatusMsg && 'hidden'}`"
    >
      {{ submitStatusMsg || 'Loading...' }}
    </p>
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <error-message class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <error-message class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirmPassword"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <error-message class="text-red-600" name="confirmPassword" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Europe">Europe</option>
        <option value="USA">USA</option>
        <option value="China">China</option>
        <option value="India">India</option>
        <option value="Russia">Russia</option>
        <option value="Australia">Australia</option>
      </vee-field>
      <error-message class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <label class="inline-block" to="tos">
        <vee-field
          type="checkbox"
          name="tos"
          value="1"
          class="w-4 h-4 float-left -ml-6 mt-1 rounded border border-gray-400"
        />
        <i18n-t class="inline-block" keypath="auth.tos_label_prefix" tag="label">
          <a href="/tos">{{ $t('auth.tos_label_suffix') }}</a>
        </i18n-t>
      </label>
      <error-message class="block text-red-600" name="tos" />
    </div>
    <button
      :disabled="isSubmitting"
      type="submit"
      class="flex items-center justify-center gap-x-2 w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :class="isSubmitting && 'cursor-not-allowed'"
    >
      <i class="fa fa-solid fa-spinner animate-spin" v-if="isSubmitting" /> Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'AppRegistrationForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:5|max:16|excluded:password',
        confirmPassword: 'required|passwords_mismatch:@password',
        country: 'required',
        tos: 'tos'
      },
      userData: {
        country: 'Europe'
      },
      isSubmitting: false,
      submitStatusMsg: '',
      alertMsgBg: 'bg-green-500'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    async handleSubmit(values) {
      this.isSubmitting = true

      try {
        await this.createUser(values)

        this.submitStatusMsg = 'User succesfully added!'
        this.alertMsgBg = 'bg-green-500'
      } catch ({ code, message }) {
        if (code == 'auth/weak-password') {
          this.submitStatusMsg = 'The password is too weak.'
        } else {
          this.submitStatusMsg = message
        }
        this.isSubmitting = false
        this.alertMsgBg = 'bg-red-500'

        return
      }

      setTimeout(() => {
        this.isSubmitting = false
        this.submitStatusMsg = ''
        this.alertMsgBg = 'bg-green-500'
      }, 2000)
    }
  }
}
</script>
