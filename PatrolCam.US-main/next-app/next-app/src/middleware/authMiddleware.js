import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Redirect to login if not authenticated
    },
});

export const config = {
    matcher: ["/dashboard/:path*"], // Protect dashboard and its subroutes
}