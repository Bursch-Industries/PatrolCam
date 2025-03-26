// import { UserLogin, UserLogout } from "@/lib/controllers/loginController";


export async function POST(req) {
    try {
        const { email, password } = await req.json();
        
        return Response.json({ message: "Login successful" }, {status: 200})
    } catch (error) {
        
        return Response.json({ message: "Login failed" }, {status: 400});
    }
}







