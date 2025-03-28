// Login page for the PatrolCam website
'use client';
import { useState } from 'react'; // importing React hooks
import { useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';  // handle page redirection
import Image from 'next/image';
import Link from 'next/link';


export default function Login() {
    // grab username and password entered
    const [user, setUser] = useState({
        email: (''),
        password: (''),
    });
    const router = useRouter();

    // used to style elements in certain conditions
    const emailElement = useRef(null);
    const passwordElement = useRef(null);

    // store username in state
    function handleEmail(e) {
        setUser({
            ...user,
            email: e.target.value,
        });
    }
    // store password in state
    function handlePassword(e) {
        setUser({
            ...user,
            password: e.target.value,
        });
    }
    
    // Submit request to the backend
    async function loginSubmission() {
        const email = user.email
        const password = user.password
        //add rememberMeBool and rememberMeValue
        console.log("login attempt with: ", email, password);
        

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false, // prevent automatic direction
        });

        if (res.error) {
            console.log("Invalid login"); // Display error message if failure to login
        } else {
            console.log("valid login");
            router.push("/dashboard"); // redirect user to dashboard if login is successful
        }

    };
//add rememberMeBool, rememberMeValue
        


    return (
        <div className="flex items-center justify-center h-screen">
            {/* Left section */}
            <div>
                <h1 className="font-bold text-[36px]">Welcome back!</h1>
                <p className="font-bold text-[18px]">Enter your credentials to access your account</p>

                {/* Email input */}
                <p className="font-bold mt-4">Email address</p>
                <input 
                    type="text" 
                    value={user.email}
                    ref = {emailElement}
                    onChange={handleEmail} 
                    placeholder="Enter your email"
                    className="pl-2 py-1 border-1 border-black rounded-md w-[100%]"
                />
                
                {/* Password input */}
                <div className="mt-4 mb-2">
                    <div className="flex justify-between mb-1">
                        <p className="font-bold">Password</p>
                        <p className="font-semibold text-blue-600">Forgot password?</p>
                    </div>
                    
                    <div>
                        <input 
                            type="password" 
                            value={user.password}
                            ref = {passwordElement}
                            onChange={handlePassword} 
                            placeholder="Enter your password"
                            className="pl-2 py-1 border-1 border-black rounded-md w-[100%]"
                        />
                    </div>
                </div>

                {/* remember me */}
                <div>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember"> Remember password</label>
                </div>

                {/* Submit */}
                <button type="submit" onClick={loginSubmission} className="text-white text-xl py-2 w-[100%] rounded-md bg-secondary mt-4 mb-4">Login</button>

                {/* Signup */}
                <div className="text-center text-lg">
                    <p>
                        Interested in our product <Link href="/#contact-us" className="underline text-blue-700">Sign up</Link>
                    </p>
                </div>
                
            </div>

            {/* Right section */}
            {/* Logo */}
            <div className="ml-10">
                <Image
                    src="/PatrolCamBlankLogo.png"
                    alt="PatrolCam logo"
                    width={500}
                    height={500}
                />
            </div>
    
        </div>
    );
}




// ideas 
// check if email is being stored correctly
// console.log(`username: ${user.email}`);
// if (!user.email) {
//     emailElement.current.style.border = "2px solid red";
// } else {
//     emailElement.current.style.border = "1px solid black";
// }

// // check if password is being stored correctly
// console.log(`password: ${user.password}`);
// if (!user.password) {
//     passwordElement.current.style.border = "2px solid red";
// } else {
//     passwordElement.current.style.border = "1px solid black";
// }