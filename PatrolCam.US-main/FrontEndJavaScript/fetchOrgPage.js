async function fetchOrgPage() {



    try {
        const response = await fetch('/api/org/');
        const orgs = await response.json();
        const orgContainer = document.getElementById('orgList');
        
        orgs.forEach(org => {
            const orgDiv = document.createElement('div');
            orgDiv.className = 'user';
            orgDiv.innerHTML = `
                <span class="name">${org.organizationName}</span><br>
            `;
            orgContainer.appendChild(orgDiv);
        });
    } catch (error) {
        console.error('Error fetching orgs:', error);
    }
}

// Fetch users when the page loads
window.onload = fetchOrgPage;