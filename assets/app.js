/* アンパンマン列車 四国しおり（2027.10.15-18）
   画面：きょう（旅行の日だけ）／日程／のりもの／スポット／やど／その他 */
(function () {
  'use strict';
  var D = window.TRIP_DATA, P = window.PLAN;
  var app = document.getElementById('app');
  var nav = document.getElementById('nav');
  var SPOT = {}; D.spots.forEach(function (s) { SPOT[s.id] = s; });
  var RIDE = {}; P.rides.forEach(function (r) { RIDE[r.id] = r; });

  /* ---------- 小さな道具 ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rich(s) {  // 【確定】【推測】などを、小さな目印に。電話番号はタップで電話。
    var t = esc(s);
    t = t.replace(/【(確定|予想|推測|わからない)([^】]*)】/g, function (m, a, b) { return '<span class="tag ' + tagClass(a) + '">' + a + (b ? esc(b.replace(/^[：:]/, '：')) : '') + '</span>'; });
    t = t.replace(/(\d{2,4}-\d{2,4}-\d{3,4})/g, '<a class="tel" href="tel:$1">$1</a>');
    return t;
  }
  function tagClass(a) { return a === '確定' ? 't-ok' : a === '予想' ? 't-fc' : a === '推測' ? 't-gs' : 't-na'; }
  function sureTag(a) { return a ? '<span class="tag ' + tagClass(a) + '">' + esc(a) + '</span>' : ''; }
  function safeUrl(u) { return /^https?:\/\//.test(u || '') ? u : ''; }
  function link(label, url) { var u = safeUrl(url); return u ? '<a class="chip-link" href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(label) + '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11"/></svg></a>' : ''; }
  function mapUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- いま（日本時間）。?today=2027-10-16T09:00 で試せる ---------- */
  function nowJST() {
    var m = /[?&]today=(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}))?/.exec(location.search);
    if (m) return { date: m[1], time: m[2] || '12:00' };
    var s = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
    return { date: s.slice(0, 10), time: s.slice(11, 16) };
  }
  function todayDay() { var n = nowJST(), r = null; P.days.forEach(function (d) { if (d.date === n.date) r = d; }); return r; }
  function toMin(t) { var m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? (+m[1]) * 60 + (+m[2]) : null; }

  /* ---------- 絵（線のイラスト） ---------- */
  var IC = {
    train: '<rect x="12" y="8" width="24" height="26" rx="6"/><rect x="16" y="13" width="16" height="9" rx="2"/><path d="M18 28h.1M30 28h.1M16 34l-4 8M32 34l4 8M10 42h28"/>',
    castle: '<path d="M8 41h32M11 41V28h26v13M15 28l-3-6h24l-3 6M19 22l-3-6h16l-3 6M24 16V8M20 41v-7h8v7"/>',
    food: '<path d="M7 22h34c0 11-7 18-17 18S7 33 7 22zM16 10c-2 3 2 5 0 8M24 8c-2 3 2 5 0 10M32 10c-2 3 2 5 0 8"/>',
    museum: '<path d="M6 19 24 8l18 11zM10 21v16M19 21v16M29 21v16M38 21v16M6 41h36"/>',
    store: '<path d="M8 18l4-8h24l4 8M8 18v22h32V18M8 18c0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0M19 40V28h10v12"/>',
    zoo: '<circle cx="14" cy="22" r="3.5"/><circle cx="21" cy="14" r="3.5"/><circle cx="31" cy="14" r="3.5"/><circle cx="38" cy="22" r="3.5"/><path d="M26 26c-8 0-12 6-12 11 0 4 4 5 12 5s12-1 12-5c0-5-4-11-12-11z"/>',
    stall: '<path d="M6 18l4-8h28l4 8zM10 18v22M38 18v22M6 41h36M10 30h28M16 30v-5h16v5"/>',
    torii: '<path d="M5 13h38M10 20h28M14 13v28M34 13v28M24 13v7M8 41h12M28 41h12"/>',
    bag: '<path d="M10 16h28l-2 24H12zM18 20v-5a6 6 0 0 1 12 0v5"/>',
    tree: '<path d="M24 42V20M24 8l-9 11h18zM24 16l-12 13h24zM24 25l-15 15h30z"/>',
    house: '<path d="M6 24 24 8l18 16M12 22v20h24V22M20 42V30h8v12"/>',
    car: '<path d="M6 30l4-10h28l4 10v8H6zM6 30h36M14 38v4M34 38v4M15 34h.1M33 34h.1"/>',
    rain: '<path d="M8 26a16 16 0 0 1 32 0zM24 26v12a3 3 0 0 1-6 0"/>',
    walk: '<circle cx="26" cy="9" r="3.5"/><path d="M24 15l-5 10 5 4v10M24 15l7 6 6 2M19 25l-6 3M24 29l7 10"/>',
    tram: '<rect x="12" y="10" width="24" height="26" rx="5"/><path d="M12 24h24M18 36l-3 6M30 36l3 6M24 10V5M17 5h14M18 30h.1M30 30h.1"/>',
    bus: '<rect x="9" y="10" width="30" height="26" rx="5"/><path d="M9 24h30M14 36v5M34 36v5M15 30h.1M33 30h.1"/>',
    shinkansen: '<path d="M6 32c0-8 6-16 20-16h14a3 3 0 0 1 3 3v13zM6 32h37M16 22h6M28 22h6M12 40h24"/>',
    metro: '<rect x="12" y="8" width="24" height="26" rx="6"/><path d="M12 22h24M18 34l-4 8M30 34l4 8M18 28h.1M30 28h.1"/>',
    sun: '<circle cx="24" cy="24" r="7"/><path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l3 3M33 33l3 3M36 12l-3 3M15 33l-3 3"/>',
    route: '<circle cx="12" cy="36" r="4"/><circle cx="36" cy="12" r="4"/><path d="M16 36h14a6 6 0 0 0 0-12H18a6 6 0 0 1 0-12h14"/>',
    ticket: '<path d="M6 16h36v6a3 3 0 0 0 0 6v6H6v-6a3 3 0 0 0 0-6zM30 16v18"/>',
    pin: '<path d="M24 42S10 29 10 19a14 14 0 0 1 28 0c0 10-14 23-14 23z"/><circle cx="24" cy="19" r="5"/>',
    phone: '<path d="M14 8h6l3 9-4 3a22 22 0 0 0 9 9l3-4 9 3v6a4 4 0 0 1-4 4C22 38 10 26 10 12a4 4 0 0 1 4-4z"/>',
    grid: '<rect x="8" y="8" width="13" height="13" rx="3"/><rect x="27" y="8" width="13" height="13" rx="3"/><rect x="8" y="27" width="13" height="13" rx="3"/><rect x="27" y="27" width="13" height="13" rx="3"/>',
    umb: '<path d="M8 26a16 16 0 0 1 32 0zM24 26v12a3 3 0 0 1-6 0"/>'
  };
  function icon(name, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 48 48" aria-hidden="true">' + (IC[name] || IC.pin) + '</svg>'; }
  var SPOT_IC = {
    'kochi-station': 'train', 'kochi-castle': 'castle', 'hirome-market': 'food', 'anpanman-museum': 'museum', 'niro-no-sato': 'store', 'noichi-zoo': 'zoo',
    'nichiyouichi': 'stall', 'kotohira-station': 'train', 'kotohira-konpira-udon': 'food', 'kotohira-tanukiya': 'food', 'kotohira-tentekomai': 'food',
    'kotohira-gu-sando': 'torii', 'okayama-station': 'train', 'aeon-mall-okayama': 'bag', 'okayama-korakuen': 'tree'
  };
  var TYPE_IC = { station: 'train', hotel: 'house', car: 'car', food: 'food', spot: 'pin' };
  function stopIcon(it) { return it.spot && SPOT_IC[it.spot] ? SPOT_IC[it.spot] : (it.spots ? 'food' : (TYPE_IC[it.type] || 'pin')); }

  /* ---------- 下のメニュー ---------- */
  function navHtml(active) {
    var items = [];
    if (todayDay()) items.push(['today', 'きょう', 'sun', '#/today']);
    items.push(['day', '日程', 'route', '#/day/' + (get('day') || 1)]);
    items.push(['ride', 'のりもの', 'ticket', '#/ride']);
    items.push(['spots', 'スポット', 'pin', '#/spots']);
    items.push(['stay', 'やど', 'house', '#/stay']);
    items.push(['more', 'その他', 'grid', '#/more']);
    return '<div class="nav-in">' + items.map(function (x) {
      return '<a href="' + x[3] + '"' + (x[0] === active ? ' aria-current="page"' : '') + '>' + icon(x[2]) + '<span>' + x[1] + '</span></a>';
    }).join('') + '</div>';
  }

  /* ---------- 日程 ---------- */
  function dayTabs(cur) {
    return '<div class="daytabs" role="tablist">' + P.days.map(function (d) {
      return '<a role="tab" class="' + d.color + (d.n === cur ? ' on' : '') + '" href="#/day/' + d.n + '" aria-selected="' + (d.n === cur) + '"><small>DAY ' + d.n + '</small><b>' + d.dd + '</b><em>' + d.dow + '</em></a>';
    }).join('') + '</div>';
  }
  function rainBanner(n) {
    var list = (D.rainPlans[String(n)] || []);
    if (!list.length) return '';
    return '<a class="rainbar" href="#/rain/' + n + '">' + icon('rain') + '<span><b>雨の日はこちら</b><small>屋内の候補 ' + list.length + 'か所</small></span><svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></a>';
  }
  function stopHtml(it, day, st) {
    var cls = 'stop ' + (it.type || '') + (it.minor ? ' minor' : '') + (it.kind ? ' ' + it.kind : '') + (st ? ' ' + st : '');
    var target = '';
    if (it.spot && SPOT[it.spot]) target = '#/spot/' + it.spot;
    else if (it.stay) target = '#/stay/' + it.stay;
    var timeEst = it.est && /^\d/.test(it.est) && !it.at ? '<b>' + it.est + '</b><small>ごろ</small>' : '';
    var tcol = timeEst + (function () {
      var a = [];
      if (it.at) a.push('<b>' + it.at + '</b><small>着</small>');
      else if (it.est && !/^\d/.test(it.est)) a.push('<b class="soft">' + esc(it.est) + '</b>');
      if (it.dep) a.push('<b>' + it.dep + '</b><small>発</small>');
      return a.join('');
    })();
    var title = it.spots ? '<span class="nm">' + esc(it.name) + '</span>' : '<span class="nm">' + esc(it.name) + '</span>';
    var kindLabel = it.kind === 'start' ? 'しゅっぱつ' : it.kind === 'goal' ? 'とうちゃく' : (it.type === 'hotel' ? 'やど' : it.type === 'car' ? 'くるま' : it.type === 'food' ? 'ごはん' : it.type === 'spot' ? 'おでかけ' : '');
    var body = (kindLabel && !it.minor ? '<span class="kl">' + kindLabel + (it.tag ? '　<i>' + esc(it.tag) + '</i>' : '') + '</span>' : (it.tag ? '<span class="kl"><i>' + esc(it.tag) + '</i></span>' : '')) + title +
      (it.note ? '<span class="nt">' + rich(it.note) + '</span>' : '');
    var btn = '';
    if (it.spots) btn = '<span class="btns">' + it.spots.map(function (id) { return '<a class="btn" href="#/spot/' + id + '">' + esc(SPOT[id].name.replace(/\s*参道店|宗家金毘羅饂飩\s*/g, '').replace('うどん茶屋 ', '')) + '</a>'; }).join('') + '</span>';
    else if (target) btn = '<a class="btn" href="' + target + '">' + (it.stay ? 'くわしく' : 'くわしく') + '</a>';
    return '<li class="' + cls + '" data-at="' + esc(it.at || it.dep || '') + '"><div class="tc">' + tcol + '</div><div class="dot">' + (it.minor ? '' : icon(stopIcon(it))) + '</div><div class="bd">' + body + btn + '</div></li>';
  }
  function moveHtml(it) {
    var min = it.min == null ? '' : it.min + '分';
    var alts = it.alts ? '<ul class="alts">' + it.alts.map(function (a) { return '<li>' + icon(a[0]) + '<b>' + a[1] + '分</b>' + esc(a[2]) + '</li>'; }).join('') + '</ul>' : '';
    var det = (it.detail ? '<p>' + rich(it.detail) + (it.sure ? ' ' + sureTag(it.sure) : '') + '</p>' : (it.sure ? '<p>' + sureTag(it.sure) + '</p>' : '')) + alts;
    var ride = it.ride && RIDE[it.ride] ? '<a class="btn sm" href="#/ride/' + it.ride + '">のりもの</a>' : '';
    return '<li class="move' + (it.hot ? ' hot' : '') + '"><div class="tc"><small>' + min + '</small></div><div class="dot"></div><div class="bd"><div class="mv">' + icon(it.mode, 'mi') + '<span class="mt">' + esc(it.text) + '</span>' +
      (det ? '<button type="button" class="more-btn" aria-expanded="false">詳細</button>' : '') + ride + '</div>' + (det ? '<div class="mdet" hidden>' + det + '</div>' : '') + '</div></li>';
  }
  function timeline(day, nowInfo) {
    var next = -1;
    if (nowInfo) {
      var nm = toMin(nowInfo.time);
      for (var i = 0; i < day.items.length; i++) {
        var it = day.items[i];
        if (it.k !== 'stop') continue;
        var t = toMin(it.dep) != null ? toMin(it.dep) : toMin(it.at);
        if (t != null && t >= nm) { next = i; break; }
      }
    }
    var out = day.items.map(function (it, i) {
      if (it.k === 'move') return moveHtml(it);
      if (it.k === 'choice') return '<li class="choice"><span>' + esc(it.text) + '</span></li>';
      var st = '';
      if (nowInfo) { if (next === -1) st = 'past'; else if (i < next) st = 'past'; else if (i === next) st = 'next'; }
      return stopHtml(it, day, st);
    });
    return '<ol class="tl ' + day.color + '">' + out.join('') + '</ol>';
  }
  function dayHead(d) {
    return '<header class="dayhead ' + d.color + '"><span class="badge">' + d.n + '日目</span><h1>' + esc(d.title) + '</h1><p>' + esc(d.route) + '　<i>' + d.date.slice(5).replace('-', '/') + '（' + d.dow + '）</i></p></header>';
  }
  function viewDay(n) {
    n = Math.min(4, Math.max(1, parseInt(n, 10) || 1));
    set('day', String(n));
    var d = P.days[n - 1];
    return dayTabs(n) + '<div class="pad ' + d.color + '">' + dayHead(d) + rainBanner(n) + timeline(d, null) + '</div>';
  }
  function viewToday() {
    var d = todayDay();
    if (!d) return viewDay(1);
    var now = nowJST();
    var nm = toMin(now.time), nxt = null;
    d.items.forEach(function (it) {
      if (nxt || it.k !== 'stop') return;
      var t = toMin(it.dep) != null ? toMin(it.dep) : toMin(it.at);
      if (t != null && t >= nm) nxt = it;
    });
    var card = nxt ? '<div class="nowcard"><small>つぎは</small><b>' + esc(nxt.name) + '</b><span>' + (nxt.at ? nxt.at + '着' : '') + (nxt.dep ? '　' + nxt.dep + '発' : '') + '</span></div>' : '<div class="nowcard done"><small>きょうの予定は</small><b>ぜんぶ終わり</b><span>おつかれさま</span></div>';
    return '<div class="pad ' + d.color + '"><header class="dayhead ' + d.color + '"><span class="badge">きょう</span><h1>' + esc(d.title) + '</h1><p>' + esc(d.route) + '　<i>' + d.date.slice(5).replace('-', '/') + '（' + d.dow + '）' + now.time + '</i></p></header>' + card + rainBanner(d.n) + timeline(d, now) + '</div>';
  }

  /* ---------- 雨の日はこちら ---------- */
  function viewRain(n) {
    var list = D.rainPlans[String(n)] || [], d = P.days[n - 1] || P.days[0];
    var items = list.map(function (r) {
      return '<article class="card"><div class="ch">' + icon('rain', 'ci') + '<div><small>' + esc(r.kind) + '</small><h3>' + esc(r.name) + '</h3></div>' + sureTag(r.sure) + '</div>' +
        '<dl class="info">' + row('行き方', r.move) + row('営業', r.hours) + row('料金', r.fee) + '</dl>' +
        (r.note ? '<p class="warn">' + rich(r.note) + '</p>' : '') +
        '<div class="links">' + (r.links || []).map(function (l) { return link(l[0], l[1]); }).join('') + '</div></article>';
    }).join('');
    return '<div class="pad ' + d.color + '"><a class="back" href="#/day/' + n + '">← ' + n + '日目の日程にもどる</a><header class="pagehead"><small>' + n + '日目　' + esc(P.rainTitles[n] || '') + '</small><h1>雨の日はこちら</h1><p>屋内で過ごせる候補。雨の日は、下の候補から選んで、予定をかえる。</p></header>' + items + '</div>';
  }
  function row(k, v) { return v ? '<div><dt>' + esc(k) + '</dt><dd>' + rich(v) + '</dd></div>' : ''; }

  /* ---------- のりもの ---------- */
  function viewRide(id) {
    var byDay = {};
    P.rides.forEach(function (r) { (byDay[r.day] = byDay[r.day] || []).push(r); });
    var html = Object.keys(byDay).map(function (dn) {
      var d = P.days[dn - 1];
      return '<h2 class="sh ' + d.color + '"><span>' + d.n + '日目</span> ' + d.date.slice(5).replace('-', '/') + '（' + d.dow + '）</h2>' + byDay[dn].map(function (r) {
        return '<article class="ticket' + (r.hot ? ' hot' : '') + '" id="r-' + r.id + '"><div class="tk-top"><span class="kind">' + esc(r.kind) + '</span><b class="nm">' + esc(r.name) + '</b></div>' +
          '<div class="tk-mid"><div><b>' + r.dep + '</b><span>' + esc(r.from) + '</span></div><i></i><div><b>' + r.arr + '</b><span>' + esc(r.to) + '</span></div></div>' +
          '<p class="tk-note">' + rich(r.note) + '</p>' + (r.alt ? '<p class="alt">' + rich(r.alt) + '</p>' : '') + '</article>';
      }).join('');
    }).join('');
    var fare = '<h2 class="sh"><span>きっぷ</span> 子供のルールなど</h2><dl class="info card-plain">' + P.fare.map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>';
    var note = '<p class="notice">時刻は2026年10月時点のもの。2027年のダイヤは、まだ発表されていない。予約の前に、JR四国などの公式ページで確認する。</p>';
    return '<div class="pad"><header class="pagehead"><small>Rides</small><h1>のりもの</h1></header>' + note + html + fare + '</div>';
  }

  /* ---------- スポット ---------- */
  function viewSpots() {
    var html = P.days.map(function (d) {
      var list = D.spots.filter(function (s) { return s.day === d.n; });
      return '<h2 class="sh ' + d.color + '"><span>' + d.n + '日目</span> ' + d.date.slice(5).replace('-', '/') + '（' + d.dow + '）　' + esc(d.theme) + '</h2><div class="spotlist">' + list.map(function (s) {
        return '<a class="spotcard ' + d.color + '" href="#/spot/' + s.id + '">' + icon(SPOT_IC[s.id] || 'pin', 'si') + '<span class="tx"><small>' + esc(s.when) + '</small><b>' + esc(s.name) + '</b><em>' + esc(s.area) + (s.rain ? '　<i>雨でもOK</i>' : '') + '</em></span><svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></a>';
      }).join('') + '</div>';
    }).join('');
    return '<div class="pad"><header class="pagehead"><small>Spots</small><h1>スポット</h1><p>行く場所の、住所・営業時間・料金・子連れのメモ。</p></header>' + html + '</div>';
  }
  function viewSpot(id) {
    var s = SPOT[id];
    if (!s) return '<div class="pad"><p>見つかりませんでした。</p><a class="back" href="#/spots">スポットの一覧へ</a></div>';
    var d = P.days[s.day - 1];
    var info = '<dl class="info">' + (s.info || []).map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>';
    var fees = s.fees && s.fees.length ? '<h2 class="sub">料金</h2><dl class="info">' + s.fees.map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>' : '';
    var walk = s.walk && s.walk.length ? '<h2 class="sub">おすすめの歩き方</h2><ol class="walk">' + s.walk.map(function (w) { return '<li>' + rich(w) + '</li>'; }).join('') + '</ol>' + (s.walkNote ? '<p class="note">※' + rich(s.walkNote) + '</p>' : '') : '';
    var kids = s.kids ? '<div class="kidsbox"><b>子連れメモ</b><p>' + rich(s.kids) + '</p></div>' : '';
    return '<div class="pad ' + d.color + '"><a class="back" href="#/spots">← スポットの一覧</a><header class="spothead">' + icon(SPOT_IC[s.id] || 'pin', 'big') + '<div><small>' + esc(s.kana || '') + '</small><h1>' + esc(s.name) + '</h1><p>' + esc(s.when) + '　' + sureTag(s.sure) + (s.rain ? ' <span class="tag t-ok">雨でもOK</span>' : '') + '</p></div></header>' +
      '<p class="lead">' + rich(s.lead) + '</p>' + kids + '<h2 class="sub">基本情報</h2>' + info + fees + walk +
      (s.warn ? '<p class="warn">' + rich(s.warn) + '</p>' : '') +
      '<div class="links">' + link('地図', mapUrl(s.map || s.name)) + link('公式の情報', s.url) + '</div></div>';
  }

  /* ---------- やど・くるま ---------- */
  function hotelHtml(h, key) {
    var br = h.breakfast || {};
    return '<article class="stay" id="s-' + key + '"><h2 class="sh"><span>やど</span> ' + esc(h.name) + '</h2><p class="nights">' + (h.nights || []).map(function (n) { return n.slice(5).replace('-', '/'); }).join('・') + ' の夜 ' + sureTag(h.sure) + '</p>' +
      '<dl class="info">' + row('住所', h.address) + row('電話', h.tel) + row('チェックイン', h.checkin) + row('チェックアウト', h.checkout) + row('行き方', h.access) + row('支払い', h.pay) + row('添い寝', h.soine) + row('朝食', [br.place, br.time].filter(Boolean).join('　')) + (br.text ? row('', br.text) : '') + '</dl>' +
      (h.perks && h.perks.length ? '<h3 class="sub">宿のサービス</h3><dl class="info">' + h.perks.map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>' : '') +
      (h.kidsFacilities && h.kidsFacilities.length ? '<h3 class="sub">子連れの設備</h3><dl class="info">' + h.kidsFacilities.map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>' : '') +
      '<div class="links">' + link('地図', mapUrl((D.places[h.name] || {}).q || h.name)) + link('公式サイト', h.url) + '</div></article>';
  }
  function carHtml(c) {
    return '<article class="stay" id="s-car"><h2 class="sh"><span>くるま</span> ' + esc(c.shop) + '</h2><p class="nights">2日目（10/16）に借りる ' + sureTag(c.sure) + '</p>' +
      '<dl class="info">' + row('住所', c.address) + row('電話', c.tel) + row('行き方', c.access) + row('営業', c.hours) + row('子供のシート', c.childSeat) + '</dl>' +
      (c.notes && c.notes.length ? '<h3 class="sub">借りる・返すときの注意</h3><dl class="info">' + c.notes.map(function (x) { return row(x[0], x[1]); }).join('') + '</dl>' : '') +
      '<div class="links">' + link('地図', mapUrl((D.places['トヨタレンタカー高知駅前店'] || {}).q || c.shop)) + link('公式サイト', c.url) + '</div></article>';
  }
  function viewStay(key) {
    var keys = ['tosa', 'makibi', 'car'];
    var chips = '<div class="chipbar">' + [['tosa', '土佐御苑'], ['makibi', 'ピュアリティまきび'], ['car', 'レンタカー']].map(function (c) { return '<a href="#/stay/' + c[0] + '"' + (c[0] === (key || 'tosa') ? ' class="on"' : '') + '>' + c[1] + '</a>'; }).join('') + '</div>';
    var h = D.hotels;
    var body = (key === 'makibi') ? hotelHtml(h[1], 'makibi') : (key === 'car') ? carHtml(D.car) : hotelHtml(h[0], 'tosa');
    return '<div class="pad"><header class="pagehead"><small>Stay &amp; Drive</small><h1>やど・くるま</h1></header>' + chips + body + '</div>';
  }


  /* ---------- 電話で聞くこと（聞いたら、チェック。この端末だけに保存） ---------- */
  function callChecks() { try { return JSON.parse(get('calls') || '{}'); } catch (e) { return {}; } }
  function viewCalls() {
    var C = P.calls, ck = callChecks();
    var cards = C.list.map(function (c, ci) {
      var d = P.days[c.day - 1];
      var qs = c.q.map(function (q, qi) {
        var id = ci + '-' + qi;
        return '<li><label><input type="checkbox" data-ck="' + id + '"' + (ck[id] ? ' checked' : '') + '><span>' + esc(q) + '</span></label></li>';
      }).join('');
      return '<article class="callcard ' + d.color + '"><div class="cc-top"><span class="badge">' + c.day + '日目</span><h3>' + esc(c.who) + '</h3></div>' +
        '<a class="telbtn" href="tel:' + c.tel + '">' + icon('phone') + '<b>' + c.tel + '</b></a>' +
        '<p class="cc-meta">受付：' + esc(c.hours) + '<br>かける時期：' + esc(c.when) + '</p><ul class="cc-q">' + qs + '</ul></article>';
    }).join('');
    return '<div class="callsec"><h2 class="sub0">電話で聞くこと</h2><p class="lead2">調べても、公式で確認できなかった点。聞いたら、チェックを入れる（この端末だけに保存される）。電話番号は、公式の掲載や、公式以外の掲載で見つけたもの<span class="tag t-gs">推測</span>。つながらないときは、公式サイトの問い合わせ先を使う。</p>' +
      '<div class="kidsbox"><b>はじめの一言（読み上げ用）</b><p>' + esc(C.intro) + '</p></div>' + cards + '</div>';
  }
  app.addEventListener('change', function (e) {
    var t = e.target; if (!t || !t.getAttribute || !t.getAttribute('data-ck')) return;
    var ck = callChecks(); if (t.checked) ck[t.getAttribute('data-ck')] = 1; else delete ck[t.getAttribute('data-ck')];
    set('calls', JSON.stringify(ck));
  });

  /* ---------- その他 ---------- */
  function viewMore() {
    var t = document.getElementById('tpl-other');
    return '<div class="pad"><header class="pagehead"><small>More</small><h1>その他</h1><p>費用、気をつける点、電話で聞くこと、持ち物。</p></header><p class="notice">調査日：' + esc(D.asOf) + '。【確定】公式で確認できた事実／【予想】過去の実績からの見込み／【推測】公式以外の情報や判断。「確定」以外は、予約の前に公式ページか電話で確認する。</p>' + viewCalls() + '<div class="other">' + (t ? t.innerHTML : '') + '</div></div>';
  }

  /* ---------- ルーティング ---------- */
  function route() {
    var h = (location.hash || '').replace(/^#\/?/, ''), p = h.split('/'), v = p[0], arg = p[1], html, active;
    var td = todayDay();
    if (!v) { v = td ? 'today' : 'day'; arg = td ? '' : (get('day') || 1); }
    if (v === 'today') { html = viewToday(); active = td ? 'today' : 'day'; }
    else if (v === 'day') { html = viewDay(arg); active = 'day'; }
    else if (v === 'rain') { html = viewRain(parseInt(arg, 10) || 1); active = 'day'; }
    else if (v === 'ride') { html = viewRide(arg); active = 'ride'; }
    else if (v === 'spots') { html = viewSpots(); active = 'spots'; }
    else if (v === 'spot') { html = viewSpot(arg); active = 'spots'; }
    else if (v === 'stay') { html = viewStay(arg); active = 'stay'; }
    else if (v === 'more') { html = viewMore(); active = 'more'; }
    else { html = viewDay(1); active = 'day'; }
    app.innerHTML = html;
    nav.innerHTML = navHtml(active);
    document.title = 'アンパンマン列車 四国しおり';
    if (v === 'ride' && arg && document.getElementById('r-' + arg)) { document.getElementById('r-' + arg).scrollIntoView(); }
    else if (v === 'today') { var nx = app.querySelector('.stop.next'); if (nx) nx.scrollIntoView({ block: 'center' }); else window.scrollTo(0, 0); }
    else window.scrollTo(0, 0);
  }
  app.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.more-btn');
    if (!b) return;
    var det = b.closest('.bd').querySelector('.mdet');
    if (!det) return;
    var open = det.hasAttribute('hidden');
    if (open) det.removeAttribute('hidden'); else det.setAttribute('hidden', '');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
