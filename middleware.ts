import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/users(.*)',
  '/api/reports(.*)',
  '/api/tickets(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  // Redirect disabled Clerk account portal routes to custom pages
  if (req.nextUrl.pathname.startsWith('/user-profile')) {
    return NextResponse.redirect(new URL('/dashboard/settings', req.url))
  }
  
  if (req.nextUrl.pathname.startsWith('/user-button')) {
    return NextResponse.redirect(new URL('/dashboard/settings', req.url))
  }

  // If user is signed in and trying to access login page, redirect to dashboard
  if (userId && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user is not signed in and trying to access protected routes, redirect to login
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}