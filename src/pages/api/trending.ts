export const runtime = 'edge';

export default async function handler(req: Request) {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const response = await fetch('https://www.tiktok.com/node/share/discover', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tiktok.com/',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ data: null, error: `API returned ${response.status}` }),
        { status: 200, headers }
      );
    }
    
    const json = await response.json();
    return new Response(
      JSON.stringify({ data: json?.body || null }),
      { status: 200, headers }
    );
  } catch (error) {
    // Return empty data on error instead of throwing
    return new Response(
      JSON.stringify({ data: null, error: 'Failed to fetch trending data' }),
      { status: 200, headers }
    );
  }
}
