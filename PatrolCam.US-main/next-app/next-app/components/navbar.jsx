// Navbar used throughout all of Patrol cam 
// 'use client'
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <>
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
                {/* login button */}
                <div className="flex bg-pcYellow text-black text-2xl font-bold mr-5 px-5 py-2 rounded-lg">
                    <Link href="">Login</Link>
                </div>
            </div>
        </>
    )
}