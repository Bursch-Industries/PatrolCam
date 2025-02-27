// Script
document.addEventListener("DOMContentLoaded", () => {
    initializeTabs();
    initializeStatusDropdowns();
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
    const lastLoggedIn = document.getElementById(`lastLoggedIn-${officerId}`).value;

    const payload = { email, password, lastLoggedIn };
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

//Enables input elements so that we can changed
function enableAccountEditMode(){
    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll("input , select") 

    fields.forEach(field => {
        const originalValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value
        field.setAttribute('data-original-value', originalValue) 
        field.removeAttribute("disabled")
        field.style.color = "black" 
    })

    const editIcon = document.getElementById("edit-icon")
    editIcon.style.display = "none"

    const formBtns = document.getElementById("form-btns")
    formBtns.style.display = "flex"
}

//Will remove existing input elements and revert any changes made
function disableAccountEditMode(){
    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll('input, select')

    fields.forEach(field => {
        if (field.tagName === "SELECT"){
            field.style.color = "white" 
            const originalOption = field.getAttribute('data-original-value')
            for (let i = 0; i < field.options.length; i++){
                const option = field.options[i]
                if(option.text.toLowerCase() === originalOption.toLowerCase()){
                    option.selected = true;
                    break;
                }
            }
        } else {
            field.value = field.getAttribute('data-original-value')
            field.style.color = "white" 

        }
        field.setAttribute("disabled", "enabled")
    })

    const editIcon = document.getElementById("edit-icon")
    editIcon.style.display = "flex"
    
    const formBtns = document.getElementById("form-btns")
    formBtns.style.display = "none"
}

//Collects information on data to update account information
async function updateOrgInfo(){

    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll('input, select')
    const updateBtn = document.getElementById('orgUpdateBtn')

    updateBtn.textContent = "Updating..."

    const updatedData = {
        organizationAddress: {} //Placeholder for the nested address object
    }

    fields.forEach(field => {
        // const originalValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value
        // field.setAttribute('data-original-value', originalValue) 
        const fieldName = field.name;
        const fieldValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value;

        if (['Address1', 'City', 'State', 'ZipCode'].includes(fieldName)){
            updatedData.organizationAddress[fieldName] = fieldValue;
        } else {
            updatedData[fieldName] = fieldValue 
        }
    }); 

    try{
        const response = await fetch('/register/updateOrg', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        const data = response.json()

        if(response.ok){
            alert(data.message || 'Organization information updated successfully!');
        } else {
            alert(data.message || 'Update failed. Please try again.')
        }

        updateBtn.textContent = "Update"
        disableAccountEditMode()
        populateOrgData()

    } catch (error){
        console.error('Error:', error);
        alert('Failed to update organization information')
        updateBtn.textContent = "Update"
    }

}


// Event listener for Organization Info tab
document.addEventListener('DOMContentLoaded', async () => {
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){ // Check URI for path
            if(window.location.search != ''){ // Check the URI for params
                const params = new URLSearchParams(window.location.search); // Params are sent by pages accessible to Account Admin (param should only be an org id)
                const orgId = params.get('id');
                populateOrgDataAccountAdmin(orgId);
            } else{
                populateOrgData();
            }    
        }
        else if(window.location.pathname === '/userSettings'){
            populateUserData();
        }
    }, 1000) // Show load animation for 1000ms
    
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
        } else if(response.status === 404){
            // document.getElementById('account-info-form').style.display = "none"
            // document.getElementById('loaded-content').style.display = "flex"

            const accountInfo = document.getElementById('account-info-form')
            accountInfo.innerHTML = `<p class = "error-message">No organization exists under account.</p>`
        }

        //Server error
        else if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();

        //Update UI elements
        document.getElementById('org-name').value = data.organization.organizationName
        document.getElementById('email-address').value = data.organization.organizationEmail
        document.getElementById('phone-number').value = data.organization.organizationPhone
        document.getElementById('org-address').value = data.organization.organizationAddress.Address1
        document.getElementById('org-city').value = data.organization.organizationAddress.City
        document.getElementById('org-state').value = data.organization.organizationAddress.State
        document.getElementById('org-zipcode').value = data.organization.organizationAddress.ZipCode

        
        const orgSubscription = document.getElementById('org-subscription')
        const databaseValue = "Silver"
        for (let i = 0; i < orgSubscription.options.length; i++){
            const option = orgSubscription.options[i]
            if(option.text.toLowerCase() === databaseValue.toLowerCase()){
                option.selected = true;
                break;
            }
        }

        //Hide placeholder and show loaded content
        document.getElementById('account-info-form').style.display = "none"
        document.getElementById('loaded-content').style.display = "flex"

    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

async function populateUserData(){
    try{

        //API to fetch organization data
        const response = await fetch('/register/getUserInfo',{ 
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
        document.getElementById('account-firstname').value = data.user.firstname 
        document.getElementById('account-lastname').value = data.user.lastname
        document.getElementById('account-email-address').value = data.user.email
        document.getElementById('account-phone-number').value = data.user.phone || "null"

        //Hide placeholder and show loaded content
        document.getElementById('account-info-form').style.display = "none"
        document.getElementById('loaded-content').style.display = "flex"

    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

//--------Fetching organization cameras----------
document.getElementById('camera-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){ // Check URL for path
            if(window.location.search != ''){ // Check the URL for params
                const params = new URLSearchParams(window.location.search); // Params are sent by pages accessible to Account Admin (should only be an org id)
                const orgId = params.get('id');
                populateCamDataAccountAdmin(orgId); // Nates toy
            } else{
                populateCamData(true); //Populating Cam Data for admins
            }
            
        } else if (window.location.pathname === '/userSettings'){
            populateCamData(); //Populating Cam Data for users
        }
    }, 1000) // Show load animation for 1000ms 
}))

