import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  const url = request.nextUrl.clone();

  // Allow access to the login page and public assets
  if (
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token using jose
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Token is valid, allow access
    console.log('Token verified');
    return NextResponse.next();
  } catch (error) {
    console.log('Token verification failed:', error);
    // Invalid token, redirect to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: '/((?!api|login|_next/static|_next/image|favicon.ico).*)',
};
