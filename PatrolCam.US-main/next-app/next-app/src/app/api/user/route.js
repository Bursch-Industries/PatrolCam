import { getServerSession } from "next-auth"; // Retrieves session on server
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/lib/config/dbConn"; 
import User from "@/lib/model/User";

export async function GET(req) {
    await connectDB(); // Ensure database connection
    const session = await getServerSession(authOptions); // Get user session

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Return error if not authenticated
    }

    const user = await User.findById(session.user.id); // Fetch user from DB
    return NextResponse.json({ user }); // Return user data
}