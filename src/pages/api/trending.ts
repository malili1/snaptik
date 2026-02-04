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
      },
    });
    
    if (!response.ok) {
      throw new Error(`TikTok API returned ${response.status}`);
    }
    
    const json = await response.json();
    return new Response(
      JSON.stringify({ data: json?.body || null }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Trending API Error:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : 'Failed to fetch';
    return new Response(
      JSON.stringify({ data: null, error: errorMessage }),
      {
        status: 200, // Return 200 to avoid breaking the frontend
        headers,
      }
    );
  }
}
