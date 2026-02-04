export const runtime = 'edge';

export default async function handler() {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const response = await fetch('https://www.tiktok.com/node/share/discover');
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ data: null }),
        { status: 200, headers }
      );
    }
    
    const json = await response.json();
    return new Response(
      JSON.stringify({ data: json?.body || null }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ data: null }),
      { status: 200, headers }
    );
  }
}
