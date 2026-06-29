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

  function addShareSection() {
    if (document.querySelector('.share-section')) return;
    var main = document.querySelector('main');
    if (!main) return;
    var section = document.createElement('section');
    section.className = 'section share-section';
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);
    section.innerHTML = '<h2>Share this page</h2><div class="share-buttons">' +
      '<a class="share-btn share-twitter" href="https://twitter.com/intent/tweet?url=' + url + '&text=' + title + '" target="_blank" rel="noopener">Twitter</a>' +
      '<a class="share-btn share-facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + url + '" target="_blank" rel="noopener">Facebook</a>' +
      '<a class="share-btn share-linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=' + url + '" target="_blank" rel="noopener">LinkedIn</a>' +
      '<a class="share-btn share-whatsapp" href="https://wa.me/?text=' + title + '%20' + url + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a class="share-btn share-copy" href="#" data-url="' + window.location.href + '">Copy Link</a>' +
      '</div>';
    main.appendChild(section);
    section.querySelector('.share-copy').addEventListener('click', function(e) {
      e.preventDefault();
      var btn = this;
      navigator.clipboard.writeText(btn.getAttribute('data-url')).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = 'Copy Link'; }, 2000);
      });
    });
  }

  function init() {
    rewriteLinks();
    addFastmailIcons();
    addShareSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
