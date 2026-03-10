import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const option = process.env.VITE_OPTION ?? '1';

// https://vitejs.dev/config/
const mazeSnippet = `<script>
(function (m, a, z, e) {
  var s, t, u, v;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}

  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }

  u = document.currentScript || (function () {
    var w = document.getElementsByTagName('script');
    return w[w.length - 1];
  })();
  v = u && u.nonce;

  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', '9fe76a93-123a-4a1b-94d6-608cc84f5a12');
<\/script>`;

export default defineConfig({
  plugins: [
    react(),
    ...(option === '1' ? [{
      name: 'inject-maze-snippet',
      transformIndexHtml(html: string) {
        return html.replace('</head>', `${mazeSnippet}\n  </head>`);
      },
    }] : []),
  ],
  resolve: {
    alias: {
      // @nav always resolves to whichever Option_X is active
      '@nav': path.resolve(__dirname, `Option_${option}`),
      // @/ for shared src imports
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __ACTIVE_OPTION__: JSON.stringify(option),
  },
  server: {
    port: 5170 + Number(option), // dev:1 → 5171, dev:2 → 5172, dev:3 → 5173
  },
});
