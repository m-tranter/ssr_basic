'use strict';

import express from 'express';
import ejs from 'ejs';
import fetch from 'node-fetch';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './app.js';

const PORT = 3001;
const ROOT_URL = 'https://cms-chesheast.cloud.contensis.com/';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('.'));
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

async function sendHtml(res) {
  const resp = await fetch(
    `${ROOT_URL}/api/delivery/projects/website/contenttypes/rangerEvents/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I`,
    { method: 'get' }
  );
  let data = await resp.json();
  const app = createApp(data.items);
  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="importmap">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
            }
          }
        </script>
        <script type="module">
          import { createApp } from './app.js'
          createApp(${JSON.stringify(data.items)}).mount('#app')
        </script>
      </head>
      <body>
      <h1>Ranger Events</h1>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });
}

app.get('/', (req, res) => {
  sendHtml(res);
});
