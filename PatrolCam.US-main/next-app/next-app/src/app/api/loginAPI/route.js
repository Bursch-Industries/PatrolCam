import { connectMongoDB } from "@/lib/config/dbConn";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connectMongoDB();

        return Response.json({ message: "Login successful" }, {status: 200})
    } catch (error) {
        return Response.json({ message: "Login failed" }, {status: 400});
    }
}







