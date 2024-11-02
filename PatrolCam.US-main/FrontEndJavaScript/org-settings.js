// Script
document.addEventListener("DOMContentLoaded", () => {
    initializeTabs();
    initializeStatusDropdowns();
    // initializeAccountEdit();
});

// Tab Initialization
function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            button.classList.add("active");
            const targetTab = document.getElementById(button.dataset.tab);
            targetTab.classList.add("active");
        });
    });
}

//Toggles dropdown menu for officer card
function toggleOfficerDetails(header) {
    const officerCard = header.parentElement;
    officerCard.classList.toggle('active')
}

// Status Dropdown Logic
function initializeStatusDropdowns() {
    const statusDropdowns = document.querySelectorAll(".status-dropdown");

    statusDropdowns.forEach((dropdown) => {
        dropdown.addEventListener("change", (event) => {
            const color = event.target.value === "active" ? "limegreen" : "red";
            event.target.style.color = color;
        });

        dropdown.dispatchEvent(new Event("change"));
    });
}

// Save Changes
async function saveChanges(entityType, id, payload) {
    const url = `/api/${entityType}/${id}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert("Changes saved successfully.");
        } else {
            console.error(`Failed with status: ${response.status}`);
            alert("Failed to save changes.");
        }
    } catch (error) {
        console.error(`Error saving ${entityType} changes:`, error);
        alert("An error occurred while saving changes.");
    }
}

// Save Officer Changes Handler
function saveOfficerChanges(officerId) {
    const email = document.getElementById(`email-${officerId}`).value;
    const password = document.getElementById(`password-${officerId}`).value;

    const payload = { email, password };
    saveChanges("officers", officerId, payload);
}

// Save Camera Changes Handler
function saveCameraChanges(cameraId) {
    const name = document.getElementById(`name-${cameraId}`).value;
    const location = document.getElementById(`location-${cameraId}`).value;
    const status = document.getElementById(`status-${cameraId}`).value;

    const payload = { name, location, status };
    saveChanges("camera", cameraId, payload);
}

// Editable Pencil Icon

// function initializeAccountEdit() {
//     const editIcon = document.querySelector("#account-info .edit-icon");
//     const inputFields = document.querySelectorAll("#account-info input");
//     const subscriptionDropdown = document.getElementById("subscription-plan");
//     const submitButton = document.querySelector(".submit-btn");

//     let isEditable = false;

//     editIcon.addEventListener("click", () => {
//         isEditable = !isEditable;

//         inputFields.forEach((input) => {
//             input.readOnly = !isEditable; // Toggle readonly
//             input.classList.toggle("editable", isEditable); // Apply editable style
//         });

//         if (isEditable) {
//             subscriptionDropdown.removeAttribute("disabled"); // Enable dropdown
//             subscriptionDropdown.classList.add("editable");
//         } else {
//             subscriptionDropdown.setAttribute("disabled", ""); // Disable dropdown
//             subscriptionDropdown.classList.remove("editable");
//         }

//         submitButton.disabled = !isEditable; // Enable or disable submit button
//     });
// }


function initializeOfficerToggle() {
    const officerCards = document.querySelectorAll(".officer-card");

    officerCards.forEach((card) => {
        const header = card.querySelector(".officer-header");
        header.addEventListener("click", () => toggleOfficerDetails(card));
    });
}

function toggleOfficerDetails(card) {
    console.log("Toggling card:", card);  // Debugging output
    card.classList.toggle("active");
}

function enableEditMode(){
    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll("span[data-field]")
    fields.forEach(field => {
        
        const fieldName = field.getAttribute('data-field')
        const fieldValue = field.textContent

        if(fieldName === "organizationSubscription"){
            const select = document.createElement('select')
            select.id = fieldName
            select.classList.add('form-control')

            const options = [
                { value: 'premium', text: 'Premium'},
                { value: 'gold', text: 'Gold'},
                {value: 'silver', text: 'Silver'}
            ]

            options.forEach(option => {
                const optionElement = document.createElement('option')
                optionElement.value = option.value
                optionElement.textContent = option.text
                if(option.text.toLowerCase() === fieldValue.toLowerCase()){
                    optionElement.selected = true
                }

                select.appendChild(optionElement)
            })

            field.replaceWith(select)
        }
        else{
            const input = document.createElement('input')
            input.type = "text"
            input.value = fieldValue
            input.classList.add('form-control')
            input.id = fieldName

            field.replaceWith(input)
        }
    })
}


//-----Fetching account info details-------
document.addEventListener('DOMContentLoaded', async () => {
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){
            populateOrgData()
        } 
    }, 1000)
    
})

//Load the organization data from database
async function populateOrgData(){
    try{
        //API to fetch organization data
        const response = await fetch('/register/getOrg',{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        //If unauthorized to make request
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }

        //Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();

        //Update UI elements
        document.getElementById('org-name').textContent = data.organization.organizationName
        document.getElementById('email-address').textContent = data.organization.organizationEmail
        document.getElementById('phone-number').textContent = data.organization.organizationPhone
        document.getElementById('org-address').textContent = data.organization.organizationAddress 
        document.getElementById('org-subscription').textContent = "Coming soon..."

        //Hide placeholder and show loaded content
        document.getElementById('account-info-form').classList.toggle('hidden'); 
        document.getElementById('loaded-content').classList.remove('d-none')

    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}


//--------Fetching organization cameras----------
document.getElementById('camera-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        populateCamData()
    }, 1000)
}))

//Loads the cameras of organization from database
async function populateCamData(){
    try{
        //API to fetch camera data
        const response = await fetch('/register/getCams',{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        //If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }

        //If no cameras found
        if(response.status === 404){
            const cameraGrid = document.getElementById('camera-grid')
            //Adding no camera found message to UI
            cameraGrid.innerHTML = `<p class=no-cameras-message>No Cameras available.</p>`
            return
        }

        //Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        console.log(data.cameras)
        renderCameras(data.cameras)

    } catch (error) {
        const cameraGrid = document.getElementById('camera-grid')
        cameraGrid.innerHTML = `<p class = "error-message">Error occured while getting camera details</p>`
        cameraGrid.classList.remove('placeholder-glow');
        console.error('Error fetching camera data:', error)
    }
}

//Dynamically generates camera elements
function renderCameras(cameras){
    const cameraGrid = document.getElementById('camera-grid')
    cameraGrid.innerHTML = ''

    //Looping through each camera
    cameras.forEach((camera, index) =>  {
        const cameraFrame = document.createElement('div')
        cameraFrame.className = 'camera-frame'

        //Update UI element
        cameraFrame.innerHTML = `
            <img src="./security_camera_placeholder_${(index % 2) + 1}.jpg" alt="${camera.name}">
                        
            <div class="camera-info">
                <label>
                    <strong>Camera Name:</strong>
                    <span>${camera.camera_Name}</span>
                </label>
                <label>
                    <strong>Location:</strong>
                    <span>${camera.location}</span>
                </label>
                <label>
                    <strong>Status:</strong>
                    <span>${camera.status}</span>
                </label>
            </div>
        `
        //Add element into camera grid
        cameraGrid.appendChild(cameraFrame)
    })

    //Remove placeholder animation
    cameraGrid.classList.remove('placeholder-glow')
}


//--------Fetching organization users----------
document.getElementById('officers-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        populateOrgUserData()
    }, 1000)
}))

//Loads the users under an organization from database
async function populateOrgUserData(){
    try{
        //API to fetch organization users
        const response = await fetch('/register/getOrgUsers',{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        //If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }
        
        //Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        renderOrgUsers(data.users)

    } catch (error) {
        console.error('Error fetching org user data:', error)
    }
}

//Dynamically generates user elements
function renderOrgUsers(users){
    const officerContainer = document.getElementById('officer-list')
    officerContainer.innerHTML = ''

    //Looping through all users and creating each element
    users.forEach((user, index) =>  {
        const userCard = document.createElement('div')
        userCard.className = 'officer-card collapsed'

        //Update UI element
        userCard.innerHTML = `
            <div class="officer-header" onclick="toggleOfficerDetails(this)">
                <img src="./officer_placeholder_1.jpg" alt="Officer 1">

                <p class="officer-name">
                    <strong>Officer ${user.firstname} ${user.lastname}</strong>
                </p>

                <span class="dropdown-arrow">&#9662;</span>
            </div>

            <form class="officer-details" onsubmit="saveOfficerChanges('officer-1'); return false;">
                <label>
                    <strong>Email:</strong>
                    <input type="email" id="email-officer-${index}" value="${user.email}">
                </label>

                <label>
                    <strong>Password:</strong>
                    <input type="password" id="password-officer-${index}" value="******">
                </label>

                <p>
                    <strong>Last Login:</strong> 
                    ${user.lastLoggedIn}
                </p>
                
                <button type="submit" class="save-btn">Save Changes</button>
            </form>
        `
        //Adding user card element
        officerContainer.appendChild(userCard)
    })

    //Removing placeholder animations
    officerContainer.classList.remove('placeholder-wave')
}



//For Master role (Nate only)
//TODO: Add function to fetch organization name and password
//TODO: Add function to post new organization
//TODO: Add function to post new user