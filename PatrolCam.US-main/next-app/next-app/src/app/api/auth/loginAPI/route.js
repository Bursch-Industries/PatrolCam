// Handles 
import connectDB from "@/lib/config/dbConn";
import User from "@/lib/model/User";



export async function POST(req) {
    try {
        const { email, password } = await req.json();
        connectDB();

        
        return Response.json({ message: "Login successful" }, {status: 200})
    } catch (error) {
        
        return Response.json({ message: "Login failed" }, {status: 400});
    }
}







