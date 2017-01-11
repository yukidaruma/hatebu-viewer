<template>
  <nav class="categories">
    <span>
      <router-link :to="`/${type}`" exact>総合</router-link>
    </span>
    <span v-for="category in categories">
      <router-link :to="`/${type}/${category.name}`">{{ category.label }}</router-link>
    </span>
  </nav>
</template>

<script>
const config = require('../config.json');

const categories = config.categories;

export default {
  name: 'categories',
  props: ['type'],
  data() {
    return {
      categories,
    };
  },
};
</script>

<style>
.categories {
  padding: .5rem 0;
  display: flex;
  justify-content: center;
  font-size: 90%;
  font-weight: 500;
}
.categories span {
  text-align: center;
}
.categories span:not(:last-child) {
  margin: inherit .25rem;
  border-right: 1px solid #dfdfdf;
}
.categories span a.router-link-active {
  color: #0074D9 !important;
}
</style>
