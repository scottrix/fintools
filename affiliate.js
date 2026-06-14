(function() {
  var UK_TAG = 'scottrix-21';
  var US_TAG = 'scottrix-20';
  var STORES = {
    'en-GB': { domain: 'co.uk', tag: UK_TAG },
    'en-US': { domain: 'com', tag: US_TAG },
    'en-CA': { domain: 'ca', tag: 'scottrix-20' },
    'en-AU': { domain: 'com.au', tag: 'scottrix-20' },
    'de':    { domain: 'de', tag: 'scottrix04-21' },
    'fr':    { domain: 'fr', tag: 'scottrix04-21' },
    'es':    { domain: 'es', tag: 'scottrix04-21' },
    'it':    { domain: 'it', tag: 'scottrix04-21' },
    'nl':    { domain: 'nl', tag: 'scottrix04-21' },
    'ja':    { domain: 'co.jp', tag: 'scottrix-20' },
    'sv':    { domain: 'se', tag: 'scottrix04-21' },
    'pl':    { domain: 'pl', tag: 'scottrix04-21' }
  };

  var DEFAULT = { domain: 'com', tag: US_TAG };
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

  function buildSearchUrl(term) {
    var store = getStore();
    var query = encodeURIComponent(term);
    return 'https://www.amazon.' + store.domain + '/s?k=' + query + '&tag=' + store.tag;
  }

  function addFastmailIcons() {
    var cards = document.querySelectorAll('.affiliate-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (!FASTMAIL_RE.test(card.href)) continue;
      if (card.querySelector('.affiliate-card-icon')) continue;

      card.setAttribute('data-fastmail', '');

      var icon = document.createElement('img');
      icon.className = 'affiliate-card-icon';
      icon.src = 'fastmail_icon.svg';
      icon.alt = 'Fastmail';
      icon.style.width = '32px';
      icon.style.height = '32px';
      card.insertBefore(icon, card.firstChild);

      var tm = document.createElement('div');
      tm.className = 'fastmail-trademark';
      tm.textContent = 'Fastmail\u00AE is a trademark of Fastmail Pty Ltd';
      card.appendChild(tm);
    }
  }

  function rewriteLinks() {
    var links = document.querySelectorAll('a[data-amazon-search]');
    for (var i = 0; i < links.length; i++) {
      var term = links[i].getAttribute('data-amazon-search');
      if (term) {
        links[i].setAttribute('href', buildSearchUrl(term));
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
    addFastmailIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
