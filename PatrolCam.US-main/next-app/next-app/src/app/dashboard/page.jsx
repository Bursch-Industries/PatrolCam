'use client'; // Home / dashboard page for PatrolCam
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';





export default function DashboardPage() {
    const {data: session } = useSession();
    console.log("useSession Hook session object", session);

    return (
        
        <div className="base-background h-screen">
            <div className="flex justify-center gap-4">
                {session && <h1 className="text-white text-4xl mt-4">Dashboard page {session?.user.name}</h1>}
                    <button className="bg-pcYellow text-black text-lg font-bold  px-4 py-2 mt-4 rounded-lg"
                            onClick={() => {signOut()}}
                    >
                        Logout Test
                    </button>
            </div>
        </div>
        
    );
}




