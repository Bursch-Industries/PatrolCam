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

//Enables input elements so that we can changed
function enableAccountEditMode(){
    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll("input , select") 

    fields.forEach(field => {
        const originalValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value
        field.setAttribute('data-original-value', originalValue) 
        field.removeAttribute("disabled")
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
        field.setAttribute("disabled", "enabled")
    })

    const editIcon = document.getElementById("edit-icon")
    editIcon.style.display = "flex"
    
    const formBtns = document.getElementById("form-btns")
    formBtns.style.display = "none"
}

//Collects information on data to update account information
async function updateAccountInfo(){

    const loadedContent = document.getElementById('loaded-content')
    const fields = loadedContent.querySelectorAll('input, select')
    const updateBtn = document.getElementById('updateBtn')

    updateBtn.textContent = "Updating..."

    const updatedData = {}

    fields.forEach(field => {
        const originalValue = field.tagName === "SELECT" ? field.options[field.selectedIndex]?.text : field.value
        field.setAttribute('data-original-value', originalValue) 

        if (field.tagName === "SELECT"){
            updatedData[field.name] = field.options[field.selectedIndex].text
        } else {
            updatedData[field.name] = field.value  
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

    } catch (error){
        console.error('Error:', error);
        alert('Failed to update organization information')
        updateBtn.textContent = "Update"
    }

}


//-----Fetching account info details-------
document.addEventListener('DOMContentLoaded', async () => {
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        if(window.location.pathname === '/org-settings'){
            
            if(window.location.search != ''){
                console.log('params found')
                const params = new URLSearchParams(window.location.search);
                params.forEach((value, key) => {
                    console.log(`${key}: ${value}`);
                });
                const orgId = params.get('id');
                populateOrgDataAccountAdmin(orgId);
            } else{
                populateOrgData()
            }
            
        }
    }, 1000)
    
})

//Load the organization data from database
async function populateOrgData(){
    try{

        console.log()
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
        document.getElementById('org-name').value = data.organization.organizationName
        document.getElementById('email-address').value = data.organization.organizationEmail
        document.getElementById('phone-number').value = data.organization.organizationPhone
        document.getElementById('org-address').value = data.organization.organizationAddress 
        
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
                <i id = "edit-icon" class="edit-icon" onclick="enableAccountEditMode()">&#9998;</i> <!-- Single Pencil Icon -->
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
        console.log('Response received: ', result)
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
        console.log('Response received: ', result)
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
            console.log('User doesnot have permission to use this function')
            return
        }
        
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        data = response.json()
        console.log(data)

    } catch(error) {
        console.error('Error posting data:', error)

    }
}


//Load the organization data from database
async function populateOrgDataAccountAdmin(orgId){

    console.log('id to fetch: ' + orgId)

    try{
        //API to fetch organization data

        console.log('fetching url: ' + `/api/org/${orgId}` )

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

        console.log('response: ' + JSON.stringify(data))

        //Update UI elements
        document.getElementById('org-name').value = data.organizationName
        document.getElementById('email-address').value = data.organizationEmail
        document.getElementById('phone-number').value = data.organizationPhone
        document.getElementById('org-address').value = data.organizationAddress 
        
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


//--------Fetching organization cameras----------
document.getElementById('camera-btn').addEventListener('click',(async()=>{
    //Set timeout of 1sec to load itmes
    setTimeout(()=>{
        populateCamData()
    }, 1000)
}))
