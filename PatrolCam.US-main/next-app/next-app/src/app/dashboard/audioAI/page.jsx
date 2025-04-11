// AudioAI page for PatrolCam
'use client';
import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import Transcription from "@/app/dashboard/audioAI/transcription";

export default function AudioAI(){
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
            const formData = new FormData(); // form data object to store users selected file
            formData.set('audioFile', fileData.selectedFile);
            const res = await fetch('/api/auth/audioAPI', {
                method: 'POST',
                headers: {
                  'Accept' : 'application/json',
                },
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to process audio");
            const result = await res.json(); // returns js object
            // store the audio transcription in state
            setFileData({
              ...fileData,
              audioTranscription: result,
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
                selectedFile: e.target.files[0],
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

    // allows for download of a text file for the audio transcription
    function HandleTextDownload() {
      const header = audioTranscription.result.transactionId
      const body = audioTranscription.result.transcript.replace(/\\n/g, '\n');
      const summary = audioTranscription.result.summary
      const suspiciousWords = audioTranscription.result.suspicious_words
      const suspiciousList = suspiciousWords.map((message) => {
          return `\n${message.word}: ${message.sentence}\n`;
        })

      const susString = suspiciousList.join(" ")
      const formattedText = `TranscriptionId: ${header}\n\nTranscription:\n\n${body}summary: ${summary}\n\nSuspicious Words:\n${susString}`
      const blob = new Blob([formattedText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

     const link = document.createElement('a')
     link.href = url
     link.download = "transcription.txt"
     link.click()

     URL.revokeObjectURL(url) // cleanup

    }
    
return (
    <div className="base-background min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Heading and Description */}
        <div className="text-white">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-2">Audio.Ai</h1>
          <p className="text-base md:text-xl">Upload audio files for AI transcription</p>
        </div>
        
        {/* Clear transcription, download, and transcription */}
        {audioTranscription ? (
              <>
                <div className="flex justify-center gap-2 md:justify-start">
                  <button
                    onClick={ResetAudioAi}
                    className="bg-gray-100 font-bold rounded-md py-2 px-4 hover:bg-blue-700 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                  <button onClick={HandleTextDownload} className="flex gap-2 bg-gray-100 font-bold rounded-md py-2 px-4 hover:bg-blue-700 hover:text-white transition-colors">
                    <DownloadIcon />
                  </button>
                </div>
                <Transcription audioData={audioTranscription} />
              </>
          ) : (
              <div className="w-full bg-gray-100 rounded-4xl shadow-lg p-4 min-h-[50px] md:min-h-[50px]">
                <p className="text-gray-400 italic text-center">Transcription will appear here...</p>
              </div>
          )}
        
        {/* show file control file buttons only before submission */}
        {!audioTranscription ? ( 
          <>
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
            
            {selectedFile && (
              <div className="text-center text-white text-lg">
                Selected file: <span className="font-semibold">{fileName}</span>
              </div>
            )} 
          </> ) : ( 
            <></> 
          )}

      </div>
    </div>
  );
}

        