//Loads the cameras of organization from database
async function populateCamData(isAdmin = false){
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
        if(response.status === 204){
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
        renderCameras(data.cameras, isAdmin)

    } catch (error) {
        const cameraGrid = document.getElementById('camera-grid')
        cameraGrid.innerHTML = `<p class = "error-message">Error occured while getting camera details</p>`
        cameraGrid.classList.remove('placeholder');
        console.error('Error fetching camera data:', error)
    }
}

//Dynamically generates camera elements
function renderCameras(cameras, isAdmin){
    const cameraGrid = document.getElementById('camera-grid')
    cameraGrid.innerHTML = ''

    //Looping through each camera
    cameras.forEach((camera, index) =>  {
        const cameraFrame = document.createElement('div')
        cameraFrame.className = 'camera-frame'

        //Update UI element
        cameraFrame.innerHTML = `
            <img src="./security_camera_placeholder_${(index % 2) + 1}.jpg" alt="${camera.name}">
            <div class = "camera-element" data-index = ${index} data-id = ${camera._id}>
                <div class = "camera-info">
                    <label>
                        <strong>index:</strong>
                    </label>
                    <input value="${camera.id}" name = "index" disabled></input>
                <div class = "camera-info">
                    <div class="camera-form camera-name">
                        <label>
                            <strong>Name:</strong>
                        </label>
                        <input value="${camera.camera_Name}" name = "camera_Name" disabled></input>
                    </div>
                    
                    <div class = "camera-form camera-location">
                        <label>
                            <strong>Location:</strong>
                        </label>
                        <input value="${camera.location}" name = "location" disabled></input>
                    </div>

                    <div class = "camera-form camera-status">
                        <label>
                            <strong>Status:</strong>
                        </label>
                        <select type="text" name = "status" disabled>
                                <option value="Active" ${camera.status === 'Active' ? 'selected' : ''}>Active</option>
                                <option value="Inactive" ${camera.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>

                    ${isAdmin? 
                        `
                        <div class="camera-form-btns">
                            <button class="btn btn-warning" id="cameraCancelBtn" type="reset" onclick="disableCameraEditMode(${index})">Cancel</button>
                            <button class="btn btn-secondary" id="cameraUpdateBtn" type="submit" onclick="udpateCameraInfo(${index})">Update</button>
                        </div>
                        `
                        : ''
                    }
                </div>
                    ${isAdmin?
                        `
                        <div class = "camera-edit-icon">
                            <i onclick="enableCameraEditMode(${index})">&#9998;</i> <!-- Single Pencil Icon -->
                        </div>
                        `
                        : ''
                    }
            </div>
`
        //Add element into camera grid
        cameraGrid.appendChild(cameraFrame)
    })

    //Remove placeholder animation
    cameraGrid.classList.remove('placeholder-glow')
}

