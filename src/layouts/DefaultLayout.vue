<template>
  <div class="layout">
    <nav class="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  padding: 1rem;
  background-color: #f8f9fa;
  
  a {
    color: #2c3e50;
    text-decoration: none;
    margin: 0 0.5rem;
    
    &.router-link-active {
      color: #42b983;
    }
  }
}

.main {
  flex: 1;
  padding: 1rem;
}
</style> 