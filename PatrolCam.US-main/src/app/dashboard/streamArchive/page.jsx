// Page for users to download parts of previous live surveillance streams
'use client';

export default function StreamArchive() {
    // grab the archived streams from streamArchives API
    // find a way to display a list of formatted archived streams
    // allow for users to download this archived stream on the website or view a limited amount through the browser ?
   
    
    // retrieve video files from the backend api call

    return (
        <div className="base-background min-h-screen">
            <h1 className="py-4 text-white text-4xl text-center"> Stream Archives </h1>
            <div className="flex justify-center text-white text-lg">
                <p> Stored live surveillance data from {bucket}</p>
                <ul>

                </ul>
            </div>
        </div>
    )
}
