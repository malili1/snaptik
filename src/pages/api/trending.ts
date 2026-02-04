export const runtime = 'edge';

// Edge Runtime menggunakan Request & Response standar
export default async function handler(req: Request) {
  const allowedOrigin = process.env.NEXT_PUBLIC_DOMAIN || '*';

  // === 1. Handle CORS Preflight ===
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // === 2. Batasi hanya GET request ===
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
      },
    });
  }

  // === 3. Fetch data dari TikTok ===
  let data: any = null;

  try {
    const response = await fetch('https://www.tiktok.com/node/share/discover', {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TikTok request failed with status ${response.status}`);
    }

    const json = await response.json();
    data = json?.body || null;
  } catch (error) {
    console.error('Error fetching trending data:', error);
    data = null;
  }

  // === 4. Return response dengan CORS ===
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    },
  });
}
