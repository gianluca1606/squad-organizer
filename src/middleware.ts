import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
    '/',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
    '/cookies',
    '/contact',
    '/sign-in*',
    '/sign-up*',
];

const isPublic = (path: string) => {
    return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/|\\.)'))));
};

export default withClerkMiddleware((request: NextRequest) => {
    const { userId } = getAuth(request);
    //onsole.log(getAuth(request).user);
    if (userId && request.nextUrl.pathname === '/') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }
    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    // if the user is not signed in redirect them to the sign in page.

    if (!userId) {
        // redirect the users to /pages/sign-in/[[...index]].ts
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next
         * - static (static files)
         * - favicon.ico (favicon file)
         */
        '/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)',
        '/',
    ],
};
