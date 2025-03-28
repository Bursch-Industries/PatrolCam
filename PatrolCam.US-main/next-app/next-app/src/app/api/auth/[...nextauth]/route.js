import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/config/dbConn"; // import function to connect to the database
import bcrypt from "bcryptjs"; 
import User from "@/lib/model/User";

// Authentication options configuration
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB(); // Ensure the database is connected before querying

                // Find user in the database by email
                const user = await User.findOne({ email: credentials.email });
                if (!user) throw new Error("User not found");

                // Compare the provided password with the stored hashed password
                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) throw new Error("Invalid credentials");
                
                // Return user object containing relevant details
                console.log("valid credentials", isValidPassword);
                
                return {id: user._id,  email: user.email, name: user.firstname, role: user.roles };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Attach wanted user session info to JWT token
            if (user) {
                token.sub = user.id;
                token.role  = user.role;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach wanted user session info to object
            if (token.sub){
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.name = token.name;
            }
            
            console.log(session.user ? session.user.id : "no id", session.user ? session.user.role : "no role", session.user ? session.user.name : "no name");
            return session;
        },
    },
    pages: {
        signIn: "/login", // Redirect users to login page
    },
    session: {
        strategy: "jwt", // Use JSON Web Tokens for session handling
    },
    secret: process.env.NEXTAUTH_SECRET, // Secret key for NextAuth encryption
};

// Authentication handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Export handler for GET and POST requests