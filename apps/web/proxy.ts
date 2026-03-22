import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/invite', '/api']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes and all API routes through
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token')

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}