<template>
  <div class="global-header">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
const config = require('../config.json');

export default {
  name: 'global-header',
  data() {
    return {
      title: config.title,
    };
  },
};
</script>

<style scoped>
.global-header {
  margin: 1rem 0;
}

h1 {
  font-size: 150%;
  margin: 0;
  font-family: 'Fira Sans', sans-serif;
  font-weight: 300;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
