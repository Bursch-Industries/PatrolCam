
async function fetchOrgPage(filter) {

    
    try {
        let response;

        // If there are no params, fetch the first page with default number of results
        if(filter){
            // Convert json into URL Search format (string=x&page=y&etc...)
            const params = new URLSearchParams(filter).toString();
            response = await fetch(`/api/org/page?${params}`)
        } else {
            response = await fetch('/api/org/page');
        }

        const orgs = await response.json();
        const orgContainer = document.getElementById('orgList');

        // Reset the table every time the next db page is fetched
        orgContainer.innerHTML = '';
        
        // Generate new divs to hold organization info
        orgs.orgs.forEach(org => {
            const orgDiv = document.createElement('div');
            orgDiv.className = 'user';
            orgDiv.innerHTML = `
            <span class="orgName">${org.organizationName}</span>
            <span class="userCount">${org.users.length}</span>
            <span class="cameraCount">${org.cameras.length}</span>
            <button class="detailsButton">More Details</button>
            `;
            orgContainer.appendChild(orgDiv);
        });

        // Update current page
        document.getElementById('pageNumber').value = orgs.page;

        // Update total pages
        document.getElementById('maxPages').textContent = orgs.totalPages;



    } catch (error) {
        console.error('Error fetching orgs:', error);
    }
}

document.getElementById('nextPage').addEventListener("click", function() {

    let filter = {};

    // Get the current page
    const currentPage = parseInt(document.getElementById("pageNumber").value);

    // Get the current sort
    const currentSort = localStorage.getItem('currentSort')

    // Get the current order
    const currentOrder = localStorage.getItem('currentOrder');
    
    
    // Current page must be less than the total pages in order to get next page.
    const totalPages = parseInt(document.getElementById('maxPages').textContent);
    if(currentPage < totalPages){
        filter.page = currentPage + 1;
        filter.skip = 2;
        filter.sort_ = currentSort;
        filter.order_ = currentOrder;
        fetchOrgPage(filter);
    } else {
        return;
    }
    
})

// Functionality for previous page button
document.getElementById('previousPage').addEventListener("click", function() {

    let filter = {};
    // Get the current page
    const currentPage = parseInt(document.getElementById("pageNumber").value);

     // Get the current sort
     const currentSort = localStorage.getItem('currentSort')

     // Get the current order
     const currentOrder = localStorage.getItem('currentOrder');

    // Current page must be greater than 1 in order to go a previous page
    if(currentPage > 1){
        filter.page = currentPage - 1;
        filter.skip = 2;
        filter.sort_ = currentSort;
        filter.order_ = currentOrder;
        fetchOrgPage(filter);
    } else {
        return;
    }
})

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
    filter.skip = 2;
    filter.sort_ = currentSort;
    filter.order_= updatedOrder;
    fetchOrgPage(filter);

})


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
    filter.skip = 2;
    filter.sort_ = currentSort;
    filter.order_= updatedOrder;
    fetchOrgPage(filter);

})

document.getElementById('filterNumCameras').addEventListener("click", function(){

    let filter = {};

    // Get the current page 
    const currentPage = parseInt(document.getElementById("pageNumber").value);

    // Set the current sort
    const currentSort = "numberOfCameras";
    localStorage.setItem('currentSort', currentSort);

    // Get the current order 
    const currentOrder = localStorage.getItem('currentOrder');

    // Toggle current order
    const updatedOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('currentOrder', updatedOrder)

    filter.page = currentPage;
    filter.skip = 2;
    filter.sort_ = currentSort;
    filter.order_= updatedOrder;
    fetchOrgPage(filter);

})

// Fetch orgs when the page loads
window.onload = fetchOrgPage();