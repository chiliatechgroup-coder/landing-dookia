export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (pathname !== '/' && pathname !== '/index.html') return context.next();

  const response = await context.next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  let html = await response.text();
  if (context.request.cf?.country === 'MZ') {
    html = html
      .replaceAll('1 999 Kz', '199 MZN')
      .replaceAll('3 150 Kz', '315 MZN')
      .replaceAll('utm_content=mini_ao&amp;market=AO', 'utm_content=mini_mz&amp;market=MZ')
      .replaceAll('utm_content=max_ao&amp;market=AO', 'utm_content=max_mz&amp;market=MZ');
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
