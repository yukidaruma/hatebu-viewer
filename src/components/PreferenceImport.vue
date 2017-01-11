<template>
  <div class="preferences pure-form">
    <h2>設定/インポート</h2>
    <textarea class="pure-input-1" v-model="serializedPreferences"></textarea>
    <button @click="importPreferences" class="pure-button pure-button-primary">インポート</button>
    <router-link to="/preferences" class="pure-button">戻る</router-link>
  </div>
</template>

<script>
import store from 'store';

export default {
  name: 'preferences-import',
  data() {
    return {
      serializedPreferences: '',
    };
  },
  methods: {
    importPreferences() {
      try {
        store.set('preferences', JSON.parse(this.serializedPreferences));
        this.$router.push('/preferences');
      } catch (e) { console.log(e); }
    },
  },
};
</script>
