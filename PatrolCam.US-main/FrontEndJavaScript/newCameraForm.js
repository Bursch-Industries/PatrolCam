document.getElementById('newCamBtn').addEventListener('click', function() {
    console.log('New camera button clicked')
    const formContainer = document.getElementById('newCamContainer');
    console.log(formContainer.style.display)
    // Toggle visibility
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'flex';
    } else {
        formContainer.style.display = 'none';
    }
});

async function submitNewCameraForm(camData) {

    console.log('entering submitNewCameraForm: ' + JSON.stringify(camData));

    try {
        const response = await fetch('/register/addNewCam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Camera added successfully: ${result['Camera creation success']}`);
        } else {
            alert(`Error: ${result.Error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the camera.');
    }
}

document.getElementById('cameraForm').addEventListener('submit', async function (event){

    console.log('Add New Camera button clicked')

    // Collect form data
    const camName = document.getElementById('camName').value;
    const camModel = document.getElementById('camModel').value;
    const camLocation = document.getElementById('camLocation').value;

    // Prepare the data for the API call
    const data = {
        camName,
        camModel,
        camLocation
    };

    console.log('sending cam data: ' + JSON.stringify(data));


    try {
        const response = await fetch('/register/addNewCam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Camera added successfully: ${result['Camera creation success']}`);
        } else {
            alert(`Error: ${result.Error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the camera.');
    }

    //submitNewCameraForm(data);
})