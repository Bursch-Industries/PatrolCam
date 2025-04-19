// Navbar used throughout all of Patrol cam 
'use client'
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@radix-ui/react-dropdown-menu';
import { SettingsIcon, LogOutIcon, CircleHelpIcon } from 'lucide-react';
import { useEffect } from 'react';

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
                <div className="flex bg-pcYellow text-black text-2xl font-bold mr-5 px-5 py-2 rounded-lg cursor-pointer hover:bg-yellow-400">
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



function UserNavbar() {
    const {data: session} = useSession();
    // grab the first letter of the users first name
    const userLetter = session.user.name[0];
    const userName = session.user.name;
    const userImage = null; // TODO: change once user is allowed to upload image to db
    
    return(
        
            <div className="bg-primary text-white flex justify-around items-center opacity-90 shadow-xl h-22 w-full z-[1000] relative">
                {/* Logo */}
                <div className="flex items-center ml-8">
                    <Link href="/dashboard">
                        <Image 
                            src="/PatrolCamLogo.png" 
                            alt="PatrolCam Logo" 
                            width={130}
                            height={130} 
                    />
                    </Link>
                </div>

                {/* navagation links */}
                <nav className="flex items-end gap-12 self-end mb-4 mr-4 text-xl">
                    <Link href="/dashboard" className="py-1 px-4 hover:text-black hover:bg-pcYellow hover:py-1 hover:px-4 hover:rounded-4xl">Dashboard</Link>
                    <Link href="/dashboard/audioAI" className="py-1 px-4 hover:text-black hover:bg-pcYellow hover:py-1 hover:px-4 hover:rounded-4xl">Audio.Ai</Link>
                    <Link href="/dashboard/surveillance" className="py-1 px-4 hover:text-black hover:bg-pcYellow hover:py-1 hover:px-4 hover:rounded-4xl">Surveillance</Link>
                    <Link href="/dashboard/streamArchive" className="py-1 px-4 hover:text-black hover:bg-pcYellow hover:py-1 hover:px-4 hover:rounded-4xl">Archive</Link>
                    <Link href="/dashboard/myOrg" className="py-1 px-4 hover:text-black hover:bg-pcYellow hover:py-1 hover:px-4 hover:rounded-4xl">MyOrg</Link>
                </nav>

                {/* Profile icon & modal */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="bg-gray-300 text-black text-2xl p-6 shadow-lg hover:cursor-pointer">
                            <AvatarImage src={userImage} alt="userImage" />
                            <AvatarFallback>{userLetter}</AvatarFallback>
                        </Avatar>
                    </ DropdownMenuTrigger>
                    <DropdownMenuContent variant="outline" className="bg-gray-100 p-5 rounded-md text-black mt-2 shadow-lg">
                        <DropdownMenuGroup className="flex flex-col items-center gap-1 mb-2">
                            <DropdownMenuItem>
                                {session.user.email}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Avatar className="bg-gray-300 text-black text-2xl p-6 shadow-lg">
                                    <AvatarImage src={userImage} alt="userImage" />
                                    <AvatarFallback>{userLetter}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Hi, <span className="font-semibold">{userName}</span>!
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="border-1 border-gray-300 shadow-lg" />
                        <DropdownMenuGroup className="flex flex-col gap-4 mt-2">
                            <DropdownMenuItem className="flex gap-2 py-2 px-4 rounded-md hover:py-2 hover:px-4 hover:rounded-md hover:border-2 hover:border-black">
                               <SettingsIcon /> 
                               <Link href="/dashboard/myOrg">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 py-2 px-4 rounded-md hover:py-2 hover:px-4 hover:rounded-md hover:border-2 hover:border-black">
                                <CircleHelpIcon />
                                Support
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2 py-2 px-4 rounded-md hover:py-2 hover:px-4 hover:rounded-md hover:border-2 hover:border-black">
                                <LogOutIcon /> 
                                <button className="hover:cursor-pointer" onClick={() => {signOut()}}>Log Out</button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup> 
                    </DropdownMenuContent>
                </ DropdownMenu>
            </div>
    
    );
}
