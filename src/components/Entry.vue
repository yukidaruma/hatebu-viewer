<template>
  <div>
    <div class="header">
      <div :style="`background-image: url(${entry.favicon})`" class="favicon">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
      </div>
    </div>
    <div class="body" v-if="thumbnailVisibility || contentVisibility">
      <div
        :style="`background-image: url(${entry.thumbnail});`"
        v-if="thumbnailVisibility && entry.thumbnail" class="thumbnail"></div><!--
      --><p v-if="contentVisibility">{{ entry.description }}</p>
    </div>
    <div class="footer" v-if="dateVisibility || domainVisibility || hatebuCountVisibility">
      <time :datetime="entry.date" v-if="dateVisibility">{{ formattedDate }}</time><!--
         --><span class="domain" v-if="domainVisibility"><!--
           --><a :href="`http://b.hatena.ne.jp/entrylist?url=${entry.domain}`">{{ entry.domain }}</a><!--
         --></span><!--
         --><span class="hatebucount" v-if="hatebuCountVisibility"><!--
           --><a :href="`http://b.hatena.ne.jp/entry/${entry.link}`">{{ bookmarkcount }} Users</a><!--
         --></span><!--
      --></div>
  </div>
</template>

<script>
import moment from 'moment';

const visibility = (visibleItems, name) => visibleItems.indexOf(name) !== -1;

export default {
  name: 'entry',
  props: ['entry', 'timeFormat', 'shownItems'],
  computed: {
    thumbnailVisibility() {
      return visibility(this.shownItems, 'thumbnail');
    },
    contentVisibility() {
      return visibility(this.shownItems, 'content');
    },
    dateVisibility() {
      return visibility(this.shownItems, 'date');
    },
    domainVisibility() {
      return visibility(this.shownItems, 'domain');
    },
    hatebuCountVisibility() {
      return visibility(this.shownItems, 'hatebuCount');
    },
    formattedDate() {
      if (this.timeFormat === 'relative') return this.fromNow;

      // absolute time
      return moment(this.entry.pubDate).format('MM/DD HH:mm:ss');
    },
    fromNow() {
      return moment(this.entry.pubDate).fromNow();
    },
  },
  asyncComputed: {
    bookmarkcount: {
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
