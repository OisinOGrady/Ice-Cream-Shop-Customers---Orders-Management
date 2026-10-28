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