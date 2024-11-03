

async function fetchOrgPage(page, limit) {

    try {
        let response;

        if(page && limit){
            response = await fetch(`/api/org/page?page=${page}&limit=${limit}`)
        } else {
            response = await fetch('/api/org/page');
        }

        

        const orgs = await response.json();
        const orgContainer = document.getElementById('orgList');

        console.log('Response Total Pages: ' + orgs.totalPages)

        orgContainer.innerHTML = '';
        
        orgs.orgs.forEach(org => {
            const orgDiv = document.createElement('div');
            orgDiv.className = 'user';
            orgDiv.innerHTML = `
                <span class="name">${org.organizationName}</span><br>
            `;
            orgContainer.appendChild(orgDiv);
        });

        document.getElementById('pageNumber').value = orgs.page;
        document.getElementById('maxPages').textContent = orgs.totalPages;

    } catch (error) {
        console.error('Error fetching orgs:', error);
    }
}

document.getElementById('nextPage').addEventListener("click", function() {
    const currentPage = parseInt(document.getElementById("pageNumber").value);
    const totalPages = parseInt(document.getElementById('maxPages').textContent);
    if(currentPage < totalPages){
        const nextPage = currentPage + 1;
        fetchOrgPage(nextPage, 2);
    } else {
        return;
    }
    
})

document.getElementById('previousPage').addEventListener("click", function() {
    const currentPage = parseInt(document.getElementById("pageNumber").value);
    if(currentPage > 1){
        const previousPage = currentPage - 1;
        fetchOrgPage(previousPage, 2);
    } else {
        return;
    }
})


// Fetch orgs when the page loads
window.onload = fetchOrgPage();