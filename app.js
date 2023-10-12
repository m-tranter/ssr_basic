// app.js (shared between server and client)
import { createSSRApp } from 'vue';

export function createApp(items) {
  return createSSRApp({
    data: () => ({ length: 0, items: items }),
    methods: {
      printLen: function () {
        console.log(this.items.length);
      },
    },
    mounted() {
      this.length = this.items.length;
      this.printLen();
    },
    template:
      '<ul v-show="items"><li v-for="item in items">{{item.entryTitle}}</li></ul>',
  });
}
