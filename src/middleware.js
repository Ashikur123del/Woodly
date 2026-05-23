import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
  const { pathname } = request.nextUrl;

  // 🛡️ নেক্সট জেএস-এর নিজস্ব রেন্ডারিং অ্যাসেট এবং স্ট্যাটিক ফাইলসকে বাইপাস করা
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 🔒 প্রোটেকশন লজিক: লগইন না থাকলে ড্যাশবোর্ডে ঢুকতে দেবে না
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔓 রিডাইরেকশন লজিক: অলরেডি লগইন থাকলে লগইন পেজে যেতে দেবে না
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * নিচের ফাইলগুলো বাদে সব রাউটে মিডলওয়্যার এক্সিকিউট হবে:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};