function enableCameraEditMode(index){
    const cameraElement = document.querySelector(`.camera-element[data-index="${index}"]`);

    console.log("This is cam:",cameraElement);
    const fields = cameraElement.querySelectorAll('.camera-form input, select');

    fields.forEach(field => {   
        const originalValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value
        field.setAttribute('data-original-value', originalValue)
        field.style.color = "black" 
        field.removeAttribute("disabled")
    })

    const editIcon = cameraElement.querySelector(".camera-edit-icon")
    editIcon.style.display = "none"

    const formBtns = cameraElement.querySelector(".camera-form-btns")
    formBtns.style.display = "flex"
}

function disableCameraEditMode(index){
    const cameraElement = document.querySelector(`.camera-element[data-index= "${index}"]`)

    const fields = cameraElement.querySelectorAll('input, select')

    fields.forEach(field => {
        if (field.tagName === "SELECT"){
            const originalOption = field.getAttribute('data-original-value')
            for (let i = 0; i < field.options.length; i++){
                const option = field.options[i]
                if(option.text.toLowerCase() === originalOption.toLowerCase()){
                    option.selected = true;
                    break;
                }
            }
        } else {
            field.value = field.getAttribute('data-original-value')    
        }

        field.style.color = "white" 
        field.setAttribute("disabled", "enabled")
    })

    const editIcon = cameraElement.querySelector(".camera-edit-icon")
    editIcon.style.display = "flex"
    
    const formBtns = cameraElement.querySelector(".camera-form-btns")
    formBtns.style.display = "none"
}

async function udpateCameraInfo(index){
    const cameraElement = document.querySelector(`.camera-element[data-index= "${index}"]`)
    const camId = cameraElement.dataset.id
    console.log(camId)

    const updateBtn = document.getElementById('cameraUpdateBtn')
    updateBtn.textContent = "Updating..."

    const updatedData = {}

    const fields = cameraElement.querySelectorAll('input, select')
    fields.forEach(field => {
        const fieldName = field.name;
        const fieldValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value;

        updatedData[fieldName] = fieldValue
    });

    try{
        const response = await fetch('/register/updateOrgCam', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updatedInfo: updatedData, 
                cameraInfo: camId
            })
        });

        const data = response.json()

        if(response.ok){
            alert(data.message || 'Organization information updated successfully!');
    
            updateBtn.textContent = "Update"
            disableCameraEditMode(index)
            populateCamData(true)

        } else {
            alert(data.message || 'Update failed. Please try again.')
        }

    } catch (error){
        console.error('Error:', error);
        alert('Failed to update organization information')
        updateBtn.textContent = "Update"
    }
}

//--------Fetching organization users----------
document.getElementById('officers-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){ // Check URI for path
            if(window.location.search != ''){ // Check the URI for params
                const params = new URLSearchParams(window.location.search); // Params are sent by pages accessible to Account Admin (should only be an org id)
                const orgId = params.get('id');
                populateOrgUserDataAccountAdmin(orgId);
            } else{
                populateOrgUserData(true);
            }
            
        } else if (window.location.pathname === '/userSettings'){
            populateOrgUserData();
        }
    }, 1000) // Show loading animation for 1000ms
}))

//Loads the users under an organization from database
async function populateOrgUserData(isAdmin = false){
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

        //If no Officers found
        if(response.status === 204){
            const officerList = document.getElementById('officer-list')
            //Adding no Officers found message to UI
            officerList.innerHTML = `<p class=no-cameras-message>No Officers found</p>`
            return
        }
        
        //Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        console.log("This is data",data)
        console.log("This is users:",data.users)
        renderOrgUsers(data.users, isAdmin)

    } catch (error) {
        const officerContainer = document.getElementById('officer-list')
        officerContainer.innerHTML = `<p class = "error-message">Error occured while getting officer details</p>`
        officerContainer.classList.remove('placeholder');
        console.error('Error fetching officer data:', error)
    }
}

