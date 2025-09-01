import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Create response that clears all Clerk-related cookies
    const response = NextResponse.json({ success: true });
    
    // Clear all possible Clerk session cookies
    const cookiesToClear = [
      '__session',
      '__clerk_db_jwt',
      '__clerk_handshake',
      '__clerk_client_uat',
      '__clerk_refresh_token',
      '__clerk_session',
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}
