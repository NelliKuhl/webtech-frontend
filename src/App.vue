<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { watch, onMounted, ref } from 'vue'
import { useAuth } from '@okta/okta-vue'

const $auth = useAuth()
const $route = useRoute()
const authenticated = ref(false)

async function logout() {
    await $auth.signOut()
}

async function isAuthenticated () {
    authenticated.value = await $auth.isAuthenticated()
}

watch(() => $route.path, async () => {
    await isAuthenticated()
})

onMounted(async () => {
    await isAuthenticated()
    $auth.authStateManager.subscribe(isAuthenticated)
})

</script>
<template>
<div>
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/login" v-if="!authenticated">Login</RouterLink>
          <a v-if="authenticated" v-on:click="logout()">Logout</a>
        </nav>
      </div>
    </header>

    <main>
      <div class="wrapper">
        <RouterView />
      </div>
    </main>
  </div>

</template>

<style scoped>
.wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 10px;
  text-align: center;
}

header {
  background-color: #333;
  color: #fff;
  border-radius: 10px;
  margin: auto;
  position: relative;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  padding: 10px;
  margin: auto;
  text-align: center;
  position: relative;
}
</style>
