// AudioAI page for PatrolCam
'use client';

import { useState } from "react";

export default function AudioAI(){
    // const [selectedFile, setSelectedFile] = useState(null); // state to store and change audio file
    const [fileData, setFileData] = useState({
        fileName: (''),
        audioTranscription: (''),
        selectedFile: null,
    });

    const fileName = fileData.fileName;
    const audioTranscription = fileData.audioTranscription;

    // function for api request using chosen file
    async function AudioUpload() {
        

        try {
            const formData = new FormData();
            formData.set('audioFile', fileData.selectedFile);
            const res = await fetch('/api/auth/audioAPI', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to process audio");

            const result = await res.json();
            const textResponse = JSON.stringify(result, null, 2);
            console.log(textResponse);
            
        } catch (error) {
            console.log('Error: ', error);
        }

        console.log(`${fileName} is being uploaded for audio transcription!`)
    }

    // used to set and store selected audio file in state
    function HandleFile(e) {
        // logic for handling selected audio file
        // setSelectedFile(e.target.files[0]);
        
        setFileData({...fileData, fileName: e.target.files[0].name, selectedFile: e.target.files[0]});

        // Used for testing function
        console.log(e.target.files[0]);
        console.log(e.target.files[0].name);
    }

    // function for resetting audio text container and form state
    function ResetAudioAi() {
        // logic for resetting audio ai page
        console.log("audio ai form is being reset");
    }

    return (
        <div className="bg-[#2E8BC0] grid grid-cols-4 grid-rows-6 gap-2 h-screen">
            {/* Heading and Description */}
            <div className="col-start-2 col-end-4 text-center text-white">
                <h1 className="text-[40px]">Audio.Ai Page</h1>
                <p className="text-[20px]">description</p>
            </div>
            {/* audio ai feature section */}
            <div className="col-start-2 col-end-3 row-start-2 row-end-3 text-center flex">
                <div className="flex items-end">
                    <button onClick={ResetAudioAi} className="bg-primary text-white rounded-md py-2 px-6">reset</button>
                </div>
            </div>
            {/* audio ai container */}
            <div className="col-start-2 col-end-4 row-start-3 row-end-5 flex">
                <div className="bg-white flex h-full w-full border-2 border-black rounded-md">
                    <p className="ml-2 mt-2"> {audioTranscription} </p>
                </div>
            </div>
            {/* Choose file and Upload file button */}
            <div className="col-start-2 col-end-3 row-start-5 flex">
                <div>
                    {/* Button for choosing audio file */}
                    <label htmlFor="audioFileInput"  className="bg-primary text-white text-lg rounded-md mr-1 py-3 px-6 cursor-pointer">Choose file</label>
                    <input onChange={HandleFile} id="audioFileInput" type="file" className="hidden"/>

                    {/* Button for uploading chosen file */}
                    <button onClick={AudioUpload} type="submit" className="bg-primary text-white text-lg rounded-md ml-1 py-2 px-6">Upload { fileName } </button>
                </div>
            </div>
        </div>
    );
}


// Flexbox version
// <div className="h-dvh text-white bg-[#2E8BC0]">
            // {/* Heading and Description text */}
            // <div className="text-center">
            //     <h1 className="text-[40px]">Audio.Ai Page</h1>
            //     <p className="text-xl">description</p>
            // </div>
        
            // {/* audio ai feature section */}
            // <div className="flex flex-col items-center gap-2 mt-10 justify-center">
            //     {/* reset button */}
            //     <div className="mr-[35rem]">
            //         <button className="bg-primary rounded-md py-2 px-6">reset</button>
            //     </div>
            //     {/* audio ai text container */}
            //     <div className="mx-auto my-2 h-[15rem] w-[40rem] h-24 rounded-sm bg-white text-black">
            //         <p className="ml-4 mt-2">Text box</p>
            //     </div>
                
            //     {/* upload file button and reset files button */}
            //     <div className="flex justify-center gap-10 mt-4">
            //         <button className="bg-primary rounded-md py-2 px-10">Choose File</button>
            //         <button className="bg-primary rounded-md py-2 px-10">File upload</button>
            //     </div>
            // </div>
        
        

