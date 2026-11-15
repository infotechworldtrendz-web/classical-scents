/* Classical Scents — UI, cart, wishlist, search, filters, product page. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fmt = function (n) { return 'Rs. ' + Math.round(n).toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  var cart = store.get('cs_cart', []), wish = store.get('cs_wish', []);
  if (!Array.isArray(cart)) cart = []; if (!Array.isArray(wish)) wish = [];
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.3c0 5.4-7.5 10-7.5 10z"/></svg>';
  var lastFocus = null;

  /* ---------- data helpers ---------- */
  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (String(PRODUCTS[i].id) === String(id)) return PRODUCTS[i]; return null; }
  function bySlug(s) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === s) return PRODUCTS[i]; return null; }
  function bundleById(id) { for (var i = 0; i < BUNDLES.length; i++) if (BUNDLES[i].id === id) return BUNDLES[i]; return null; }
  function imgSrc(p, n) { return 'images/products/' + (p.photos ? p.photos[n - 1] : p.image + '-' + n + '.' + IMAGE_EXT); }
  function webpSrc(p, n) { return p.photos ? imgSrc(p, n).replace(/\.(png|jpg)$/, '.webp') : (USE_WEBP ? 'images/products/' + p.image + '-' + n + '.webp' : ''); }
  function thumbSrc(p, n) { return webpSrc(p, n) || imgSrc(p, n); }
  function isPhoto(p, n) { return /\.jpg$/.test(imgSrc(p, n)); }
  function picture(p, n, cls, alt, eager) {
    var webp = webpSrc(p, n); cls += isPhoto(p, n) ? ' is-photo' : '';
    return '<picture>' + (webp ? '<source type="image/webp" srcset="' + webp + '">' : '') +
      '<img class="' + cls + '" src="' + imgSrc(p, n) + '" width="800" height="800" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '></picture>';
  }
  function defSize(p) { for (var i = 0; i < p.sizes.length; i++) if (p.sizes[i].ml === 50) return p.sizes[i]; return p.sizes[Math.min(1, p.sizes.length - 1)]; }
  function sizeOf(p, ml) { for (var i = 0; i < p.sizes.length; i++) if (String(p.sizes[i].ml) === String(ml)) return p.sizes[i]; return defSize(p); }
  function fromPrice(p) { return Math.min.apply(null, p.sizes.map(function (s) { return s.price; })); }
  function discount(s) { return s.originalPrice ? Math.round((1 - s.price / s.originalPrice) * 100) : 0; }
  function stars(r, n) {
    return '<span class="rating"><span class="stars" role="img" aria-label="Rated ' + r + ' out of 5"><span class="stars__fill" style="width:' + (r / 5 * 100) + '%"></span></span>' + (n != null ? '<span>' + r + ' (' + n + ')</span>' : '') + '</span>';
  }
  function badges(p) {
    var s = defSize(p), out = [];
    if (p.stock === 0) out.push('<span class="badge badge--soldout">Sold Out</span>');
    else if (discount(s)) out.push('<span class="badge badge--sale">-' + discount(s) + '%</span>');
    if (p.badges.indexOf('new') > -1) out.push('<span class="badge">New</span>');
    else if (p.badges.indexOf('bestseller') > -1) out.push('<span class="badge">Bestseller</span>');
    else if (p.badges.indexOf('restocked') > -1) out.push('<span class="badge">Restocked</span>');
    return out.join('');
  }
  function priceHtml(s) { return '<span class="price">' + fmt(s.price) + (s.originalPrice ? '<s>' + fmt(s.originalPrice) + '</s>' : '') + '</span>'; }
  function sizeChips(p, cur) {
    return '<div class="chips" role="radiogroup" aria-label="Size">' + p.sizes.map(function (s) {
      return '<button type="button" class="chip" role="radio" aria-checked="' + (s.ml === cur.ml) + '" data-ml="' + s.ml + '">' + s.ml + 'ml</button>';
    }).join('') + '</div>';
  }
  /* Stone-stage tile: moody backdrop, bottle standing on the stone and breaking out of the frame. */
  function stageHtml(p, withText, extraHtml) {
    var src = 'images/products/' + p.image, url = 'product.html?id=' + p.id, cw = (p.cut || [380, 720])[0];
    return '<div class="stage" style="--accent:' + (p.accent || '#C9A55C') + '">' +
      '<a class="stage__tile" href="' + url + '" aria-label="Discover ' + esc(p.name) + '">' +
        '<picture class="stage__bg"><source type="image/webp" srcset="' + src + '-stage.webp"><img src="' + src + '-stage.jpg" width="1000" height="900" alt="" loading="lazy" decoding="async"></picture>' +
        (extraHtml || '') +
        (withText ? '<span class="stage__text"><span class="stage__name">' + esc(p.name) + '</span><span class="stage__kicker">Extrait de Parfum</span><span class="stage__line">' + esc(p.tagline || '') + '</span></span>' +
          '<span class="stage__cta"><span class="stage__arrow"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 6l6 6-6 6\"/></svg></span>discover</span>' : '') +
      '</a>' +
      '<picture class="stage__bottle"><source type="image/webp" srcset="' + src + '-cut.webp"><img src="' + src + '-cut.png" width="' + cw + '" height="720" alt="' + esc(p.name) + ' perfume bottle" loading="lazy" decoding="async"></picture>' +
    '</div>';
  }
  function card(p) {
    var s = defSize(p), out = p.stock === 0, url = 'product.html?id=' + p.id;
    if (!p.cut) return legacyCard(p);
    return '<article class="card pcard' + (out ? ' card--soldout' : '') + '" data-id="' + p.id + '" data-ml="' + s.ml + '">' + stageHtml(p, true) +
      '<button type="button" class="icon-btn card__wish" data-wish="' + p.id + '" aria-pressed="' + (wish.indexOf(p.id) > -1) + '" aria-label="Add ' + esc(p.name) + ' to wishlist">' + HEART + '</button>' +
      '<div class="card__body"><h3 class="sr-only"><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
      '<div class="pcard__badges">' + badges(p) + '</div>' +
      '<p class="card__notes">' + esc(p.family) + ' • ' + esc(p.keyNotes.join(', ')) + '</p>' + stars(p.rating, p.reviewCount) +
      '<div class="card__price" data-price>' + priceHtml(s) + '</div><p class="card__desc">' + esc(p.description) + '</p>' + sizeChips(p, s) +
      '<div class="pcard__actions">' + (out ? '<button type="button" class="btn btn--gold btn--sm" data-notify="' + p.id + '">Notify Me</button>' : '<button type="button" class="btn btn--gold btn--sm" data-add="' + p.id + '">Add to Cart</button>') +
      '<button type="button" class="btn btn--outline btn--sm" data-quick="' + p.id + '">Quick View</button></div></div></article>';
  }
  function legacyCard(p) {
    var s = defSize(p), out = p.stock === 0, url = 'product.html?id=' + p.id, alt = p.name + ' ' + (p.type === 'attar' ? 'attar oil' : 'extrait de parfum') + ' bottle';
    return '<article class="card' + (out ? ' card--soldout' : '') + '" data-id="' + p.id + '" data-ml="' + s.ml + '">' +
      '<div class="card__media"><a href="' + url + '" tabindex="-1" aria-hidden="true">' + picture(p, 1, 'card__main', alt) + picture(p, 2, 'card__alt', '') + '</a>' +
      '<div class="card__badges">' + badges(p) + '</div>' +
      '<button type="button" class="icon-btn card__wish" data-wish="' + p.id + '" aria-pressed="' + (wish.indexOf(p.id) > -1) + '" aria-label="Add ' + esc(p.name) + ' to wishlist">' + HEART + '</button>' +
      '<div class="card__actions"><button type="button" class="btn btn--ghost btn--sm" data-quick="' + p.id + '">Quick View</button>' +
      (out ? '<button type="button" class="btn btn--gold btn--sm" data-notify="' + p.id + '">Notify Me</button>' : '<button type="button" class="btn btn--gold btn--sm" data-add="' + p.id + '">Add to Cart</button>') +
      '</div></div><div class="card__body"><h3 class="card__name"><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
      '<p class="card__notes">' + esc(p.family) + ' • ' + esc(p.keyNotes.join(', ')) + '</p>' + stars(p.rating, p.reviewCount) +
      '<div class="card__price" data-price>' + priceHtml(s) + '</div><p class="card__desc">' + esc(p.description) + '</p>' + sizeChips(p, s) + '</div></article>';
  }
  function bundleCard(b) {
    var save = Math.round((1 - b.price / b.compareAt) * 100);
    return '<article class="bundle" data-id="' + b.id + '"><img src="' + b.image + '" width="600" height="450" alt="' + esc(b.name) + ' gift box" loading="lazy" decoding="async">' +
      '<span class="badge badge--sale bundle__save">Save ' + save + '%</span><div class="bundle__body"><h3>' + esc(b.name) + '</h3><p class="bundle__sub">' + esc(b.subtitle) + '</p>' +
      '<p class="muted" style="font-size:.9rem">' + esc(b.description) + '</p><div class="card__price">' + priceHtml({ price: b.price, originalPrice: b.compareAt }) + '</div>' +
      '<button type="button" class="btn btn--gold" data-add="' + b.id + '">Add Set to Cart</button></div></article>';
  }
  function renderGrid(el, list) { el.innerHTML = list.map(card).join(''); }

  /* ---------- cart ---------- */
  function lineInfo(c) {
    var p = byId(c.id), b;
    if (p) { var s = sizeOf(p, c.ml); return { name: p.name, price: s.price, img: thumbSrc(p, 1), meta: s.ml + 'ml • ' + p.family, url: 'product.html?id=' + p.id, max: p.stock }; }
    b = bundleById(c.id);
    if (b) return { name: b.name, price: b.price, img: b.image, meta: b.subtitle, url: 'shop.html?collection=gift-sets', max: b.stock };
    return null;
  }
  function subtotal() { return cart.reduce(function (t, c) { var i = lineInfo(c); return t + (i ? i.price * c.qty : 0); }, 0); }
  function addToCart(id, ml, qty) {
    var p = byId(id), b = bundleById(id), item;
    if (p) { if (p.stock === 0) return; var s = sizeOf(p, ml); item = { key: p.id + ':' + s.ml, id: p.id, ml: s.ml, qty: 0 }; }
    else if (b) item = { key: b.id + ':set', id: b.id, ml: 'set', qty: 0 }; else return;
    var ex = null; cart.forEach(function (c) { if (c.key === item.key) ex = c; });
    if (ex) ex.qty = Math.min(ex.qty + (qty || 1), lineInfo(ex).max); else { item.qty = Math.min(qty || 1, (p || b).stock); cart.push(item); }
    saveCart(); toast((p || b).name + ' added to your cart'); openDrawer();
  }
  function saveCart() { cart = cart.filter(function (c) { return c.qty > 0 && lineInfo(c); }); store.set('cs_cart', cart); renderCart(); updateCounts(); }
  function renderCart() {
    var html = cart.length ? cart.map(function (c) {
      var i = lineInfo(c);
      return '<div class="line" data-key="' + c.key + '"><a href="' + i.url + '" tabindex="-1" aria-hidden="true"><img src="' + i.img + '" width="80" height="80" alt="" loading="lazy" decoding="async"></a><div>' +
        '<a class="line__name" href="' + i.url + '">' + esc(i.name) + '</a><div class="line__meta">' + esc(i.meta) + '</div><div class="line__row">' +
        '<div class="qty"><button type="button" data-qty="-1" aria-label="Decrease quantity of ' + esc(i.name) + '">−</button><span aria-live="polite">' + c.qty + '</span><button type="button" data-qty="1" aria-label="Increase quantity of ' + esc(i.name) + '">+</button></div>' +
        '<span class="price">' + fmt(i.price * c.qty) + '</span></div><button type="button" class="line__remove" data-remove>Remove</button></div></div>';
    }).join('') : '<div class="empty"><h3>Your cart is empty</h3><p>Find a signature worth wearing.</p><a class="btn btn--outline" href="shop.html">Shop all fragrances</a></div>';
    $$('[data-cart-lines]').forEach(function (el) { el.innerHTML = html; });
    var sub = subtotal(), left = Math.max(0, FREE_SHIPPING_THRESHOLD - sub), ship = sub === 0 || sub >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
    $$('[data-ship-text]').forEach(function (el) { el.innerHTML = !cart.length ? 'Free delivery on orders above ' + fmt(FREE_SHIPPING_THRESHOLD) : left > 0 ? 'Add <strong>' + fmt(left) + '</strong> more for free delivery' : '<strong>You have unlocked free delivery.</strong>'; });
    $$('[data-ship-fill]').forEach(function (el) { el.style.width = Math.min(100, sub / FREE_SHIPPING_THRESHOLD * 100) + '%'; });
    $$('[data-subtotal]').forEach(function (el) { el.textContent = fmt(sub); });
    $$('[data-shipping]').forEach(function (el) { el.textContent = ship ? fmt(ship) : 'Free'; });
    $$('[data-total]').forEach(function (el) { el.textContent = fmt(sub + ship); });
    $$('[data-checkout]').forEach(function (el) { el.disabled = !cart.length; });
  }
  function updateCounts() {
    var n = cart.reduce(function (t, c) { return t + c.qty; }, 0);
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n; el.hidden = !n; });
    $$('[data-wish-count]').forEach(function (el) { el.textContent = wish.length; el.hidden = !wish.length; });
  }
  function toggleWish(id) {
    id = Number(id); var i = wish.indexOf(id), p = byId(id);
    if (i > -1) wish.splice(i, 1); else wish.push(id);
    store.set('cs_wish', wish);
    $$('[data-wish="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', i === -1); });
    updateCounts(); toast(p.name + (i === -1 ? ' saved to your wishlist' : ' removed from your wishlist'));
  }
  var toastT;
  function toast(msg) { var t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('is-show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-show'); }, 2600); }

  /* ---------- drawer / modal / menu ---------- */
  function openDrawer() {
    var d = $('#cart-drawer'); if (!d) return; lastFocus = document.activeElement;
    d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false'); $('#drawer-backdrop').classList.add('is-open'); document.body.classList.add('no-scroll');
    setTimeout(function () { $('[data-close-drawer]', d).focus(); }, 50);
  }
  function closeDrawer() {
    var d = $('#cart-drawer'); if (!d || !d.classList.contains('is-open')) return;
    d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); $('#drawer-backdrop').classList.remove('is-open'); document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }
  function openModal(html, small) {
    var m = $('#modal'); if (!m) return; lastFocus = document.activeElement;
    $('.modal__content', m).innerHTML = html; $('.modal__box', m).classList.toggle('modal__box--sm', !!small);
    m.hidden = false; document.body.classList.add('no-scroll'); $('.modal__close', m).focus();
  }
  function closeModal() { var m = $('#modal'); if (!m || m.hidden) return; m.hidden = true; document.body.classList.remove('no-scroll'); if (lastFocus) lastFocus.focus(); }
  function quickView(p) {
    var s = defSize(p);
    openModal('<div class="quick" data-id="' + p.id + '" data-ml="' + s.ml + '"><div class="quick__media">' + picture(p, 1, '', p.name + ' bottle', true) + '</div><div>' +
      '<p class="eyebrow">' + esc(p.family) + ' • ' + (p.type === 'attar' ? 'Attar oil' : 'Extrait de Parfum') + '</p><h2 style="font-size:2rem">' + esc(p.name) + '</h2>' + stars(p.rating, p.reviewCount) +
      '<div class="card__price" data-price style="margin:12px 0">' + priceHtml(s) + '</div><p class="muted">' + esc(p.description) + '</p>' +
      '<p class="muted" style="font-size:.85rem">Top: ' + esc(p.topNotes.join(', ')) + '<br>Heart: ' + esc(p.heartNotes.join(', ')) + '<br>Base: ' + esc(p.baseNotes.join(', ')) + '</p>' +
      '<p class="pinfo__label">Size</p>' + sizeChips(p, s) + '<div style="display:grid;gap:10px;margin-top:20px">' +
      (p.stock === 0 ? '<button type="button" class="btn btn--gold" data-notify="' + p.id + '">Notify Me When Back</button>' : '<button type="button" class="btn btn--gold" data-add="' + p.id + '">Add to Cart</button>') +
      '<a class="btn btn--outline" href="product.html?id=' + p.id + '">View Full Details</a></div></div></div>');
  }
  function closeMenu() {
    var menu = $('#mobile-menu'), b = $('.header__burger'); if (!menu || menu.hidden) return;
    menu.hidden = true; document.body.classList.remove('no-scroll'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
  }
  function closeSearch() { var s = $('#search-overlay'); if (!s || s.hidden) return; s.hidden = true; document.body.classList.remove('no-scroll'); if (lastFocus) lastFocus.focus(); }
  function closeFilters() { var f = $('#filters'); if (f) { f.classList.remove('is-open'); $('#drawer-backdrop').classList.remove('is-open'); document.body.classList.remove('no-scroll'); } }

  /* ---------- global events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button, a') : null; if (!t) return;
    var root = t.closest('[data-id]'), id;
    if (t.hasAttribute('data-wish')) toggleWish(t.getAttribute('data-wish'));
    else if (t.hasAttribute('data-quick')) { closeModal(); quickView(byId(t.getAttribute('data-quick'))); }
    else if (t.hasAttribute('data-add')) { id = t.getAttribute('data-add'); var q = root && $('[data-qty-input]', root); closeModal(); addToCart(id, root ? root.getAttribute('data-ml') : null, q ? Number(q.value) || 1 : 1); }
    else if (t.hasAttribute('data-notify')) toast('We will message you the moment ' + byId(t.getAttribute('data-notify')).name + ' is back in stock.');
    else if (t.classList.contains('chip') && t.hasAttribute('data-ml') && root) {
      var p = byId(root.getAttribute('data-id')), s = sizeOf(p, t.getAttribute('data-ml'));
      root.setAttribute('data-ml', s.ml); $$('.chip[data-ml]', root).forEach(function (c) { c.setAttribute('aria-checked', c === t); });
      $$('[data-price]', root).forEach(function (el) { el.innerHTML = priceHtml(s); });
    }
    else if (t.hasAttribute('data-qty')) { var line = t.closest('[data-key]'); cart.forEach(function (c) { if (c.key === line.getAttribute('data-key')) c.qty = Math.min(c.qty + Number(t.getAttribute('data-qty')), lineInfo(c).max); }); saveCart(); }
    else if (t.hasAttribute('data-remove')) { var k = t.closest('[data-key]').getAttribute('data-key'); cart = cart.filter(function (c) { return c.key !== k; }); saveCart(); }
    else if (t.id === 'cart-btn') openDrawer();
    else if (t.hasAttribute('data-close-drawer')) closeDrawer();
    else if (t.classList.contains('modal__close')) closeModal();
    else if (t.hasAttribute('data-checkout')) checkout();
  });
  document.addEventListener('click', function (e) { if (e.target.id === 'drawer-backdrop') { closeDrawer(); closeFilters(); } if (e.target.id === 'modal') closeModal(); if (e.target.id === 'search-overlay') closeSearch(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeModal(); closeMenu(); closeSearch(); closeFilters(); } });

  function checkout() {
    var lines = cart.map(function (c) { var i = lineInfo(c); return c.qty + ' x ' + i.name + ' (' + i.meta.split(' • ')[0] + ') - ' + fmt(i.price * c.qty); });
    var msg = 'Assalam o Alaikum, I would like to order:\n' + lines.join('\n') + '\nSubtotal: ' + fmt(subtotal());
    openModal('<h2 style="font-size:1.8rem;margin-bottom:8px">Checkout</h2><p class="muted">Online checkout is coming soon. For now, send your order on WhatsApp and we will confirm delivery and payment (COD, JazzCash, Easypaisa or bank transfer) within minutes, 10am to 10pm.</p>' +
      '<a class="btn btn--gold btn--block" target="_blank" rel="noopener" href="https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent(msg) + '">Order on WhatsApp</a>', true);
  }

  /* ---------- header, search, menu ---------- */
  function initHeader() {
    var h = $('#header'); if (!h) return;
    var onScroll = function () { h.classList.toggle('is-scrolled', window.scrollY > 10); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var page = location.pathname.split('/').pop() || 'index.html', q = location.search;
    $$('.nav__list a, .mobile-menu__list a').forEach(function (a) { var href = a.getAttribute('href'); if (href === page + q || (href === page && !q) || (page === 'product.html' && href === 'shop.html' && !q)) a.setAttribute('aria-current', 'page'); });
    var an = $('#announce');
    if (an) { if (store.get('cs_announce', 0)) an.hidden = true; $('.announce__close', an).addEventListener('click', function () { an.hidden = true; store.set('cs_announce', 1); }); }
    var burger = $('.header__burger'), menu = $('#mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', function () { menu.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll'); $('#menu-close').focus(); });
      $('#menu-close').addEventListener('click', closeMenu);
    }
    var sb = $('#search-btn'), so = $('#search-overlay'), si = $('#search-input'), sr = $('#search-results');
    if (sb && so) {
      sb.addEventListener('click', function () { lastFocus = sb; so.hidden = false; document.body.classList.add('no-scroll'); si.value = ''; sr.innerHTML = ''; si.focus(); });
      $('#search-close').addEventListener('click', closeSearch);
      si.addEventListener('input', function () {
        var v = si.value.trim().toLowerCase();
        if (v.length < 2) { sr.innerHTML = ''; return; }
        var hits = PRODUCTS.filter(function (p) { return [p.name, p.family, p.gender, p.collection, p.type].concat(p.topNotes, p.heartNotes, p.baseNotes).join(' ').toLowerCase().indexOf(v) > -1; }).slice(0, 6);
        sr.innerHTML = hits.length ? hits.map(function (p) { return '<a class="search__item" href="product.html?id=' + p.id + '"><img src="' + thumbSrc(p, 1) + '" width="56" height="70" alt=""><span><strong>' + esc(p.name) + '</strong><small>' + esc(p.family) + ' • ' + esc(p.keyNotes.join(', ')) + '</small></span><span class="price">' + fmt(defSize(p).price) + '</span></a>'; }).join('') : '<p class="search__hint">No matches. Try a note like "oud", "rose" or "citrus".</p>';
      });
      si.addEventListener('keydown', function (e) { var f = $('.search__item', sr); if (e.key === 'Enter' && f) location.href = f.href; });
    }
    var ab = $('#account-btn'), ad = $('#account-dialog');
    if (ab && ad) { ab.addEventListener('click', function () { if (ad.showModal) ad.showModal(); else ad.setAttribute('open', ''); }); $('[data-close-dialog]', ad).addEventListener('click', function () { ad.close ? ad.close() : ad.removeAttribute('open'); }); }
  }

  /* ---------- generic widgets ---------- */
  function initTabs(scope) {
    $$('[data-tabs]', scope).forEach(function (w) {
      var tabs = $$('[role="tab"]', w);
      function select(tab) { tabs.forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; var p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; }); }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t); });
        t.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus(); } });
      });
    });
  }
  function initReveal() {
    var els = $$('.reveal'); if (!els.length) return;
    if (RM || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function initCountUp() {
    var els = $$('[data-count]'); if (!els.length) return;
    var run = function (el) {
      var end = parseFloat(el.getAttribute('data-count')), dec = Number(el.getAttribute('data-decimals') || 0), suf = el.getAttribute('data-suffix') || '', t0 = null;
      if (RM) { el.textContent = end.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf; return; }
      var step = function (ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1600); k = 1 - Math.pow(1 - k, 3); el.textContent = (end * k).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }); }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v); }
  function initForms() {
    $$('form[data-validate]').forEach(function (f) {
      f.setAttribute('novalidate', '');
      f.addEventListener('submit', function (e) {
        e.preventDefault(); var ok = true;
        $$('[required]', f).forEach(function (i) {
          var err = $('#' + i.id + '-error'), bad = !i.value.trim() || (i.type === 'email' && !validEmail(i.value)) || (i.minLength > 0 && i.value.trim().length < i.minLength);
          i.setAttribute('aria-invalid', bad); if (err) err.textContent = bad ? (i.type === 'email' ? 'Please enter a valid email address.' : 'This field is required.') : ''; if (bad) ok = false;
        });
        if (!ok) { $('[aria-invalid="true"]', f).focus(); return; }
        var done = $('[data-success]', f); f.reset(); if (done) { done.hidden = false; done.focus && done.setAttribute('tabindex', '-1'); done.focus(); }
        toast(f.getAttribute('data-success-toast') || 'Thank you.');
      });
      $$('[required]', f).forEach(function (i) { i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true' && i.value.trim()) { i.setAttribute('aria-invalid', 'false'); var err = $('#' + i.id + '-error'); if (err) err.textContent = ''; } }); });
    });
  }

  /* ---------- home ---------- */
  function initHero() {
    var c = $('#mist'), hero = $('#hero'); if (!c || RM || !c.getContext) return;
    var ctx = c.getContext('2d'), w, h, raf = null, visible = true, inView = true, last = 0;
    var P = []; for (var i = 0; i < 48; i++) P.push({ x: Math.random(), y: Math.random(), r: 0.1 + Math.random() * 0.2, vx: (Math.random() - 0.5) * 0.012, vy: -(0.006 + Math.random() * 0.012), a: 0.025 + Math.random() * 0.05, ph: Math.random() * 6.28 });
    function size() { w = c.width = Math.max(300, Math.floor(c.clientWidth / 2)); h = c.height = Math.max(200, Math.floor(c.clientHeight / 2)); }
    function frame(ts) {
      raf = null; var dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < P.length; i++) {
        var p = P[i]; p.x += p.vx * dt + Math.sin(ts / 4000 + p.ph) * 0.0004; p.y += p.vy * dt;
        if (p.y < -p.r) { p.y = 1 + p.r; p.x = Math.random(); } if (p.x < -p.r) p.x = 1 + p.r; if (p.x > 1 + p.r) p.x = -p.r;
        var x = p.x * w, y = p.y * h, r = p.r * w, g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(201,165,92,' + p.a + ')'); g.addColorStop(1, 'rgba(201,165,92,0)');
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      if (visible && inView) raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && visible && inView) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    size(); addEventListener('resize', size);
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; visible ? start() : stop(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; hero.classList.toggle('is-paused', !inView); inView ? start() : stop(); }).observe(hero);
    start();
  }
  function initHome() {
    if (!$('#home')) return;
    initHero();
    var sets = { bestsellers: 'bestseller', new: 'new', all: '' };
    Object.keys(sets).forEach(function (k) { var el = $('#panel-' + k + ' .grid'); if (el) renderGrid(el, PRODUCTS.filter(function (p) { return !sets[k] || p.badges.indexOf(sets[k]) > -1; }).slice(0, 4)); });
    var sg = $('#signatures');
    if (sg) sg.innerHTML = PRODUCTS.map(function (p, i) {
      var s = defSize(p), url = 'product.html?id=' + p.id, note = function (l, a) { return '<div><dt>' + l + '</dt><dd>' + esc(a.join(', ')) + '</dd></div>'; };
      var media = p.cut ? '<div class="sig__media sig__media--stage">' + stageHtml(p, false, '<span class="stage__num" aria-hidden="true">' + ('0' + (i + 1)).slice(-2) + '</span>') + '</div>'
        : '<a class="sig__media" href="' + url + '" aria-label="View ' + esc(p.name) + '">' + picture(p, 1, '', p.name + ' perfume bottle') + '</a>';
      return '<article class="sig reveal" data-id="' + p.id + '" data-ml="' + s.ml + '" style="--accent:' + (p.accent || '#C9A55C') + '">' + media +
        '<div class="sig__body"><p class="eyebrow">' + esc(p.family) + ' • ' + { men: 'For Men', women: 'For Women', unisex: 'Unisex' }[p.gender] + '</p><h3 class="sig__name">' + esc(p.name) + '</h3><p class="sig__desc">' + esc(p.description) + '</p>' +
        '<dl class="sig__notes">' + note('Top', p.topNotes) + note('Heart', p.heartNotes) + note('Base', p.baseNotes) + '</dl>' +
        '<div class="sig__buy"><div data-price>' + priceHtml(s) + '</div><span class="sig__size">' + s.ml + 'ml • ' + p.longevity + '+ hrs</span></div>' +
        '<div class="sig__cta"><a class="btn btn--gold" href="' + url + '">Discover ' + esc(p.name) + '</a>' +
        (p.stock === 0 ? '<button type="button" class="btn btn--outline" data-notify="' + p.id + '">Notify Me</button>' : '<button type="button" class="btn btn--outline" data-add="' + p.id + '">Add to Cart</button>') + '</div></div></article>';
    }).join('');
    var bu = $('#bundles'); if (bu) bu.innerHTML = BUNDLES.map(bundleCard).join('');
    var rv = $('#reviews-track');
    if (rv) {
      rv.innerHTML = REVIEWS.filter(function (r) { return r.featured; }).map(function (r) { var p = byId(r.productId); return '<article class="review"><span class="review__prod">' + esc(p.name) + '</span>' + stars(r.rating) + '<blockquote>“' + esc(r.quote) + '”</blockquote><p class="review__who"><strong>' + esc(r.name) + '</strong>' + esc(r.city) + ' • Verified buyer</p></article>'; }).join('');
      $$('[data-rev]').forEach(function (b) { b.addEventListener('click', function () { rv.scrollBy({ left: Number(b.getAttribute('data-rev')) * (rv.firstElementChild.offsetWidth + 16), behavior: RM ? 'auto' : 'smooth' }); }); });
    }
    var quiz = $('#quiz'), qr = $('#quiz-results');
    if (quiz && qr) {
      var FAM = { fresh: ['Citrus', 'Aquatic', 'Green'], floral: ['Floral'], woody: ['Woody', 'Leather'], oriental: ['Oriental', 'Amber', 'Oud'], sweet: ['Gourmand', 'Musky'] };
      var pick = {};
      quiz.addEventListener('click', function (e) {
        var b = e.target.closest('.chip[data-q]'); if (!b) return;
        var g = b.getAttribute('data-q'); pick[g] = pick[g] === b.value ? null : b.value;
        $$('.chip[data-q="' + g + '"]', quiz).forEach(function (c) { c.setAttribute('aria-checked', c.value === pick[g]); });
        if (!pick.occasion && !pick.mood && !pick.family) { qr.innerHTML = '<div class="quiz__placeholder"><p>Pick an occasion, a mood or a scent family and your three best matches appear here.</p></div>'; return; }
        var top = PRODUCTS.filter(function (p) { return p.stock > 0; }).map(function (p) {
          var sc = 0; if (pick.occasion && p.occasions.indexOf(pick.occasion) > -1) sc += 2; if (pick.mood && p.moods.indexOf(pick.mood) > -1) sc += 2; if (pick.family && FAM[pick.family].indexOf(p.family) > -1) sc += 3; return { p: p, sc: sc + p.rating / 10 };
        }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 3);
        qr.innerHTML = '<p class="eyebrow" aria-live="polite">Your top 3 matches</p><div class="grid grid--3">' + top.map(function (x) { return card(x.p); }).join('') + '</div>';
      });
    }
  }

  /* ---------- shop ---------- */
  function initShop() {
    var grid = $('#shop-grid'); if (!grid) return;
    var P = new URLSearchParams(location.search), f = $('#filters'), prices = PRODUCTS.map(fromPrice), PMIN = Math.floor(Math.min.apply(null, prices) / 100) * 100, PMAX = Math.ceil(Math.max.apply(null, prices) / 100) * 100;
    var st = { gender: (P.get('gender') || '').split(',').filter(Boolean), collection: (P.get('collection') || '').split(',').filter(Boolean), family: (P.get('family') || '').split(',').filter(Boolean),
      type: P.get('type') || '', q: (P.get('q') || '').trim().toLowerCase(), min: Number(P.get('min')) || PMIN, max: Number(P.get('max')) || PMAX, instock: P.get('instock') === '1', sort: P.get('sort') || 'featured', wishlist: P.get('wishlist') === '1', view: store.get('cs_view', 'grid') };
    var fams = []; PRODUCTS.forEach(function (p) { if (fams.indexOf(p.family) < 0) fams.push(p.family); }); fams.sort();
    function count(fn) { return PRODUCTS.filter(fn).length; }
    $('#f-family').innerHTML = fams.map(function (x) { return '<label class="check"><input type="checkbox" name="family" value="' + x + '"' + (st.family.indexOf(x) > -1 ? ' checked' : '') + '>' + x + '<span class="n">' + count(function (p) { return p.family === x; }) + '</span></label>'; }).join('');
    $('#f-collection').innerHTML = COLLECTIONS.map(function (c) { return '<label class="check"><input type="checkbox" name="collection" value="' + c.slug + '"' + (st.collection.indexOf(c.slug) > -1 ? ' checked' : '') + '>' + c.name + '<span class="n">' + (c.slug === 'gift-sets' ? BUNDLES.length : count(function (p) { return p.collection === c.slug; })) + '</span></label>'; }).join('');
    $$('input[name="gender"]', f).forEach(function (i) { i.checked = st.gender.indexOf(i.value) > -1; });
    var mn = $('#f-min'), mx = $('#f-max'); mn.min = mx.min = PMIN; mn.max = mx.max = PMAX; mn.value = st.min; mx.value = st.max;
    $('#f-instock').checked = st.instock; $('#sort').value = st.sort;
    function heading() {
      var g = st.gender.length === 1 ? st.gender[0] : '', c = st.collection.length === 1 ? COLLECTIONS.filter(function (x) { return x.slug === st.collection[0]; })[0] : null;
      var t = st.wishlist ? 'Your Wishlist' : st.type === 'attar' ? 'Attars' : c ? c.name : g ? { men: 'Men’s Fragrances', women: 'Women’s Fragrances', unisex: 'Unisex Fragrances' }[g] : 'All Fragrances';
      $('#shop-title').textContent = t; $('#crumb-current').textContent = t; document.title = t + ' | Classical Scents';
      $('#shop-lead').textContent = st.wishlist ? 'Everything you have saved, in one place.' : c ? c.tagline : st.type === 'attar' ? 'Pure oil attars. One drop, all day.' : 'Extrait de parfum, composed in Karachi and delivered nationwide.';
    }
    function apply() {
      var gift = st.collection.length === 1 && st.collection[0] === 'gift-sets';
      var list = PRODUCTS.filter(function (p) {
        var pr = fromPrice(p);
        return (!st.gender.length || st.gender.indexOf(p.gender) > -1) && (!st.collection.length || st.collection.indexOf(p.collection) > -1) && (!st.family.length || st.family.indexOf(p.family) > -1) &&
          (!st.type || p.type === st.type) && pr >= st.min && pr <= st.max && (!st.instock || p.stock > 0) && (!st.wishlist || wish.indexOf(p.id) > -1) &&
          (!st.q || [p.name, p.family].concat(p.topNotes, p.heartNotes, p.baseNotes).join(' ').toLowerCase().indexOf(st.q) > -1);
      });
      var S = { 'price-asc': function (a, b) { return fromPrice(a) - fromPrice(b); }, 'price-desc': function (a, b) { return fromPrice(b) - fromPrice(a); }, newest: function (a, b) { return (b.badges.indexOf('new') > -1) - (a.badges.indexOf('new') > -1) || b.id - a.id; }, rating: function (a, b) { return b.rating - a.rating || b.reviewCount - a.reviewCount; },
        featured: function (a, b) { return (b.badges.indexOf('bestseller') > -1) - (a.badges.indexOf('bestseller') > -1) || (b.stock > 0) - (a.stock > 0) || b.reviewCount - a.reviewCount; } };
      list.sort(S[st.sort] || S.featured);
      grid.className = 'grid' + (st.view === 'list' ? ' grid--list' : '');
      if (gift) { grid.className = 'bundles'; grid.innerHTML = BUNDLES.map(bundleCard).join(''); $('#shop-count').textContent = BUNDLES.length + ' gift sets'; }
      else { grid.innerHTML = list.length ? list.map(card).join('') : '<div class="empty" style="grid-column:1/-1"><h3>Nothing matches those filters</h3><p>Try widening the price range or clearing a filter.</p><button type="button" class="btn btn--outline" data-clear="all">Clear all filters</button></div>'; $('#shop-count').textContent = list.length + ' of ' + PRODUCTS.length + ' fragrances'; }
      $('#range-min').textContent = fmt(st.min); $('#range-max').textContent = fmt(st.max);
      var q = new URLSearchParams();
      if (st.gender.length) q.set('gender', st.gender.join(',')); if (st.collection.length) q.set('collection', st.collection.join(',')); if (st.family.length) q.set('family', st.family.join(','));
      if (st.type) q.set('type', st.type); if (st.q) q.set('q', st.q); if (st.min > PMIN) q.set('min', st.min); if (st.max < PMAX) q.set('max', st.max); if (st.instock) q.set('instock', '1'); if (st.sort !== 'featured') q.set('sort', st.sort); if (st.wishlist) q.set('wishlist', '1');
      var qs = q.toString(); history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
      var chips = []; st.gender.forEach(function (x) { chips.push(['gender', x, x]); }); st.collection.forEach(function (x) { chips.push(['collection', x, (COLLECTIONS.filter(function (c) { return c.slug === x; })[0] || {}).name || x]); }); st.family.forEach(function (x) { chips.push(['family', x, x]); });
      if (st.type) chips.push(['type', st.type, st.type === 'attar' ? 'Attars' : st.type]); if (st.q) chips.push(['q', '', 'Search: ' + st.q]); if (st.instock) chips.push(['instock', '', 'In stock']); if (st.wishlist) chips.push(['wishlist', '', 'Wishlist']); if (st.min > PMIN || st.max < PMAX) chips.push(['price', '', fmt(st.min) + ' – ' + fmt(st.max)]);
      $('#active-filters').innerHTML = chips.map(function (c) { return '<button type="button" class="chip is-active" data-clear="' + c[0] + '" data-val="' + c[1] + '" aria-label="Remove filter ' + esc(c[2]) + '">' + esc(c[2]) + '</button>'; }).join('') + (chips.length ? '<button type="button" class="chip" id="clear-all">Clear all</button>' : '');
      heading();
    }
    f.addEventListener('change', function (e) {
      var i = e.target; if (!i.name && i.id !== 'f-instock') return;
      if (i.name === 'gender' || i.name === 'collection' || i.name === 'family') st[i.name] = $$('input[name="' + i.name + '"]:checked', f).map(function (x) { return x.value; });
      if (i.id === 'f-instock') st.instock = i.checked; apply();
    });
    f.addEventListener('input', function (e) {
      if (e.target === mn || e.target === mx) { var a = Number(mn.value), b = Number(mx.value); if (a > b) { if (e.target === mn) mx.value = a; else mn.value = b; } st.min = Math.min(a, b); st.max = Math.max(a, b); apply(); }
    });
    $('#sort').addEventListener('change', function (e) { st.sort = e.target.value; apply(); });
    $$('[data-view]').forEach(function (b) { b.addEventListener('click', function () { st.view = b.getAttribute('data-view'); store.set('cs_view', st.view); $$('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); apply(); }); b.setAttribute('aria-pressed', b.getAttribute('data-view') === st.view); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-clear], #clear-all'); if (!b) return;
      var k = b.getAttribute('data-clear'), v = b.getAttribute('data-val');
      if (b.id === 'clear-all' || k === 'all') { st.gender = []; st.collection = []; st.family = []; st.type = ''; st.q = ''; st.instock = false; st.wishlist = false; st.min = PMIN; st.max = PMAX; }
      else if (k === 'price') { st.min = PMIN; st.max = PMAX; } else if (k === 'instock' || k === 'wishlist') st[k] = false; else if (k === 'type' || k === 'q') st[k] = ''; else st[k] = st[k].filter(function (x) { return x !== v; });
      $$('input[type="checkbox"]', f).forEach(function (i) { i.checked = i.id === 'f-instock' ? st.instock : (st[i.name] || []).indexOf(i.value) > -1; }); mn.value = st.min; mx.value = st.max; apply();
    });
    var ft = $('#filters-toggle');
    if (ft) { ft.addEventListener('click', function () { f.classList.add('is-open'); $('#drawer-backdrop').classList.add('is-open'); document.body.classList.add('no-scroll'); $('.filters__close', f).focus(); }); $('.filters__close', f).addEventListener('click', closeFilters); }
    apply();
  }

  /* ---------- product page ---------- */
  function initProduct() {
    var root = $('#product'); if (!root) return;
    var P = new URLSearchParams(location.search), p = byId(P.get('id')) || bySlug(P.get('slug'));
    if (!p) { root.innerHTML = '<div class="empty" style="grid-column:1/-1"><h1 style="font-size:2rem">Product not found</h1><p>The fragrance you were looking for is not in our range.</p><a class="btn btn--outline" href="shop.html">Browse all fragrances</a></div>'; return; }
    var s = defSize(p), out = p.stock === 0, kind = p.type === 'attar' ? 'Attar Oil' : 'Extrait de Parfum', url = BRAND.url + 'product.html?id=' + p.id;
    document.title = p.name + ' ' + kind + ' | Classical Scents';
    var md = $('meta[name="description"]'); if (md) md.content = (p.description.split('. ')[0] + '. ' + p.family + ' notes of ' + p.keyNotes.join(', ') + '. From ' + fmt(fromPrice(p)) + ', delivered across Pakistan.').slice(0, 155);
    var cn = $('link[rel="canonical"]'); if (cn) cn.href = url; $$('meta[property="og:title"], meta[name="twitter:title"]').forEach(function (m) { m.content = p.name + ' | Classical Scents'; }); $$('meta[property="og:url"]').forEach(function (m) { m.content = url; });
    $('#crumb-current').textContent = p.name;
    var thumbs = [1, 2, 3].map(function (n) { return '<button type="button" data-img="' + n + '" aria-current="' + (n === 1) + '" aria-label="View image ' + n + '"><img src="' + thumbSrc(p, n) + '" width="80" height="80" alt="" loading="lazy" decoding="async"></button>'; }).join('');
    var tier = function (l, notes) { return '<div class="pyramid__tier"><small>' + l + '</small><span>' + esc(notes.join(' · ')) + '</span></div>'; };
    var revs = REVIEWS.filter(function (r) { return r.productId === p.id; });
    var related = PRODUCTS.filter(function (x) { return x.id !== p.id; }).sort(function (a, b) { return (b.family === p.family) - (a.family === p.family); }).slice(0, 4);
    root.setAttribute('data-id', p.id); root.setAttribute('data-ml', s.ml);
    root.innerHTML = '<div class="gallery"><div class="gallery__main">' + picture(p, 1, '', p.name + ' ' + kind.toLowerCase() + ' bottle', true) + '<div class="card__badges">' + badges(p) + '</div></div><div class="gallery__thumbs">' + thumbs + '</div></div>' +
      '<div class="pinfo"><p class="eyebrow">' + esc(p.family) + ' • ' + kind + '</p><h1>' + esc(p.name) + '</h1><p class="pinfo__fam">' + { men: 'For Men', women: 'For Women', unisex: 'Unisex' }[p.gender] + ' • ' + esc(COLLECTIONS.filter(function (c) { return c.slug === p.collection; })[0].name) + ' Collection</p>' +
      '<div style="margin-bottom:12px">' + stars(p.rating, p.reviewCount) + '</div><div data-price>' + priceHtml(s) + '</div><p class="muted" style="margin:12px 0 0">' + esc(p.description) + '</p>' +
      '<div class="pinfo__block"><p class="pinfo__label">Size <span>' + (p.type === 'attar' ? 'Oil roll-on' : 'Spray') + '</span></p>' + sizeChips(p, s) + '</div>' +
      '<div class="pinfo__block"><div class="buy"><div class="qty"><button type="button" data-qdec aria-label="Decrease quantity">−</button><input type="number" data-qty-input value="1" min="1" max="' + Math.max(1, p.stock) + '" aria-label="Quantity"' + (out ? ' disabled' : '') + '><button type="button" data-qinc aria-label="Increase quantity">+</button></div>' +
      (out ? '<button type="button" class="btn btn--gold" data-notify="' + p.id + '">Notify Me</button><button type="button" class="btn btn--outline" disabled>Sold Out</button>' : '<button type="button" class="btn btn--gold" id="add-main" data-add="' + p.id + '">Add to Cart</button><button type="button" class="btn btn--outline" id="buy-now">Buy Now</button>') +
      '</div><p class="stock-note' + (out ? ' is-out' : p.stock <= 12 ? ' is-low' : '') + '">' + (out ? 'Currently sold out. We restock every few weeks.' : p.stock <= 12 ? 'Only ' + p.stock + ' left in stock. Ships within 24 hours.' : 'In stock. Ships within 24 hours, cash on delivery available.') + '</p></div>' +
      '<div class="pinfo__block"><p class="pinfo__label">Notes pyramid</p><div class="pyramid">' + tier('Top', p.topNotes) + tier('Heart', p.heartNotes) + tier('Base', p.baseNotes) + '</div></div>' +
      '<div class="pinfo__block meters"><div><p class="pinfo__label">Longevity <span>' + p.longevity + '+ hours</span></p><div class="meter__track"><div class="meter__fill" data-w="' + Math.min(100, p.longevity / 18 * 100) + '"></div></div></div>' +
      '<div><p class="pinfo__label">Sillage <span>' + ['Intimate', 'Soft', 'Moderate', 'Strong', 'Enormous'][p.sillage - 1] + '</span></p><div class="meter__track"><div class="meter__fill" data-w="' + (p.sillage / 5 * 100) + '"></div></div></div></div>' +
      '<div class="pinfo__block pinfo-tabs" data-tabs><div class="tabs tabs--left" role="tablist"><button class="tab" role="tab" id="t-desc" aria-selected="true" aria-controls="p-desc">Description</button><button class="tab" role="tab" id="t-wear" aria-selected="false" aria-controls="p-wear" tabindex="-1">How to Wear</button><button class="tab" role="tab" id="t-ship" aria-selected="false" aria-controls="p-ship" tabindex="-1">Shipping &amp; Exchange</button></div>' +
      '<div role="tabpanel" id="p-desc" aria-labelledby="t-desc"><p>' + esc(p.description) + '</p><p>Concentration: ' + (p.type === 'attar' ? 'pure perfume oil, alcohol-free' : 'extrait de parfum, 30% fragrance oil') + '. Composed and bottled in Karachi, Pakistan.</p></div>' +
      '<div role="tabpanel" id="p-wear" aria-labelledby="t-wear" hidden><p>' + esc(p.howToWear) + '</p><p>Store away from sunlight and heat; a drawer beats a bathroom shelf.</p></div>' +
      '<div role="tabpanel" id="p-ship" aria-labelledby="t-ship" hidden><p>Nationwide delivery in 2 to 4 working days, free on orders above Rs. 5,000. Cash on delivery, JazzCash, Easypaisa and bank transfer accepted.</p><p>15-day exchange on unopened, sealed bottles. Opened fragrances cannot be returned for hygiene reasons.</p></div></div></div>' +
      '<div class="sticky-buy" id="sticky-buy"><div><div class="sticky-buy__name">' + esc(p.name) + '</div><div data-price>' + priceHtml(s) + '</div></div>' + (out ? '<button type="button" class="btn btn--gold btn--sm" data-notify="' + p.id + '">Notify Me</button>' : '<button type="button" class="btn btn--gold btn--sm" data-add="' + p.id + '">Add to Cart</button>') + '</div>';
    $('#reviews-root').innerHTML = '<div class="review-summary"><span class="big">' + p.rating + '</span><div>' + stars(p.rating) + '<p class="muted" style="margin:4px 0 0;font-size:.85rem">Based on ' + p.reviewCount + ' verified reviews</p></div></div>' +
      (revs.length ? '<div class="review-list">' + revs.map(function (r) { return '<article class="review">' + stars(r.rating) + '<blockquote>“' + esc(r.quote) + '”</blockquote><p class="review__who"><strong>' + esc(r.name) + '</strong>' + esc(r.city) + ' • Verified buyer</p></article>'; }).join('') + '</div>' : '<p class="muted">Be the first to write a review for ' + esc(p.name) + '.</p>');
    renderGrid($('#related'), related);
    initTabs(root);
    root.addEventListener('click', function (e) {
      var q = $('[data-qty-input]', root), b = e.target.closest('[data-img], [data-qinc], [data-qdec], #buy-now'); if (!b) return;
      if (b.hasAttribute('data-img')) { var gn = Number(b.getAttribute('data-img')), gi = $('.gallery__main img'), gs = $('.gallery__main source'); if (gs) gs.srcset = webpSrc(p, gn); gi.src = imgSrc(p, gn); gi.classList.toggle('is-photo', isPhoto(p, gn)); $$('[data-img]', root).forEach(function (x) { x.setAttribute('aria-current', x === b); }); }
      else if (b.hasAttribute('data-qinc')) q.value = Math.min(Number(q.max), Number(q.value) + 1);
      else if (b.hasAttribute('data-qdec')) q.value = Math.max(1, Number(q.value) - 1);
      else if (b.id === 'buy-now') { addToCart(p.id, root.getAttribute('data-ml'), Number(q.value) || 1); closeDrawer(); location.href = 'cart.html'; }
    });
    requestAnimationFrame(function () { $$('.meter__fill', root).forEach(function (m) { m.style.width = m.getAttribute('data-w') + '%'; }); });
    var sticky = $('#sticky-buy'), main = $('#add-main');
    if (main && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { sticky.classList.toggle('is-show', !en[0].isIntersecting && en[0].boundingClientRect.top < 0); document.body.classList.toggle('has-sticky', sticky.classList.contains('is-show')); }).observe(main);
    var ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify([{ '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: [1, 2, 3].map(function (n) { return BRAND.url + imgSrc(p, n); }), description: p.description, sku: 'CS-' + String(p.id).padStart(3, '0'), brand: { '@type': 'Brand', name: BRAND.name }, category: p.family + ' fragrance',
      offers: { '@type': 'AggregateOffer', priceCurrency: 'PKR', lowPrice: fromPrice(p), highPrice: Math.max.apply(null, p.sizes.map(function (x) { return x.price; })), offerCount: p.sizes.length, availability: 'https://schema.org/' + (out ? 'OutOfStock' : 'InStock'), url: url },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: BRAND.url }, { '@type': 'ListItem', position: 2, name: 'Shop', item: BRAND.url + 'shop.html' }, { '@type': 'ListItem', position: 3, name: p.name, item: url }] }]);
    document.head.appendChild(ld);
  }

  /* ---------- collections page ---------- */
  function initCollections() {
    $$('[data-collection-grid]').forEach(function (el) {
      var slug = el.getAttribute('data-collection-grid');
      if (slug === 'gift-sets') { el.className = 'bundles'; el.innerHTML = BUNDLES.map(bundleCard).join(''); }
      else renderGrid(el, PRODUCTS.filter(function (p) { return p.collection === slug; }));
    });
  }


  /* ---------- colour theme ---------- */
  function initTheme() {
    var root = document.documentElement, meta = $('meta[name="theme-color"]');
    function apply(t) {
      if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
      if (meta) meta.content = t === 'light' ? '#F6F1E8' : '#0B0B0B';
      $$('[data-theme-set]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === t); });
    }
    apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    $$('[data-theme-set]').forEach(function (b) {
      b.addEventListener('click', function () { var t = b.getAttribute('data-theme-set'); apply(t); store.set('cs_theme', t); });
    });
  }

  /* ---------- boot ---------- */
  document.documentElement.classList.remove('no-js');
  initTheme(); initHeader(); initTabs(document); initCountUp(); initForms();
  initHome(); initShop(); initProduct(); initCollections(); initReveal();
  renderCart(); updateCounts();
})();
