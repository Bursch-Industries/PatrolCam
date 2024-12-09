// Function to fetch a list of organizations from database in paginated form, based on front-end specified filter(s)

async function fetchOrgPage(filter) {

    
    try {

        let response;

        // If there are no params, fetch the first page with default number of results
        if(filter){
            const params = new URLSearchParams(filter).toString(); // Convert json into URL Search format
            response = await fetch(`/api/org/page?${params}`)
        } else {
            if(localStorage.getItem('currentSearch')) {
                localStorage.removeItem('currentSearch'); // Clear any search data stored in the browser when the user (re)loads the page
            }
            response = await fetch('/api/org/page'); // Default to fetching first x org results in alphabetical order
        }

        const orgs = await response.json();
        const orgList = document.getElementById('orgList');

        // Reset the table every time the next db page is fetched
        orgList.innerHTML = '';

        if(orgs.orgs.length > 0) {
            // Generate new divs to hold organization info
            orgs.orgs.forEach(org => {
                const orgDiv = document.createElement('div');
                const statusColor = org.status === 'Active' ? 'green' : 'red';
                orgDiv.className = 'user';
                orgDiv.innerHTML = `
                <select style="color:${statusColor};" id="orgStatus-${org._id}" name="status">
                    <option style="color:green;" value='Active'>Active</option>
                    <option style="color:red;" value='Inactive'>Inactive</option>
                </select>
                <span class="orgName">${org.organizationName}</span>
                <span class="userCount">${org.users.length}</span>
                <a href="org-settings?id=${org._id}"class="detailsButton">More Details</a>
                `;
                orgList.appendChild(orgDiv);

                // Set the status value of each organization after the <select> element is rendered
                const changeStatus = orgDiv.querySelector(`#orgStatus-${org._id}`);
                changeStatus.value = org.status; 

                // Event listener for the status selector
                changeStatus.addEventListener('change', async (event) => {
                    const newStatus = event.target.value;

                    const response = confirm("This will change the Organizations Activity. Are you sure?") // Built-in Node message box, not custom
                    if(response) {               
                        try {
                            const response = await fetch(`/register/updateOrgStatus`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ status: newStatus, orgId: org._id }),
                            });
                            
                            changeStatus.value = newStatus; // Set the current status of the org 

                            if(newStatus === "Active"){
                                event.target.style.color = "green";
                            } else if(newStatus === "Inactive"){
                                event.target.style.color = "red";
                            }
                            
                            const result = await response.json();
                            const message = result.message;
                            if(message.includes('Success')) {
                                alert("Organization Status Changed Successfully")
                            }
                        } catch(error) {
                            return
                        } 
                    }
                })
            });
        } else { // If no results are found for the given filter
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'noResults';
            noResultsDiv.textContent = 'No results found';
            orgList.appendChild(noResultsDiv);
        }
        
        // Update current page number
        document.getElementById('pageNumber').value = orgs.page;

        // Update total pages
        if(orgs.totalPages < 1) {
            document.getElementById('maxPages').textContent = 1;
        } else {
            document.getElementById('maxPages').textContent = orgs.totalPages;
        }
        

    } catch (error) {
        console.error('Error fetching orgs:', error);
    }
}

// Event listener for retrieving the next page of results
document.getElementById('nextPage').addEventListener("click", function() {
    
    let filter = {};

    // Get the current page
    const currentPage = parseInt(document.getElementById("pageNumber").value);

     // Get the current sort, using organizationName as a default
     if(!localStorage.getItem('currentSort')) {
        localStorage.setItem('currentSort', 'organizationName');
     }
     const currentSort = localStorage.getItem('currentSort')

     // Get the current order, using 'asc' as a default
     if(!localStorage.getItem('currentOrder')) {
        localStorage.setItem('currentOrder', 'asc');
     }
     const currentOrder = localStorage.getItem('currentOrder');
    
    
    // Current page must be less than the total pages in order to get next page.
    const totalPages = parseInt(document.getElementById('maxPages').textContent);
    if(currentPage < totalPages){
        filter.page = currentPage + 1;
        filter.skip = 10;
        filter.sort_ = currentSort;
        filter.order_ = currentOrder;
        if(localStorage.getItem('currentSearch')) {
            const currentSearch = localStorage.getItem('currentSearch')
            filter.organizationName = currentSearch;
         }
        fetchOrgPage(filter);
    } else {
        return;
    }
    
})

