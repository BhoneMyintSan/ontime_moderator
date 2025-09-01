import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/users(.*)',
  '/api/reports(.*)',
  '/api/tickets(.*)',
  '/api/refunds(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Redirect disabled Clerk account portal routes to custom pages
  if (req.nextUrl.pathname.startsWith('/user-profile')) {
    return Response.redirect(new URL('/dashboard/settings', req.url))
  }
  
  if (req.nextUrl.pathname.startsWith('/user-button')) {
    return Response.redirect(new URL('/dashboard/settings', req.url))
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