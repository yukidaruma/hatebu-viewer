<template>
  <div class="entries">
    <div v-if="failed">
      Failed to load resource. Please try again.
    </div>
    <div v-else>
      <div v-if="ready">
        <div v-for="entry in filteredEntries" class="entry">
          <entry :entry="entry" :shown-items="shownItems" :time-format="timeFormat"></entry>
        </div>
      </div>
      <div class="loading" v-else><span>Loading...</span></div>
    </div>
  </div>
</template>

<script>
import store from 'store';
import Entry from './Entry';
import filterParser from '../lib/filter-parser';

const config = require('../config.json');
const escapeStringRegexp = require('escape-string-regexp');

export default {
  name: 'entries',
  props: ['type'],
  components: {
    Entry,
  },
  data() {
    return {
      failed: false,
      counts: {},
      ready: false,
      entries: [],
      filters: {
        urls: [],
        keywords: [],
      },
    };
  },
  computed: {
    preferences() {
      return store.get('preferences') || config.defaultPreferences;
    },
    filteredEntries() {
      const filterRegExp = (filters) => {
        const filterPattern = filters.map((filter) => {
          if (filter.type === 'regexp') {
            return filter.value;
          } else if (filter.type === 'string') {
            return escapeStringRegexp(filter.value);
          }
          throw new Error(`Undefined filter type ${filter.type}`);
        }).join('|');
        return new RegExp(`(?:${filterPattern})`, 'i');
      };


      const urlFilters = filterParser(this.preferences.filters.domainsText);
      const keywordFilters = filterParser(this.preferences.filters.keywordsText);

      return this.entries
        .filter((entry) => {
          if (filterRegExp(urlFilters).test(entry.domain)) {
            return false;
          } else if (filterRegExp(keywordFilters).test(entry.title) ||
            filterRegExp(keywordFilters).test(entry.description)) {
            return false;

          // Category filter should only be applied in general tab
          } else if (!this.$route.params.category &&
            !this.preferences.categoriesInGeneralTab.includes(entry.category)) {
            return false;
          }

          return true;
        });
    },
    timeFormat() {
      return this.preferences.timeFormat;
    },
    shownItems() {
      return this.preferences.shownItems;
    },
  },
  watch: {
    $route: 'update',
  },
  methods: {
    update() {
      this.ready = false;

      const categoryName = this.$route.params.category;

      // eslint-disable-nextline no-undef
      const rss2JsonUrl = new URL('https://api.rss2json.com/v1/api.json');
      const feedUrl =
        categoryName ? `http://b.hatena.ne.jp/${this.type}/${categoryName}.rss` :
          `http://b.hatena.ne.jp/${this.type}.rss`;

      const params = {
        rss_url: feedUrl,
      };
      Object.keys(params).forEach(key => rss2JsonUrl.searchParams.append(key, params[key]));

      fetch(rss2JsonUrl)
        .then(res => res.json())
        .then((feed) => {
          if (feed.status !== 'ok') {
            this.failed = true;
            return;
          }

          this.failed = false;
          this.entries = feed.items.map((entry) => {
            // eslint-disable-next-line no-param-reassign
            entry.category = config.categories
              .find(category => category.label === entry.categories[0]).name;
            return entry;
          });
          this.ready = true;
        })
        .catch(e => console.log(e));
    },
  },
  mounted() {
    this.update();
  },
};
</script>

<style scoped>
.loading {
  padding: .5rem 1rem;
}
.loading span {
  color: #666;
}
.entry {
  padding: .5rem 1rem;
  font-size: 95%;
  font-weight: 500;
}
.entry:not(:last-child) {
  border-bottom: 1px dashed #dfdfdf;
}
</style>
