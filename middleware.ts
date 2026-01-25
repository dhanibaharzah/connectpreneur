import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Check if it's the admin subdomain
  const isAdminSubdomain = hostname.startsWith('admin.')
  
  // Handle admin subdomain routing
  if (isAdminSubdomain) {
    // If at root of admin subdomain, rewrite to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin'
      return NextResponse.rewrite(url)
    }
    
    // If at /login on admin subdomain, rewrite to /admin/login
    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }
    
    // For all other paths on admin subdomain, prefix with /admin if not already
    if (
      !url.pathname.startsWith('/admin') && 
      !url.pathname.startsWith('/api') && 
      !url.pathname.startsWith('/_next')
    ) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  // Optional: Redirect /admin/* on main domain to admin subdomain
  // Uncomment the block below if you want to force users to use the subdomain
  /*
  if (!isAdminSubdomain && url.pathname.startsWith('/admin')) {
    const newPath = url.pathname.replace('/admin', '') || '/'
    const adminUrl = new URL(newPath, `https://admin.connectpreneur.id`)
    adminUrl.search = url.search
    return NextResponse.redirect(adminUrl)
  }
  */
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
