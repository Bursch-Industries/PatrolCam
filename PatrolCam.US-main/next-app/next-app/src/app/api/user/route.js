import { getServerSession } from "next-auth"; // Retrieves session on server
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/lib/config/dbConn"; 
import User from "@/lib/model/User";
import { MongoClient, ObjectId } from "mongodb";

export async function GET() {
    await connectDB(); // Ensure database connection
    const session = await getServerSession(authOptions); // Get user session
export async function GET() {
    // Check if the user is authenticated
  const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Return error if not authenticated
    }

  const client = new MongoClient(process.env.MONGODB_DATABASE_URL);

  try {
    await client.connect();
    const db = client.db("PatrolCam");
    const collection = db.collection("users");
    // Check if the user exists in the database
    const userExists = await collection.findOne({ _id: new ObjectId(session.user.id) });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await User.findById(session.user.id); // Fetch user from DB
    
}
    
    const UserData = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    });
    if (!UserData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(UserData);

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
