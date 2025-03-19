// routing for login and logout api
import { userLogin, userLogout } from "@/lib/controllers/loginController"; 

export default async function LoginHandler(req, res) {
    if (req.method === 'POST') {
        try {
            const result = await userLogin(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json( {error: error.message} );
        }
    } else {
        res.status(405).json( { message: 'Method not allowed' } )
    }
}






