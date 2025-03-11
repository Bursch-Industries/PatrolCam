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
                    <Link href="/#features" className="flex justify-center text-xl py-3 px-5  w-50 rounded-md hover:bg-[#333]">Features</Link>
                    <Link href="/demo" className="flex justify-center text-xl py-3 px-5 w-50  rounded-md hover:bg-[#333]">Demo</Link>
                    <Link href="/#contact-us" className="flex justify-center text-xl py-3 px-5 w-50  rounded-md hover:bg-[#333]">Contact Us</Link>
                </nav>
                {/* login button */}
                <div className="flex bg-pcYellow text-black text-2xl mr-5 px-5 py-2 rounded-lg">
                    <Link href="">Login</Link>
                </div>
            </div>
        </>
    )
}