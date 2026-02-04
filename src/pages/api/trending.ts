export const runtime = 'edge';

export default async function handler(req: Request) {
  try {
    const response = await fetch('https://www.tiktok.com/node/share/discover');
    const json = await response.json();
    return new Response(
      JSON.stringify({ data: json?.body }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : 'Failed to fetch';
    return new Response(
      JSON.stringify({ data: null, error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
