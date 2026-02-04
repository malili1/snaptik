export const runtime = 'edge';

import type { NextRequest } from 'next/server';

// Edge Runtime menggunakan Request & Response standar
export default async function handler(req: Request) {
  // === 1. Handle CORS ===
  const allowedOrigin = process.env.NEXT_PUBLIC_DOMAIN || '*';

  if (req.method === 'OPTIONS') {
    // Preflight request
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

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

  // === 2. Fetch data dari TikTok ===
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

  // === 3. Return response dengan CORS ===
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    },
  });
}
