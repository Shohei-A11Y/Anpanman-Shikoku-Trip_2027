(function () {
  var TABS = ['itinerary', 'cost', 'care', 'calls', 'pack'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function showTab(name, push) {
    if (TABS.indexOf(name) < 0) name = 'itinerary';
    $$('.tab').forEach(function (t) { t.classList.toggle('on', t.id === 'tab-' + name); });
    $$('.nav button').forEach(function (b) {
      if (b.dataset.tab === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (push !== false && location.hash !== '#p-' + name) { try { history.replaceState(null, '', '#p-' + name); } catch (e) {} }
    set('tab', name);
    window.scrollTo(0, 0);
  }

  function showDay(n) {
    n = Math.min(4, Math.max(1, parseInt(n, 10) || 1));
    $$('.day').forEach(function (d) { d.classList.toggle('on', d.id === 'day' + n); });
    $$('.chips button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.day == n ? 'true' : 'false'); });
    set('day', String(n));
  }

  $$('.nav button').forEach(function (b) { b.addEventListener('click', function () { showTab(b.dataset.tab); }); });
  $$('.chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      showDay(b.dataset.day);
      var c = $('.chips'); if (c) window.scrollTo(0, Math.max(0, c.getBoundingClientRect().top + window.scrollY - 4));
    });
  });
  function fromHash() { return location.hash.replace(/^#p-/, ''); }
  window.addEventListener('hashchange', function () { showTab(fromHash(), false); });

  var start = fromHash() || get('tab') || 'itinerary';
  showTab(start, false);
  showDay(get('day') || 1);

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
