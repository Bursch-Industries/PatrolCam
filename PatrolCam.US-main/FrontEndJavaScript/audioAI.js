//elements
const audioContainer = document.getElementById('audioAI-container');
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
    formData.set('audioFile', audioFile.files[0]);
    const fileName = audioFile.files[0].name;
    uploadButton.innerText = `Upload: ${fileName}`; //display name    
});

uploadButton.addEventListener('click', uploadAudio);
resetButton.addEventListener('click', reset);

//api request for audio.ai feature
async function uploadAudio () {
    //making sure user selected file
    if(!audioFile.files.length){
        alert('Please select a file')
        return;
    } 
    //add file to formData
    formData.set('audioFile', audioFile.files[0]);

    //show spinner while file is being transcribed
    showSpinner();
    console.log(spinner.style.display);
    
    try{
        const response = await fetch('https://api.patrolcam.us/audioai/simulateAnalyze', {
            method: 'POST',
            body: formData
        });

        if(!response.ok) throw new Error("Failed to process audio");
        hideSpinner();
        const result = await response.json();
        audioContainer.innerText = JSON.stringify(result, NULL, 2);
        

    }catch(error){
        hideSpinner();
        console.log('Error: ', error);
        audioContainer.innerText = "Error processing audio"
        
    }
    
};

//reset option implementation
function reset() {
    //clear files
    formData = new FormData(); //clear formdata
    audioFile.value = ""; //clear file input
    

    //reset UI
    audioContainer.innerText = "";
    uploadButton.innerText = "Upload";

    hideSpinner();
}

