import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/session'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public routes
  const isPublicRoute = path === '/login'
  
  // Get session
  const session = await getSession()

  // Redirect logic
  if (!session && !isPublicRoute && !path.startsWith('/api/') && !path.startsWith('/_next/')) {
    // If no session and trying to access a protected route (like /dashboard)
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (session && isPublicRoute) {
    // If logged in and trying to access login page
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }
  
  // If accessing root, redirect to dashboard if logged in, else login
  if (path === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    } else {
      return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
