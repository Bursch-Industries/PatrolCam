// Login page for the PatrolCam website
'use client';
import { useState } from 'react'; // importing React hooks
import { Router } from 'next/router';  // handle page redirection
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    // Toggle Password Visibility

    // Load saved password if "Remember Me" is checked

    // Form Submission Handling

        // prevent the default form submission

        // get the values from the input fields

        // Check for empty fields

        // Allow the user to log in with no password value if they have been remembered in the browser local storage

        // Send login request

            // Display the server error messages

        // Check if response header contains JSON

            // Handle "Remember Me" functionality

        // Redirect to dashboard on successful login
        // success

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
                    name="username" 
                    id="loginEmail" 
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
                            name="password" 
                            id="password" 
                            placeholder="Enter your password"
                            className="pl-2 py-1 border-1 border-black rounded-md w-[100%]"
                        />
                    </div>
                </div>

                {/* remember me */}
                <div>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember password</label>
                </div>

                {/* Submit */}
                <button type="submit" className="text-white text-xl py-2 w-[100%] rounded-md bg-secondary mt-4 mb-4">Login</button>

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
