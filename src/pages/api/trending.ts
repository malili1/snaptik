// @ts-ignore
export const runtime = 'edge';

export default async function handler(request: Request) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const res = await fetch('https://www.tiktok.com/node/share/discover', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    
    if (!res.ok) {
      return new Response(JSON.stringify({ data: null }), { status: 200, headers });
    }
    
    const json = await res.json();
    return new Response(JSON.stringify({ data: json?.body || null }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ data: null }), { status: 200, headers });
  }
}