// Event listener for retrieving the previous page of results
document.getElementById('previousPage').addEventListener("click", function() {

    let filter = {};
    // Get the current page
    const currentPage = parseInt(document.getElementById("pageNumber").value);

     // Get the current sort, using organizationName as a default
     if(!localStorage.getItem('currentSort')) {
        localStorage.setItem('currentSort', 'organizationName');
     }
     const currentSort = localStorage.getItem('currentSort')

     // Get the current order, using 'asc' as a default
     if(!localStorage.getItem('currentOrder')) {
        localStorage.setItem('currentOrder', 'asc');
     }
     const currentOrder = localStorage.getItem('currentOrder');

    // Current page must be greater than 1 in order to go a previous page
    if(currentPage > 1){
        filter.page = currentPage - 1;
        filter.skip = 10;
        filter.sort_ = currentSort;
        filter.order_ = currentOrder;
        if(localStorage.getItem('currentSearch')) {
            const currentSearch = localStorage.getItem('currentSearch')
            filter.organizationName = currentSearch;
         }
        fetchOrgPage(filter);
    } else {
        return;
    }
})


// Event listener for button that switches organization order alphabetically 
document.getElementById('filterOrgName').addEventListener("click", function(){

    let filter = {};

    // Get the current page 
    const currentPage = parseInt(document.getElementById("pageNumber").value);

    // Set the current sort
    const currentSort = "organizationName";
    localStorage.setItem('currentSort', currentSort);

    // Get the current order 
    const currentOrder = localStorage.getItem('currentOrder');

    // Toggle current order
    const updatedOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('currentOrder', updatedOrder)

    filter.page = currentPage;
    filter.skip = 10;
    filter.sort_ = currentSort;
    filter.order_= updatedOrder;
    if(localStorage.getItem('currentSearch')) {
        const currentSearch = localStorage.getItem('currentSearch')
        filter.organizationName = currentSearch;
     }
    fetchOrgPage(filter);

})

// Event listener for button to sort by number of users in an organization
document.getElementById('filterNumUsers').addEventListener("click", function(){

    let filter = {};

    // Get the current page 
    const currentPage = parseInt(document.getElementById("pageNumber").value);

    // Set the current sort
    const currentSort = "numberOfUsers";
    localStorage.setItem('currentSort', currentSort);

    // Get the current order 
    const currentOrder = localStorage.getItem('currentOrder');

    // Toggle current order
    const updatedOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('currentOrder', updatedOrder)

    filter.page = currentPage;
    filter.skip = 10;
    filter.sort_ = currentSort;
    filter.order_= updatedOrder;
    if(localStorage.getItem('currentSearch')) {
        const currentSearch = localStorage.getItem('currentSearch')
        filter.organizationName = currentSearch;
     }
    fetchOrgPage(filter);

})

// Event listener for the search bar
document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the value input into the search bar
    const searchInput = document.getElementById('searchbar').value;

    // Get the current sort, using organizationName as a default
    if(!localStorage.getItem('currentSort')) {
        localStorage.setItem('currentSort', 'organizationName');
     }
     const currentSort = localStorage.getItem('currentSort')

    // Set currentOrder back to ascending 
    localStorage.setItem('currentOrder', 'asc');
    
    // Set currentSearch
    localStorage.setItem('currentSearch', searchInput);

    // If the search is submitted with nothing in it, return the default page
    if (searchInput === '') {
        fetchOrgPage();
    }
    else {
        let filter = {};
        filter.page = 1;
        filter.skip = 10;
        filter.sort_ = currentSort;
        filter.order_ = 'asc';
        filter.organizationName = searchInput;
        fetchOrgPage(filter);
    }
});

// Event listener for button to submit advanced filters
document.getElementById('advancedFilterSubmit').addEventListener('click', function(){

    const filter = {};
    
    // Get information from form fields
    const currentPage = document.getElementById('pageNumber').value;
    const maxVal = document.getElementById('maxValue').value;
    const minVal = document.getElementById('minValue').value;
    const category = document.getElementById('category').value;


    filter.page = currentPage;
    filter.skip = 10;
    filter.sort_= category;
    filter.minVal_ = minVal;
    filter.maxVal_ = maxVal;

    fetchOrgPage(filter);

})

// Fetch default view when the page initially loads
window.onload = fetchOrgPage();