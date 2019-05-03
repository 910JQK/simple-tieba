<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <navigation>
        <router-view/>
    </navigation>
  </div>
</template>

<style>
.md-app {
  height: 100vh;
}
</style>
