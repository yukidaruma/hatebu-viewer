<template>
  <div class="preferences pure-form pure-form-aligned">
    <h2>設定</h2>
    <fieldset>
      <legend>全般</legend>
      <div class="pure-control-group">
        <label for="time-format">時間の表記</label><!--
        --><select @change="storePreferences" v-model="preferences.timeFormat" id="time-format">
          <option value="relative" :selected="preferences.timeFormat === 'relative'">相対時刻</option>
          <option value="absolute" :selected="preferences.timeFormat === 'absolute'">絶対時刻</option>
        </select>
      </div>
      <div class="checkbox-group clearfix" style="height: 3em;">
        <label>表示する項目</label>
        <div v-for="item in showOptions">
          <label :for="item.name" style="text-align: left;">
            <input
            :value="item.name"
            :checked="preferences.shownItems.indexOf(item.name) !== -1"
            :id="item.name"
            @change="storePreferences"
            v-model="preferences.shownItems" type="checkbox"><!--
            -->{{ item.label }}
          </label>
        </div>
      </div>
      <div class="checkbox-group clearfix" style="height: 5em;">
        <label>総合で表示する<br>カテゴリー</label>
        <div v-for="category in categories">
          <label :for="category.name" style="text-align: left;">
            <input
            :value="category.name"
            :checked="preferences.categoriesInGeneralTab.indexOf(category.name) !== -1"
            :id="category.name"
            @change="storePreferences"
            v-model="preferences.categoriesInGeneralTab" type="checkbox"><!--
            -->{{ category.label }}
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>フィルター</legend>
      <ul>
        <li><code>#</code>から始まる行はコメントとして扱われます</li>
        <li>正規表現が使用可能です (例: <code>/(?:[^.]+\.)?example.com/</code>)</li>
      </ul>
      <div class="pure-control-group">
        <label for="domain-filters">ドメイン</label><!--
        --><textarea @change="storePreferences" v-model="preferences.filters.domainsText" id="domain-filters"></textarea>
      </div>
      <div class="pure-control-group">
        <label for="keyword-filters">キーワード</label><!--
        --><textarea @change="storePreferences" v-model="preferences.filters.keywordsText" id="keyword-filters"></textarea>
      </div>
    </fieldset>
    <p>
      <router-link to="/preferences/import" class="pure-button">インポート</router-link>
      <router-link to="/preferences/export" class="pure-button">エクスポート</router-link>
    </p>
  </div>
</template>

<script>
import store from 'store';

const config = require('../config.json');

const preferences = store.get('preferences') || config.defaultPreferences;

export default {
  name: 'preference',
  data() {
    return {
      preferences,
      showOptions: config.showOptions,
      categories: config.categories,
      importJson: '',
    };
  },
  computed: {
    exportJson() {
      return JSON.stringify(this.preferences);
    },
  },
  methods: {
    storePreferences() {
      store.set('preferences', this.preferences);
    },
    /*reset() {
      this.preferences = config.defaultPreferences;
      this.storePreferences();
    },*/
  },
};
</script>

<style scoped>
.clearfix {
  clear: both;
  content: "";
  display: block;
}

code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}
legend {
  font-weight: bold;
}
select {
  height: auto;
  padding: .25em;
}
textarea {
  font-family: monospace;
  width: calc(100% - 15em);
  overflow-y: scroll;
  height: 6rem;
}
input[type=checkbox] {
  margin-right: .25rem;
}
.checkbox-group {
  margin-bottom: .5em;
}
.checkbox-group label {
  text-align: right;
  margin: 0 1em 0 0;
  float: left;
  height: 100%;
  width: 10em;
}
.checkbox-group div {
  float: left;
}
</style>
