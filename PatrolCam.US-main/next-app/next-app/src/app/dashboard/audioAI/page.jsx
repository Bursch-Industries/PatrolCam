// AudioAI page for PatrolCam
'use client';

import { useState } from "react";
import Transcription from "@/app/dashboard/audioAI/transcription";

export default function AudioAI(){
    // const [selectedFile, setSelectedFile] = useState(null); // state to store and change audio file
    const [fileData, setFileData] = useState({
        fileName: (''),
        audioTranscription: (''),
        selectedFile: null,
    });

    const selectedFile = fileData.selectedFile;
    const fileName = fileData.fileName; 
    const audioTranscription = fileData.audioTranscription; 

    // function for api request using chosen file
    async function AudioUpload() {
        try {
            const formData = new FormData();
            formData.set('audioFile', fileData.selectedFile); // store the users file in new formData object
            const res = await fetch('/api/auth/audioAPI', {
                method: 'POST',
                headers: {
                  'Accept' : 'application/json',
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to process audio");

            const result = await res.json(); // returns js object
            // const textResponse = JSON.stringify(result, null, 2);
            const textResponse = result

            // store the audio transcription in state
            setFileData({
              ...fileData,
              audioTranscription: textResponse,
            });  
          
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
        })};
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
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Audio.Ai</h1>
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
        <div className="w-full bg-gray-100 rounded-4xl shadow-lg p-4 min-h-[50px] md:min-h-[50px]">
          {audioTranscription ? (
            <Transcription audioData={audioTranscription} />
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
              selectedFile 
                ? "bg-primary hover:bg-blue-700 transition-colors" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedFile ? "Upload file" : "Select a file first"}
          </button>
        </div>
        
        {/* File status indicator */}
        {selectedFile && (
          <div className="text-center text-white text-lg">
            Selected file: <span className="font-semibold">{fileName}</span>
          </div>
        )}

      </div>
    </div>
  );
}

        

