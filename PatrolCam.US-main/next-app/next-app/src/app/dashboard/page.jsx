'use client'; // Home / dashboard page for PatrolCam
import { useState } from 'react'; // importing React hooks
import { useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';  // handle page redirection



export default function DashboardPage() {
    
    return (
        <div className="base-background h-screen">
            <div className="flex justify-center gap-4">
                <h1 className="text-white text-4xl mt-4">Dashboard page</h1>
                    <button className="bg-pcYellow text-black text-lg font-bold  px-4 py-2 mt-4 rounded-lg"
                            onClick={() => {signOut()}}
                    >
                        Logout Test
                    </button>
            </div>
        </div>
    );
}



