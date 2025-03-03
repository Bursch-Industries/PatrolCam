
// Convert buffer to blob
const bufferToBlob = (buffer, mimeType) => {
    return new Blob([buffer], { type: mimeType });
}

const handleAudioAnalyze = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({error: "Audio file is required"});
    }

    try{
        const audioBlob = bufferToBlob(file.buffer, file.mimetype);
        const formData = new FormData();
        formData.append('audio', audioBlob, { filename: file.originalname });

        const response = await fetch("https://api.patrolcam.us/audioai/simulateAnalyze", {
            method: 'POST',
            headers: {
                "api-key": process.env.AUDIO_API_KEY, // audio.ai api key
            },
            body: formData,
        });

        if(!response.ok) {
            const errorDetails = await response.text();
            throw new Error("Failed to process audio: " +  errorDetails);
        }

        const result = await response.json();
        res.json(result); // Send the result back to the client
    }catch(error){
        console.log('Error: ', error);
        res.status(500).json({error: "Error processing audio"});
    }
}

module.exports = { handleAudioAnalyze }

