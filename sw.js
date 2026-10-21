// オフラインでも開けるようにするための仕組み。ネットにつながるときは新しい内容を取りに行き、つながらないときは保存した内容を使う。
var CACHE = 'shiori-anpanman-v4';
var FILES = ['./', 'index.html', 'assets/style.css?v=4', 'assets/app.js?v=4', 'assets/plan.js?v=4', 'assets/trip-data.js?v=4', 'manifest.webmanifest', 'assets/icon.svg', 'assets/icon-192.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  var font = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (u.origin !== location.origin && !font) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return fetch(e.request).then(function (r) {
      if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone());
      return r;
    }).catch(function () { return c.match(e.request, { ignoreSearch: font ? false : false }).then(function (h) { return h || c.match('index.html'); }); });
  }));
});
