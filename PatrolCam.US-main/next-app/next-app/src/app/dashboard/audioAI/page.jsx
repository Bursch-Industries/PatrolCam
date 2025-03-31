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
                headers: {
                    'Accept' : 'application/json',
                },
            });

            if (!res.ok) throw new Error("Failed to process audio");

            const result = await res.json();
            const textResponse = JSON.stringify(result, null, 2);

            setFileData(prev => ({
                ... prev,
                audioTranscription: textResponse
            }));
        
            // used for testing
            console.log(fileData.audioTranscription ? 'text file transcribed successfully': 'text file was not transcribed successfully');
            
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    // used to set and store selected audio file in state
    function HandleFile(e) {
        
        if (e.target.files && e.target.files[0]){
            setFileData({
                ...fileData,
                fileName: e.target.files[0].name,
                selectedFile: e.target.files[0]
            })

            // Used for testing function
            console.log(e.target.files[0]);
            console.log(e.target.files[0].name);
        }
    }

    // function for resetting state of audio ai, and clearing input file
    function ResetAudioAi() {
        
        setFileData({
            fileName: (''),
            audioTranscription: (''),
            selectedFile: null,
        });

        const currFile = document.getElementById("audioFileInput");
        if (currFile) currFile.value = ''; // remove the selected input
    }

    
return (
    <div className="base-background min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Heading and Description */}
        <div className="text-center text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Audio.Ai Page</h1>
          <p className="text-base md:text-lg">Upload audio files for AI transcription</p>
        </div>
        
        {/* Reset button */}
        <div className="flex justify-center md:justify-end">
          <button 
            onClick={ResetAudioAi} 
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Audio AI container */}
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-4 min-h-[200px] md:min-h-[250px]">
          {audioTranscription ? (
            <p className="whitespace-pre-wrap">{audioTranscription}</p>
          ) : (
            <p className="text-gray-400 italic">Transcription will appear here...</p>
          )}
        </div>
        
        {/* File controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <label 
            htmlFor="audioFileInput"  
            className="bg-primary text-white text-base md:text-lg rounded-md py-2 px-4 hover:bg-blue-700 transition-colors text-center"
          >
            Choose file
          </label>
          <input onChange={HandleFile} id="audioFileInput" type="file" accept="audio/*" className="hidden"/>

          <button 
            onClick={AudioUpload} 
            disabled={!fileData.selectedFile}
            type="submit" 
            className={`text-white text-base md:text-lg rounded-md py-2 px-4 text-center ${
              fileData.selectedFile 
                ? "bg-primary hover:bg-blue-700 transition-colors" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {fileData.selectedFile ? "Upload file" : "Select a file first"}
          </button>
        </div>
        
        {/* File status indicator */}
        {fileData.selectedFile && (
          <div className="text-center text-white text-lg">
            Selected file: <span className="font-semibold">{fileName}</span>
          </div>
        )}

      </div>
    </div>
  );
}

        

