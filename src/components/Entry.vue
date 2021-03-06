<template>
  <div>
    <div class="header">
      <div :style="{ backgroundImage: `url(${favicon})` }" class="favicon">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
      </div>
    </div>
    <div class="body" v-if="visibility.thumbnail || visibility.content">
      <div
        :style="{ backgroundImage: `url(${thumbnail})` }"
        v-if="visibility.thumbnail && thumbnail" class="thumbnail"></div><!--
      --><p v-if="visibility.content">{{ entry.description }}</p>
    </div>
    <div class="footer" v-if="visibility.date || visibility.domain || visibility.hatebuCount">
      <time :datetime="entry.date" v-if="visibility.date">{{ formattedDate }}</time><!--
         --><span class="domain" v-if="visibility.domain"><!--
           --><a :href="`http://b.hatena.ne.jp/entrylist?url=${domain}`">{{ domain }}</a><!--
         --></span><!--
         --><span class="hatebucount" v-if="visibility.hatebuCount"><!--
           --><a :href="`http://b.hatena.ne.jp/entry/${entry.link}`">{{ hatebuCount }} Users</a><!--
         --></span><!--
      --></div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'entry',
  props: ['entry', 'timeFormat', 'shownItems'],
  computed: {
    visibility() {
      const visibility = {};
      ['thumbnail', 'content', 'date', 'domain', 'hatebuCount'].forEach((key) => {
        visibility[key] = this.shownItems.includes(key);
      });
      return visibility;
    },
    formattedDate() {
      if (this.timeFormat === 'relative') return this.fromNow;

      // absolute time
      return moment(this.entry.pubDate).format('MM/DD HH:mm:ss');
    },
    fromNow() {
      return moment(this.entry.pubDate).fromNow();
    },
    domain() {
      return this.entry.link.match(/^https?:\/\/(.+?)\//)[1];
    },
    favicon() {
      return this.entry.content.match(
        /<img src="(https?:\/\/cdn-ak2\.favicon.+?)"/
      )[1];
    },
    thumbnail() {
      const thumbnail = this.entry.content.match(
        /<img src="(https?:\/\/cdn-ak-scissors.+?)"/
      );
      return thumbnail ? thumbnail[1] : null;
    },
  },
  asyncComputed: {
    hatebuCount: {
      async get() {
        return await this.$jsonp('https://api.b.st-hatena.com/entry.count', { url: this.entry.link });
      },
      default: '-',
    },
  },
};
</script>

<style scoped>
a:link {
  color: #0074d9;
}
a:visited {
  color: #b10dc9;
}

.header .favicon {
  vertical-align: middle;
  background: no-repeat scroll 0 4px;
}
.header a {
  display: inline-block;
  margin-left: 24px;
}

.body {
  margin: 0;
  padding: 0;
  display: flex;
}
.body .thumbnail {
  width: 120px;
  min-height: 90px;
  margin-right: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: no-repeat scroll center;
}
.body, .footer {
  margin-top: .25rem;
  font-size: 95%;
}
.body p {
  flex: 1;
  margin: 0;
}

.footer {
  text-align: right;
  font-weight: 400;
   /*font-family: helvetica, arial, sans-serif; */
}
.footer > *:not(:last-child) {
  margin-right: 1rem;
}
.domain {
  text-align: left;
  vertical-align: bottom;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 10rem;
}
.domain a {
  color: #3d9970;
}
.hatebucount {
  display: inline-block;
  min-width: 4rem;
}
.hatebucount a {
  color: #ff4136;
}
</style>
