// audio api call and logic 


export async function POST(req) {
    // logic for handling sending audio file to the audio api cURL and returning a formatted response bac 
    try {
        const oldFormData = await req.formData();
        const file = oldFormData.get('audioFile'); 

        // prepare formData for external api request
        const formData = new FormData();
        formData.set('audio', file);
        
        // post users audio file to external api to be transcribed 
        const res = await fetch("https://api.patrolcam.us/audioai/simulateAnalyze", {
            method: 'POST',
            headers: {
                'api-key': process.env.AUDIO_API_KEY,
            },
            body: formData,
        });

        if(!res.ok) { return new Response(
            JSON.stringify({error: 'failed to transcribe audio'}),
            { status: res.status }
        )}

        // await response from external api requst and parse it
        const result = await res.json();

        // return result back to frontend 
        return new Response(
            JSON.stringify({result}),
            { status: 200 },

        )
        
    } catch (error) {  
        return new Response(
            JSON.stringify( {error: 'internal server error' } ),
            { status: 500 },
        )
    }
}