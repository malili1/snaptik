import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Just pass through all requests
  return NextResponse.next();
}

// Disable middleware by using a very specific matcher that won't match anything
export const config = {
  matcher: [],
};
