<template>
  <div id="app">
    <global-header></global-header>
    <div class="main">
      <nav class="tabs">
        <router-link to="/hotentry">人気エントリー</router-link><!--
     --><router-link to="/entrylist">新着エントリー</router-link><!--
     --><router-link to="/preferences">設定</router-link>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import GlobalHeader from './components/GlobalHeader';
import Entries from './components/Entries';

export default {
  name: 'app',
  components: {
    Entries,
    GlobalHeader,
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
body {
  overflow-y: scroll;
  font-family: '游ゴシック体', 'Yu Gothic', YuGothic, 'ヒラギノ角ゴシック Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
  font-weight: 500;
  background-color: #f7f6f5;
  max-width: 800px;
  margin: 0 auto;
}

nav a {
  color: inherit !important;
  padding: .25rem .5rem;
  display: inline-block;
}

.preferences {
  padding: .5rem 1rem;
}
.preferences h2 {
  font-size: 1.25rem;
  margin: 0;
}

.main > div {
  min-height: 15rem;
}
.main .tabs {
  background-color: #f7f6f5;
}
.main .tabs a {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  position: relative;
  z-index: 2;
}
.main .tabs a.router-link-active {
  border: 1px solid #dfdfdf;
  border-bottom: #fff;
  background-color: #fff;
}
.main {
  margin-bottom: 2rem;
}
.main > div {
  border: 1px solid #dfdfdf;
  background-color: #fff;
  top: -1px;
  position: relative;
  z-index: 1;
}
</style>
