<template>
  <div class="preferences pure-form">
    <h2>設定/エクスポート</h2>
    <textarea class="pure-input-1" v-model="serializedPreferences" readonly></textarea>
    <router-link to="/preferences" class="pure-button">戻る</router-link>
  </div>
</template>

<script>
import store from 'store';

export default {
  name: 'preferences-import',
  computed: {
    serializedPreferences() {
      return JSON.stringify(store.get('preferences'));
    },
  },
};
</script>
