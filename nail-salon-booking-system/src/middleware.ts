import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your_secret_key_here');

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log("🌐 Middleware hit → Path:", req.nextUrl.pathname);
  console.log("🍪 Token from cookie:", token);

  if (!token) {
    console.log("❌ No token, redirecting...");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("✅ JWT verified:", payload);

    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

    if (isAdminRoute && payload.role !== 'admin') {
      console.log("❌ Not an admin — redirecting");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isDashboardRoute && payload.role !== 'customer') {
      console.log("❌ Not a customer — redirecting");
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("💥 JWT verification failed:", error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
