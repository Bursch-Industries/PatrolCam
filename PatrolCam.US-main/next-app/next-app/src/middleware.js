
import { getToken } from "next-auth/jwt"; // Extracts JWT token from session
import { NextResponse } from "next/server";

export async function middleware(req) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if user session does not exist
    if (!session) {
        console.log("No session", session);
        // if no session exists, redirect to login
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // session exists
    console.log("Session exists", session);
    return NextResponse.next(); // allow request to continue
}

export const config = {
    matcher: ["/dashboard/:path*"], // Apply middleware to these routes TODO: ADD protected routes for different roles
};