function renderOrgUsers(users, isAdmin) {
    const officerContainer = document.getElementById('officer-list');
    officerContainer.innerHTML = ''; // Clear any placeholder content

    // CSS from website
    if (!document.getElementById('fancy-card-style')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'fancy-card-style';
        styleEl.textContent = `
            .fancy-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 15px;
                overflow: hidden;
                position: relative;
            }
            .fancy-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            }
            .fancy-card input {
                background-color: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
            }
            .fancy-card input:disabled {
                opacity: 1;
            }
            .fancy-card .card-body {
                padding: 1.5rem;
            }
            .fancy-card label {
                font-weight: bold;
            }
            /* Rendering effect: a light-sweep animation across the card */
            .fancy-card::after {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
                transform: skewX(-25deg);
                animation: renderingEffect 1s ease-out forwards;
            }
            @keyframes renderingEffect {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }

    // Loop through each user and create card
    users.forEach((user, index) =>  {
        const colDiv = document.createElement('div');
        console.log('User ID:', user._id);
        colDiv.className = 'col-md-4 mb-3';

        colDiv.innerHTML = `
        <div class="card fancy-card shadow-lg" style="background: linear-gradient(135deg, #0c2d48, #1b3a5a); color: white; border: none;">
            <img class="card-img-top" src="./officer_placeholder_${(index % 2) + 1}.jpg" alt="${user.firstname} ${user.lastname}" style="object-fit: cover; height: 200px;">
            <div class="card-body officer-element" data-index="${index}" data-id="${user._id}">
                <div class="officer-form officer-info mb-3">
                    <label class="mb-1 d-block"><strong>ID:</strong></label>
                    <input class="form-control" value="${user._id}" name="id" disabled>
                </div>
                <div class="officer-form officer-name mb-3">
                    <label class="mb-1 d-block"><strong>Officer:</strong></label>
                    <input class="form-control" value="${user.firstname} ${user.lastname}" name="officer_Name" disabled>
                </div>
                <div class="officer-form officer-login mb-3">
                    <p class="card-text"><strong>Last Login:</strong> ${user.lastLoggedIn}</p>
                </div>
                <div class="officer-form officer-email mb-3">
                    <label class="mb-1 d-block"><strong>Email:</strong></label>
                    <input class="form-control" type="email" value="${user.email}" name="email" disabled>
                </div>
                ${isAdmin ? `
                    <div class="officer-form-btns d-none">
                        <button class="btn btn-warning" type="button" onclick="disableOfficerEditMode(${index})">Cancel</button>
                        <button class="btn btn-secondary" id="officerUpdateBtn-${index}" type="submit" onclick="updateOfficerInfo(${index})">Update</button>
                    </div>
                    <div class="mt-2">
                        <i class="fas fa-edit" style="cursor: pointer;" onclick="enableOfficerEditMode(${index})"></i>
                    </div>
                    <div class="officer-edit-icon">
                        <i style="cursor: pointer;" onclick="enableOfficerEditMode(${index})">&#9998;</i>
                    </div>
                ` : ''}
            </div>
        </div>
        `;
        officerContainer.appendChild(colDiv);
    });

    // Remove any placeholder classes
    officerContainer.classList.remove('placeholder-glow');
}



function enableOfficerEditMode(index) {
    const officerElement = document.querySelector(`.officer-element[data-index="${index}"]`);
    if (!officerElement) return;
    if (officerElement) {
        const officerId = officerElement.dataset.id;
        console.log(officerId);
    }

    console.log("This is officer:",officerElement);
    
    // Select all input and select elements within this officer card
    const fields = officerElement.querySelectorAll('input, select');
    
    // Loop over each field to enable editing and save its original value
    fields.forEach(field => {
        // Enable the field
        field.disabled = false;
        // Save original value if not already stored
        if (!field.getAttribute('data-original-value')) {
            const originalValue = (field.tagName === "SELECT") 
                                  ? field.options[field.selectedIndex]?.text 
                                  : field.value;
            field.setAttribute('data-original-value', originalValue);
        }
        // Change text color to indicate edit mode
        field.style.color = "black";
    });
    
    // Show the update and cancel buttons by removing the "d-none" class
    const btnContainer = officerElement.querySelector('.officer-form-btns');
    if (btnContainer) {
        btnContainer.classList.remove('d-none');
    }
}

function disableOfficerEditMode(index) {
    const officerElement = document.querySelector(`.officer-element[data-index="${index}"]`);
    if (!officerElement) return;
    
    // Select all input and select elements within this officer card
    const fields = officerElement.querySelectorAll('input, select');
    
    // Loop over each field to restore its original value and disable it
    fields.forEach(field => {
        const originalValue = field.getAttribute('data-original-value');
        if (originalValue !== null) {
            field.value = originalValue;
        }
        // Change text color back to non-edit mode (white, in this case)
        field.style.color = "black";
        // Disable the field
        field.disabled = true;
    });
    
    // Hide the update and cancel buttons by adding the "d-none" class
    const btnContainer = officerElement.querySelector('.officer-form-btns');
    if (btnContainer) {
        btnContainer.classList.add('d-none');
    }
}

async function updateOfficerInfo(index){
    const officerElement = document.querySelector(`.officer-element[data-index="${index}"]`)
    const officerId = officerElement ? officerElement.dataset.id : null;
    console.log(officerId)

    console.log(officerId)
    const updateBtn = document.getElementById('officerUpdateBtn')
    updateBtn.textContent = "Updating..."

    const updatedData = {}

    const fields = officerElement.querySelectorAll('input, select')
    fields.forEach(field => {
        const fieldName = field.name;
        const fieldValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value;

        updatedData[fieldName] = fieldValue
    });

    try{
        const response = await fetch('/register/updateOrgUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                updatedInfo: updatedData, 
                userInfo: officerId
            })
        });

        const data = response.json()

        if(response.ok){
            alert(data.message || 'Organization information updated successfully!');
    
            updateBtn.textContent = "Update"
            disableOfficerEditMode(index)
            populateOrgUserData(true)

        } else {
            alert(data.message || 'Update failed. Please try again.')
        }

    } catch (error){
        console.error('Error:', error);
        alert('Failed to update organization information')
        updateBtn.textContent = "Update"
    }
}

//<----All the belows code is For Account Admin role (Nate only)-------------------

async function createNewOrganization(orgName, orgEmail, orgPhone, orgAddress, user, password, userFirstname, userLastname, userEmail){
    try{
        const response = await fetch('register/newOrg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orgName,
                orgEmail,
                orgPhone,
                orgAddress,
                user,
                password,
                userFirstname,
                userLastname,
                userEmail
            })
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status ${response.status}`)
        }
        const result = await response.json()
        return result
    } catch (error) {
        console.error('Error posting data:', error)
    }
}

