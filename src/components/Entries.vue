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
          const getCategoryName = (_entry) => {
            // some entry doesn't have subject
            if (_entry.subject) {
              return config.categories.find(category => category.label === _entry.subject).name;
            }
            return false;
          };
          const categoryName = getCategoryName(entry);

          if (filterRegExp(urlFilters).test(entry.domain)) {
            return false;
          } else if (filterRegExp(keywordFilters).test(entry.title) ||
            filterRegExp(keywordFilters).test(entry.description)) {
            return false;
          } else if (this.preferences.categoriesInGeneralTab.indexOf(categoryName) === -1) {
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
      const category = config.categories.find(_category => categoryName === _category.name);
      if (!category) this.$router.push(`/${this.type}`);

      // eslint-disable-nextline no-undef
      const yqlUrl = new URL('https://query.yahooapis.com/v1/public/yql');
      let feedUrl;
      if (!category) {
        feedUrl = `http://b.hatena.ne.jp/${this.type}.rss`;
      } else {
        feedUrl = `http://b.hatena.ne.jp/${this.type}/${category.name}.rss`;
      }

      const params = {
        format: 'json',
        q: `select * from rss where url='${feedUrl}'`,
      };
      Object.keys(params).forEach(key => yqlUrl.searchParams.append(key, params[key]));

      fetch(yqlUrl)
        .then(res => res.json())
        .then((feed) => {
          if (feed.query.count === 0) {
            this.failed = true;
            return;
          }

          this.failed = false;
          this.entries = feed.query.results.item.map((entry) => {
            /* eslint-disable no-param-reassign */
            entry.domain = entry.link.match(/^https?:\/\/(.+?)\//)[1];
            entry.favicon = entry.encoded.match(/<img src="(http:\/\/cdn-ak\.favicon.+?)"/)[1];

            const thumbnail = entry.encoded.match(
              /<img src="(http:\/\/cdn-ak\.b\.st-hatena\.com\/entryimage\/.+?)"/
            );
            entry.thumbnail = thumbnail ? thumbnail[1] : null;
            /* eslint-enable no-param-reassign */

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
