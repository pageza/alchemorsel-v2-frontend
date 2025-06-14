<template>
  <el-container>
    <el-header height="80px">
      <div class="header-content">
        <h1 class="logo">Alchemorsel</h1>

        <div class="spacer"></div>

        <el-menu
          mode="horizontal"
          :ellipsis="false"
          class="nav-menu"
        >
          <el-menu-item index="1" @click="$router.push('/')">
            Home
          </el-menu-item>

          <el-menu-item index="2" @click="$router.push('/recipes')">
            Recipes
          </el-menu-item>

          <el-menu-item index="3" @click="$router.push('/about')">
            About
          </el-menu-item>
        </el-menu>

        <el-button
          type="primary"
          class="sign-in-btn"
          @click="$router.push('/login')"
        >
          Sign In
        </el-button>
      </div>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
.el-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.spacer {
  flex-grow: 1;
}

.nav-menu {
  border: none;
  background: transparent;
}

.sign-in-btn {
  margin-left: 16px;
}

.el-main {
  background: #fff;
  min-height: calc(100vh - 80px);
  padding: 0;
}
</style> 