async function createNewUser(user, password, userFirstname, userLastname, userEmail, phone, rank){
    try{
        const response = await fetch('register/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                password,
                userFirstname,
                userLastname,
                userEmail,
                phone,
                rank
            })
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status ${response.status}`)
        }

        const result = await response.json()

        return result
    } catch (error) {
        console.error('Error posting data:', error)
    }
}

async function getOrgList(){
    try{
        const response = await fetch('/register/getOrgList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        //If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }

        if(response.status === 403){
            return
        }
        
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        data = response.json()

    } catch(error) {
        console.error('Error posting data:', error)

    }
}


// Retrieve organization data based on URI params
async function populateOrgDataAccountAdmin(orgId){
    try{
        
        // API call to fetch organization data
        const response = await fetch(`/api/org/${orgId}`,{ 
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

        const addressString = (data.organizationAddress.Address1 + ', ' + data.organizationAddress.State + ' ' + data.organizationAddress.ZipCode);

        //Update UI elements
        document.getElementById('org-name').value = data.organizationName;
        document.getElementById('email-address').value = data.organizationEmail;
        document.getElementById('phone-number').value = data.organizationPhone;
        document.getElementById('org-address').value = data.organizationAddress.Address1
        document.getElementById('org-city').value = data.organizationAddress.City
        document.getElementById('org-state').value = data.organizationAddress.State
        document.getElementById('org-zipcode').value = data.organizationAddress.ZipCode
        
        const orgSubscription = document.getElementById('org-subscription')
        const databaseValue = "Silver"
        for (let i = 0; i < orgSubscription.options.length; i++){
            const option = orgSubscription.options[i]
            if(option.text.toLowerCase() === databaseValue.toLowerCase()){
                option.selected = true;
                break;
            }
        }

        //Hide placeholder and show loaded content
        document.getElementById('account-info-form').style.display = "none"
        document.getElementById('loaded-content').style.display = "flex"

    } catch (error) {
        console.error('Error fetching user data:', error)
    }
}

// Retrieve camera data of an organization based on URI params
async function populateCamDataAccountAdmin(orgId){
    try{
        
        // API call to fetch camera data
        const response = await fetch(`/api/org/${orgId}/cameraData`,{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        //Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        //If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }

        //If no cameras found
        if(response.status === 204){
            const cameraGrid = document.getElementById('camera-grid')
            //Adding no camera found message to UI
            cameraGrid.innerHTML = `<p class=no-cameras-message>No Cameras available.</p>`
            return
        }

        const data = await response.json();
        renderCameras(data, true)

    } catch (error) {
        const cameraGrid = document.getElementById('camera-grid')
        cameraGrid.innerHTML = `<p class = "error-message">Error occured while getting camera details</p>`
        cameraGrid.classList.remove('placeholder-glow');
        console.error('Error fetching camera data:', error)
    }
}

// Retrieve user data of an organization based on URI params
async function populateOrgUserDataAccountAdmin(orgId){
    try{
        
        // API call to fetch user data
        const response = await fetch(`/api/org/${orgId}/userData`,{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        // If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }
        
        // Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        renderOrgUsers(data)

    } catch (error) {
        console.error('Error fetching org user data:', error)
    }
}

//-------- Fetching Login History ----------
document.getElementById('privacy-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load items
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){ // Check URI for path
            if(window.location.search != ''){ // Check URI for params
                const params = new URLSearchParams(window.location.search); // Params are sent by pages accessible to Account Admin (should only be an org id)
                const orgId = params.get('id');
                populateOrgPrivacyDataAccountAdmin(orgId);
            } else{
                populateOrgPrivacyData();
            }  
        }
    }, 1000) // Show load animation for 1000ms
}))

// Retrieve login data of users from an organization
async function populateOrgPrivacyData() {

    try{
        // API call to fetch user data to extract lastLogin from
        const response = await fetch(`/api/org/loginData`,{ 
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
        renderLastLogin(data)

    } catch (error) {
        console.error('Error fetching org privacy data:', error)
    }
}

// Retrieve login data of users from an organization based on URI params
async function populateOrgPrivacyDataAccountAdmin(orgId){

    try{
        // API to fetch user data to extract lastLogin from
        const response = await fetch(`/api/org/${orgId}/loginData`,{ 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        // If unauthorized to make the request sends back to login page
        if(response.status === 401){
            console.log('Session expired or unauthorized. Redirecting to login...')
            window.location.href = '/login'
            return
        }
        
        // Server error
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        renderLastLogin(data)

    } catch (error) {
        console.error('Error fetching org privacy data:', error)
    }
}

function formatLoginDateTime(timeStamp) {

    const date = new Date(timeStamp);
    const formattedStamp = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} ${date.toTimeString().split(' ')[0]}`;
    
    return formattedStamp;
}


//Dynamically generates login elements
function renderLastLogin(users){
    const officerContainer = document.getElementById('loginHistory')
    officerContainer.innerHTML = ''

    //Looping through all users and creating each element
    users.forEach((user, index) =>  {
        const userCard = document.createElement('div')
        const loginDateTime = formatLoginDateTime(user.lastLoggedIn);

        //Update UI element
        userCard.innerHTML = `
            <div class="login-record">
                <p class="officer-name">
                    <strong>${user.firstname} ${user.lastname}</strong>
                </p>

                <span class="dateTime">${loginDateTime}</span>
            </div>
        `
        //Adding user card element
        officerContainer.appendChild(userCard)
    })

}