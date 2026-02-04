import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('https://www.tiktok.com/node/share/discover');
    
    if (!response.ok) {
      return res.status(200).json({ data: null });
    }
    
    const json = await response.json();
    
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json({ data: json?.body || null });
  } catch (error) {
    return res.status(200).json({ data: null });
  }
}
