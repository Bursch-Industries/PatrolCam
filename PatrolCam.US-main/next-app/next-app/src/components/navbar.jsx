// Navbar used throughout all of Patrol cam 
'use client'
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

// Navbar if user session exists  ***Things that could be added: changes based on role, styling ***
function UserNavbar() {
    return(
        <>
            <div className="bg-primary text-white flex items-center justify-between opacity-90 h-24">
                {/* Logo */}
                <div className="flex ml-5">
                    <Link href="/dashboard">
                        <Image 
                            src="/PatrolCamLogo.png" 
                            alt="PatrolCam Logo" 
                            width={150}
                            height={150} 
                    />
                    </Link>
                </div>
                {/* navagation links */}
                <nav className="flex bg-black rounded-lg ">
                    <Link href="/dashboard" className="nav-button">Home</Link>
                    <Link href="/dashboard/audioAI" className="nav-button">audioAI</Link>
                    <Link href="/dashboard/surveillance" className="nav-button">surveillance</Link>
                    <Link href="/dashboard/myOrg" className="nav-button">Settings</Link>
                </nav>
                {/* logout button */}
                <div>
                    <button className="bg-pcYellow text-black text-lg font-bold  px-4 py-2 mt-4 rounded-lg" onClick={() => {signOut()}}>
                        Logout Test
                    </button>
                </div>
            </div>
        </>
    );
}


function GuestNavbar() {
        return(
            <div className="bg-primary text-white flex items-center justify-between opacity-90 h-24">
                {/* Logo */}
                <div className="flex ml-5">
                    <Link href="/">
                        <Image 
                        src="/PatrolCamLogo.png" 
                        alt="PatrolCam Logo" 
                        width={150}
                        height={150} 
                        />
                    </Link>
                </div>
                {/* navagation links */}
                <nav className="flex bg-black rounded-lg ">
                    <Link href="/#features" className="nav-button">Features</Link>
                    <Link href="/demo" className="nav-button">Demo</Link>
                    <Link href="/#contact-us" className="nav-button">Contact Us</Link>
                </nav>
                {/* login button or logout button depending on session */}
                <div className="flex bg-pcYellow text-black text-2xl font-bold mr-5 px-5 py-2 rounded-lg">
                    <Link href="/login">Login</Link>
                </div>
            </div>
        );
    }



// export conditional logic for both navbars
export default function Navbar() {
    const { data: session } = useSession(); 
    // check if session exists: if so return users navbar / else return guest navbar
    return session ? <UserNavbar /> : <GuestNavbar />;
}