import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/config/dbConn";
import bcrypt from "bcryptjs";
import User from "@/lib/model/User";


export const authOptions = {
    session: {
        strategy: "jwt", // Uses JSON Web Token for session management
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB(); // Ensure DB is connected

                const { email, password } = credentials;
                const user = await User.findOne({ email });

                if (!user) throw new Error("User not found");

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) throw new Error("Invalid password");

                return {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    roles: user.roles
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.roles = user.roles;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.roles = token.roles;
            return session;
        },
    },
    pages: {
        signIn: "/login", // login page
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };