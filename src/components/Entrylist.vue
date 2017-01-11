<template>
  <div class="entrylist">
    <categories type="entrylist"></categories>
    <entries type="entrylist" visible-items="visibleItems"></entries>
  </div>
</template>

<script>
import Categories from './Categories';
import Entries from './Entries';

export default {
  name: 'entrylist',
  components: {
    Categories,
    Entries,
  },
};
</script>
