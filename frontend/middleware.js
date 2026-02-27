import { NextResponse } from 'next/server';

export function middleware(req) {
    const role = req.cookies.get('role')?.value;
    const { pathname } = req.nextUrl;

    if (!role) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/panel/branch_manager') && role !== 'branch_manager') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith('/panel/courier') && role !== 'courier') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/panel/branch_manager/:path*', '/panel/courier/:path*'],
};
