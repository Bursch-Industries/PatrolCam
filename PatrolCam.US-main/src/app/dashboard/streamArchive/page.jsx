// Page for users to download parts of previous live surveillance streams
'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function StreamArchive() {
    const [videoFiles, setVideoFiles] = useState([]); 
   
    
    // retrieve video files from the backend api call upon page load
    useEffect (() => {
        const fetchVideoFiles = async () => {
            const res = await fetch('/api/streamDownloadAPI');
            const data = await res.json();
            console.log(data); 
            setVideoFiles(data.videoFiles); // store video files in state
        };

        fetchVideoFiles(); // call fetch video files
    }, []); // <-- empty dependency array = run once on mount ( this is just a test for now) 

    return (
        <div className="base-background min-h-screen">
            <h1 className="py-4 text-white text-4xl text-center"> Stream Archives </h1>
            <div className="flex justify-center text-white text-lg">
                <p> Stored live surveillance data from </p>
                <ul>

                </ul>
            </div>
        </div>
    )
}
