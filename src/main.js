// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import Entrylist from './components/Entrylist';
import Hotentry from './components/Hotentry';
import Preference from './components/Preference';
import PreferenceImport from './components/PreferenceImport';
import PreferenceExport from './components/PreferenceExport';

Vue.use(VueRouter);

const routes = [
  { path: '/entrylist', component: Entrylist },
  { path: '/entrylist/:category', component: Entrylist },
  { path: '/hotentry', component: Hotentry },
  { path: '/hotentry/:category', component: Hotentry },
  { path: '/preferences', component: Preference },
  { path: '/preferences/import', component: PreferenceImport },
  { path: '/preferences/export', component: PreferenceExport },
  { path: '*', redirect: '/hotentry' }, // default route
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
});
