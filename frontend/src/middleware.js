import { NextResponse } from 'next/server';

const ROLES = {
    ADMIN: 'admin',
    BRANCH_MANAGER: 'branch_manager',
    COURIER: 'courier',
};

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const cookieHeader = req.headers.get('cookie') || '';

    // No session cookies at all - don't bother asking the backend.
    if (!req.cookies.get('token') && !req.cookies.get('refreshToken')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    let apiRes;
    try {
        apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/userData`, {
            headers: { cookie: cookieHeader },
        });
    } catch {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!apiRes.ok) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    const { user } = await apiRes.json();
    const role = user?.role;

    const deny = () => NextResponse.redirect(new URL('/', req.url));

    if (role !== ROLES.ADMIN) {
        if (pathname.startsWith('/admin')) return deny();
        if (pathname.startsWith('/panel/branch') && role !== ROLES.BRANCH_MANAGER) return deny();
        if (pathname.startsWith('/panel/courier') && role !== ROLES.COURIER) return deny();
        if (pathname.startsWith('/panel') && ![ROLES.BRANCH_MANAGER, ROLES.COURIER].includes(role)) return deny();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/panel/:path*'],
};
