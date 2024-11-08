// Function to fetch a list of organizations from database in paginated form, based on front-end specified filter(s)

async function fetchOrgPage(filter) {

    
    try {
        let response;
        console.log('entered try block')
        console.log('filter' + JSON.stringify(filter))
        // If there are no params, fetch the first page with default number of results
        if(filter){
            // Convert json into URL Search format (string=x&page=y&etc...)
            const params = new URLSearchParams(filter).toString();
            console.log('page to fetch: ' + `/api/org/page?${params}`)
            response = await fetch(`/api/org/page?${params}`)
        } else {
            response = await fetch('/api/org/page'); // Default to fetching first x org results in alphabetical order
        }

        const orgs = await response.json();
        const orgList = document.getElementById('orgList');

        console.log(JSON.stringify(orgs.orgs))
        console.log(orgs.orgs.length)

        // Reset the table every time the next db page is fetched
        orgList.innerHTML = '';
        console.log('orgContainer should be reset')

        if(orgs.orgs.length > 0) {
            // Generate new divs to hold organization info
            orgs.orgs.forEach(org => {
                console.log('appending ' + org.organizationName)
                const orgDiv = document.createElement('div');
                orgDiv.className = 'user';
                orgDiv.innerHTML = `
                <span class="orgName">${org.organizationName}</span>
                <span class="userCount">${org.users.length}</span>
                <span class="cameraCount">${org.cameras.length}</span>
                <button class="detailsButton">More Details</button>
                `;
                orgList.appendChild(orgDiv);
            });
            console.log('orgList fully appended')
        } else {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'noResults';
            noResultsDiv.textContent = 'No results found';
            orgList.appendChild(noResultsDiv);
        }
        
        // Update current page
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

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const searchInput = document.getElementById('searchbar').value;


    if (searchInput === '') {
        fetchOrgPage();
    }
    else {
        let filter = {};
        console.log('searchInput: ' + searchInput);
        filter.page = 1;
        filter.skip = 2;
        filter.organizationName = searchInput;

        console.log(filter);
        fetchOrgPage(filter);
    }
});

document.getElementById('advancedFilterSubmit').addEventListener('click', function(){
    event.preventDefault();

    const filter = {};
    const currentPage = document.getElementById('pageNumber').value;
    const maxVal = document.getElementById('maxValue').value;
    const minVal = document.getElementById('minValue').value;
    const category = document.getElementById('category').value;


    filter.page = currentPage;
    filter.skip = 2;
    filter.sort_= category;
    filter.minVal_ = minVal;
    filter.maxVal_ = maxVal;
    
    
    console.log('fetching filter: ' + JSON.stringify(filter));

    fetchOrgPage(filter);

})

// Fetch orgs when the page loads
window.onload = fetchOrgPage();