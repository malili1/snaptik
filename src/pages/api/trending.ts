// @ts-ignore
export const runtime = 'edge';

export default async function handler(request: Request) {
  try {
    // Get region from query params, default to ID (Indonesia)
    const url = new URL(request.url);
    const region = url.searchParams.get('region') || 'ID';
    
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
      'Vary': 'region', // Different cache per region
    };
    
    // TikTok API with region parameter
    const tiktokUrl = `https://www.tiktok.com/node/share/discover?region=${region}`;
    
    const res = await fetch(tiktokUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/'
      },
    });
    
    if (!res.ok) {
      return new Response(JSON.stringify({ data: null }), { status: 200, headers });
    }
    
    const json = await res.json();
    return new Response(JSON.stringify({ data: json?.body || null }), { status: 200, headers });
  } catch (e) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    return new Response(JSON.stringify({ data: null }), { status: 200, headers });
  }
}
