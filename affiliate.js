(function() {
  var UK_TAG = 'scottrix-21';
  var US_TAG = 'scottrix-20';
  var STORES = {
    'en-GB': { domain: 'co.uk', tag: UK_TAG, cdn: 'images-eu.ssl-images-amazon.com' },
    'en-US': { domain: 'com', tag: US_TAG, cdn: 'images-na.ssl-images-amazon.com' },
    'en-CA': { domain: 'ca', tag: 'scottrix-20', cdn: 'images-na.ssl-images-amazon.com' },
    'en-AU': { domain: 'com.au', tag: 'scottrix-20', cdn: 'images-na.ssl-images-amazon.com' },
    'de':    { domain: 'de', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'fr':    { domain: 'fr', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'es':    { domain: 'es', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'it':    { domain: 'it', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'nl':    { domain: 'nl', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'ja':    { domain: 'co.jp', tag: 'scottrix-20', cdn: 'images-fe.ssl-images-amazon.com' },
    'sv':    { domain: 'se', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' },
    'pl':    { domain: 'pl', tag: 'scottrix04-21', cdn: 'images-eu.ssl-images-amazon.com' }
  };

  var DEFAULT = { domain: 'com', tag: US_TAG, cdn: 'images-na.ssl-images-amazon.com' };
  var FASTMAIL_RE = /join\.fastmail\.com/;

  function getLocale() {
    return navigator.language || navigator.userLanguage || 'en-US';
  }

  function getStore() {
    var locale = getLocale();
    if (STORES[locale]) return STORES[locale];
    var prefix = locale.split('-')[0];
    if (STORES[prefix]) return STORES[prefix];
    if (locale.indexOf('GB') !== -1 || locale.indexOf('UK') !== -1) return STORES['en-GB'];
    return DEFAULT;
  }

  function buildLink(asin) {
    var store = getStore();
    return 'https://www.amazon.' + store.domain + '/dp/' + asin + '?tag=' + store.tag;
  }

  function buildImageUrl(asin) {
    var store = getStore();
    return 'https://' + store.cdn + '/images/P/' + asin + '.01._SL160_.jpg';
  }

  function addProductImages() {
    var links = document.querySelectorAll('a[data-amazon-asin]');
    for (var i = 0; i < links.length; i++) {
      var card = links[i];
      if (card.querySelector('.affiliate-card-img')) continue;
      var asin = card.getAttribute('data-amazon-asin');
      if (!asin) continue;

      var imgDiv = document.createElement('div');
      imgDiv.className = 'affiliate-card-img';

      var img = document.createElement('img');
      img.alt = 'Product image';
      img.loading = 'lazy';
      img.src = buildImageUrl(asin);
      img.onerror = function() {
        this.parentNode.className = 'affiliate-card-img affiliate-card-img-fallback';
        this.removeAttribute('src');
      };

      imgDiv.appendChild(img);
      card.insertBefore(imgDiv, card.firstChild);
    }
  }

  function addFastmailIcons() {
    var cards = document.querySelectorAll('.affiliate-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (!FASTMAIL_RE.test(card.href)) continue;
      if (card.querySelector('.affiliate-card-icon')) continue;

      card.setAttribute('data-fastmail', '');

      var icon = document.createElement('div');
      icon.className = 'affiliate-card-icon';
      icon.textContent = '\u2709';
      card.insertBefore(icon, card.firstChild);

      var tm = document.createElement('div');
      tm.className = 'fastmail-trademark';
      tm.textContent = 'Fastmail\u00AE is a trademark of Fastmail Pty Ltd';
      card.appendChild(tm);
    }
  }

  function rewriteLinks() {
    var links = document.querySelectorAll('a[data-amazon-asin]');
    for (var i = 0; i < links.length; i++) {
      var asin = links[i].getAttribute('data-amazon-asin');
      if (asin) {
        links[i].setAttribute('href', buildLink(asin));
      }
    }
    var store = getStore();
    var badges = document.querySelectorAll('.affiliate-store-hint');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = store.domain;
    }
  }

  function init() {
    rewriteLinks();
    addProductImages();
    addFastmailIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
