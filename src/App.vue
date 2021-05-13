<template>
  <div id="app" class="bg-gray-900 max-w-screen">
    <div class="m-auto max-w-7xl bg-gray-100 min-h-screen flex flex-col">
      <div class="px-2 py-6 bg-green-500 flex flex-row w-full justify-between text-bg">
        <div class="font-bold">
          <template v-if="!isLogged">
            <router-link to="/">Home</router-link>
          </template>
          <template v-else>
            <router-link to="/pit">PIT</router-link>
          </template>

        </div>
        <div>
          <div v-if="isLogged">
            {{ email }}
            <a class="font-bold cursor-pointer" @click="logout">Sair</a>
          </div>
          <div v-else>
            <a class="font-bold cursor-pointer" @click="login">Login</a>
          </div>
        </div>
      </div>
      <div class="flex-1 px-2 py-2">
        <router-view/>
      </div>
      <div class="px-2 py-4 bg-green-500">
        Footer
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['email']),
    isLogged() {
      return this.email
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {})
    },
    logout() {
      this.$store.dispatch('logout', {})
    }
  }
}
</script>