const BIO_SOURCES = {
  tk: 'tiktok',
  ig: 'instagram',
  wa: 'whatsapp',
};

function campaignForLuanda(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Africa/Luanda',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now);
  const year = parts.find((part) => part.type === 'year').value;
  const month = parts.find((part) => part.type === 'month').value;
  return `${year}_${month}`;
}

function bioRedirect(pathname) {
  const match = pathname.match(/^\/(tk|ig|wa)(?:\/([^/]*))?\/?$/);
  if (!match) return null;

  const [, platform, rawLabel] = match;
  const source = BIO_SOURCES[platform];
  const destination = new URL('https://dookia.app/');
  destination.searchParams.set('utm_source', source);
  destination.searchParams.set('utm_medium', 'bio');
  destination.searchParams.set('utm_campaign', campaignForLuanda());

  if (rawLabel !== undefined && rawLabel !== '') {
    let label = rawLabel;
    try {
      label = decodeURIComponent(rawLabel);
    } catch {
      // Keep the raw segment; invalid characters are removed below.
    }
    label = label.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    if (label) destination.searchParams.set('utm_content', label);
  }

  return Response.redirect(destination.toString(), 302);
}

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  const redirect = bioRedirect(pathname);
  if (redirect) return redirect;
  if (pathname !== '/' && pathname !== '/index.html') return context.next();

  const response = await context.next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  let html = await response.text();
  if (context.request.cf?.country === 'MZ') {
    html = html
      .replaceAll('1 999 Kz', '199 MZN')
      .replaceAll('3 150 Kz', '315 MZN');
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('cache-control', 'private, no-store');

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
