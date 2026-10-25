(function () {
  try {
    var cookieName = 'dk_src';
    var existingCookie = document.cookie.split(';').map(function (cookie) {
      return cookie.trim();
    }).find(function (cookie) {
      return cookie.startsWith(cookieName + '=');
    });

    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
    var utms = {};
    var hasUtm = false;

    keys.forEach(function (key) {
      var value = params.get(key);
      if (value !== null && value.trim() !== '') hasUtm = true;
      utms[key] = (value || '').trim().toLowerCase().slice(0, 100);
    });

    if (existingCookie) {
      var existingSource = '';
      try {
        var existingValue = existingCookie.slice(cookieName.length + 1);
        var existingData = JSON.parse(decodeURIComponent(existingValue));
        existingSource = typeof existingData.utm_source === 'string'
          ? existingData.utm_source.toLowerCase()
          : '';
      } catch (_) {
        return;
      }

      if (existingSource !== 'direct' && existingSource !== '(referral)') return;
      if (!hasUtm) return;
    }

    var ref = '';
    if (document.referrer) {
      try {
        ref = new URL(document.referrer).hostname.toLowerCase().slice(0, 100);
      } catch (_) {
        ref = '';
      }
    }

    var isDookiaHost = window.location.hostname === 'dookia.app' || window.location.hostname.endsWith('.dookia.app');
    var isExternalRef = Boolean(ref) && ref !== 'dookia.app' && !ref.endsWith('.dookia.app');
    var attribution = {
      utm_source: hasUtm ? utms.utm_source : (isExternalRef ? '(referral)' : 'direct'),
      utm_medium: hasUtm ? utms.utm_medium : '',
      utm_campaign: hasUtm ? utms.utm_campaign : '',
      utm_content: hasUtm ? utms.utm_content : '',
      ref: ref,
      ts: new Date().toISOString()
    };

    var cookie = cookieName + '=' + encodeURIComponent(JSON.stringify(attribution)) + '; path=/; max-age=2592000; SameSite=Lax';
    if (isDookiaHost) cookie += '; domain=.dookia.app';
    if (window.location.protocol === 'https:') cookie += '; Secure';
    document.cookie = cookie;
  } catch (_) {
    // Attribution must never interfere with page rendering.
  }
})();
