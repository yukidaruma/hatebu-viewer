<template>
  <div class="hotentry">
    <categories type="hotentry"></categories>
    <entries type="hotentry"></entries>
  </div>
</template>

<script>
import Categories from './Categories';
import Entries from './Entries';

export default {
  name: 'hotentry',
  components: {
    Categories,
    Entries,
  },
};
</script>
