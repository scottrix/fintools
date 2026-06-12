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

  function getLocale() {
    var lang = navigator.language || navigator.userLanguage || 'en-US';
    return lang;
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
      badges[i].textContent = 'Amazon.' + store.domain;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewriteLinks);
  } else {
    rewriteLinks();
  }
})();
