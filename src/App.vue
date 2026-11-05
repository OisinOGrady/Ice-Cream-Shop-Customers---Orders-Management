<!-- provides the global navigation bar and a <router-view /> slot. 
 When clicks a nav link, index.js tells App.vue which component 
 to inject into that <router-view /> slot. -->

<template>
<div id="app">
<nav class="main-nav">
<router-link to="/customers/list" >Customers </router-link> |
<router-link to="/orders/list" >Orders </router-link> |
<router-link to="/">Home</router-link>
</nav>
<hr/>
<main class="container" >
<router-view />
</main>
</div>
</template>
