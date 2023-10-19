import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UAParser } from 'ua-parser-js';

export function middleware(req: NextRequest) {
    const ua = new UAParser(req.headers.get('user-agent')!);
    const base = req.nextUrl.origin

    if (ua.getDevice().type && req.nextUrl.pathname !== '/mobile') {
        return NextResponse.redirect(new URL('/mobile', base))
    }
    if (!ua.getDevice().type && req.nextUrl.pathname === '/mobile') {
        return NextResponse.redirect(new URL('/', base))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}