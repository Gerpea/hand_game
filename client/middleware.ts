import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UAParser } from 'ua-parser-js';
import { pick } from 'accept-language-parser'
import { defaultLocale, locales } from '@/locales';

export function middleware(req: NextRequest) {
    const ua = new UAParser(req.headers.get('user-agent')!);
    const base = req.nextUrl.origin

    const acceptLanguageHeader = req.headers.get('accept-language')
    const preferedLanguage = pick(locales, acceptLanguageHeader || defaultLocale)!

    if (ua.getDevice().type && req.nextUrl.pathname !== '/mobile') {
        return NextResponse.redirect(new URL('/mobile', base), {
            headers: {
                'lang': preferedLanguage
            }
        })
    }
    if (!ua.getDevice().type && req.nextUrl.pathname === '/mobile') {
        return NextResponse.redirect(new URL('/', base), {
            headers: {
                'lang': preferedLanguage
            }
        })
    }

    return NextResponse.next({
        headers: {
            'lang': preferedLanguage
        }
    })
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',],
}