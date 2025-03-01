//elements
const audioContainer = document.getElementById('audioAI-container');
const audioText = document.getElementById('audio-text');
const audioFile = document.getElementById('audioFile');
const uploadButton = document.getElementById('upload-button');
const resetButton = document.getElementById('reset-button');
const spinner = document.getElementById('upload-spinner');
let formData = new FormData(); //collects files

//hide spinner
function hideSpinner() {
    spinner.classList.add('d-none');  // Add the 'd-none' class to hide the spinner
}

//show spinner
function showSpinner() {
    spinner.classList.remove('d-none');  // Remove the 'd-none' class to display the spinner
}

hideSpinner();


//get file name and dispay in audio file button after chosen
audioFile.addEventListener('change', async function(event) {
    //add file to form data
    formData.set('audio', audioFile.files[0]);
    const fileName = audioFile.files[0].name;
    uploadButton.textContent = `Upload: ${fileName}`; //display name    
});

uploadButton.addEventListener('click', uploadAudio);
resetButton.addEventListener('click', reset);

// //api request for audio.ai feature
async function uploadAudio () {
    //making sure user selected file
    if(!audioFile.files.length){
        alert('Please select a file')
        return;
    } 
    
    //show spinner while file is being transcribed
    showSpinner();
    
    try{
        const response = await fetch("https://api.patrolcam.us/audioai/simulateAnalyze", {
            method: 'POST',
            headers: {
                "api-key": "3mx2cIuUB7X4o3vn6phy",
            },
            body: formData,
        });

        if(!response.ok) throw new Error("Failed to process audio");

        hideSpinner();
        const result = await response.json();
        audioText.textContent = JSON.stringify(result, null, 2);
        
    }catch(error){
        hideSpinner();
        console.log('Error: ', error);
        audioText.textContent = "Error processing" 
    }
      
};

//reset option implementation
function reset() {
    //clear files
    formData = new FormData();
    audioFile.value = "";
    //reset UI
    // audioContainer.textContent = "";
    audioText.textContent = "";
    uploadButton.textContent = "Upload";

    hideSpinner();
}

