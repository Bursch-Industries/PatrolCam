'use client'; // Home / dashboard page for PatrolCam
import { useSession } from 'next-auth/react';





export default function DashboardPage() {
    const {data: session } = useSession();
    console.log("useSession Hook session object", session);

    return (
        <div className="base-background h-screen">
            <div className="flex justify-center gap-4">
                <h1 className="text-white text-4xl mt-4">Dashboard page {session?.user.name}</h1>
                <div className="flex justify-center items-center">
                    <p className="text-white text-2xl mt-4">Insert Home page design here</p> 
                </div>
            </div>
        </div>
    );
}




