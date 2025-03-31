// audio api call and logic 


export async function POST(req) {
    // logic for handling sending audio file to the audio api cURL and returning a formatted response back
    
    try {
        const formData = await req.formData();
        const file = formData.get('audioFile'); 

        // perform checks on audio file and return errors if not valid

        // prepare formData for external api request
        const audioAiFormData = new FormData();
        audioAiFormData.set('audio', file);

        // used for debugging
        console.log(audioAiFormData);

        const res = await fetch("https://api.patrolcam.us/audioai/simulateAnalyze", {
            method: 'POST',
            headers: {
                'api-key': process.env.AUDIO_API_KEY,
            },
            body: audioAiFormData,
        });

        // used for debugging
        console.log("request has been made");

        if(!res.ok) { return new Response(
            JSON.stringify({error: 'failed to transcribe audio'}),
            { status: res.status }
        )}

        // extract transcription result
        const result = await res.json();

        // return result back to frontend 
        return new Response(
            JSON.stringify({ transcription: result.transcription }),
            { status: 200 },

        )
        
    } catch (error) {
        
        return new Response(
            JSON.stringify( {error: 'internal server error' } ),
            { status: 500 },
        )

    }
        
}