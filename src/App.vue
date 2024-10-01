<template>
  <div id="app">
    <router-view /> 
  
  </div>
</template>

<script>
import createquiz from './components/createquiz.vue';
export default {
  name: 'App',
  components:{
    createquiz
    
  }
};
</script>

<style>
/* Add any global styles here */
</style>
