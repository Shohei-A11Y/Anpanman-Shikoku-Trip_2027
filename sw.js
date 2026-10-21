// オフラインでも開けるようにするための仕組み（見たページを端末に保存する）
var CACHE = 'shiori-anpanman-v1';
var FILES = ['./', 'index.html', 'assets/style.css', 'assets/app.js', 'manifest.webmanifest', 'assets/icon.svg', 'assets/icon-192.png'];
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
  var ok = u.origin === location.origin || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!ok) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: false }).then(function (hit) {
      var net = fetch(e.request).then(function (r) {
        if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone());
        return r;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
