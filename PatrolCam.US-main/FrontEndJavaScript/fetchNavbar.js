/* This script fetches the navbar. As there is a modal being fetched with the navbar, all the modal JS is here as well. When separating the modal JS from this file, 
the HTML will often fail to load fast enough and "getElementById" sees "null". Buckle in. 
*/

// Ask the server for a navbar
fetch('/navbar')
    // Served an HTML file, set the plain text as the response
    .then(response => response.text())
    // The page calling this script will have a header with id = 'navbar'. Put the just-served HTML text in that header element
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
        
        // Custom Event to notify the navbar is loaded
        document.dispatchEvent(new Event('navbarLoaded'));

        // Adds a listener to the modal button that redirects to the userSettings page
        document.getElementById("settingsButton").addEventListener("click", function() {
            window.location.href = "./userSettings"; // Redirect to user settings
        });

        // Logout button API POST
        document.getElementById("logoutButton").addEventListener("click", function() {
            fetch('./login/logout',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                }
            )
            .then(response => {
                console.log(response);
                if (response.ok) {
                    window.location.href = '/login'; // Redirect to login page
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });

        // Adds an event listener to the profile icon that toggles modal visibility
        document.getElementById('profileIcon').addEventListener('click', function() 
        {
            const modal = document.getElementById('profile-modal');
            if (modal.style.display === 'none' || modal.style.display === '') {
                modal.style.display = 'block';
            } else {
                modal.style.display = 'none';
            }
        });

        // Adds an event listener to the 'x' button in the modal that closes the modal
        const closeButton = document.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            document.getElementById('profile-modal').style.display = 'none';
        });

    })
    .catch(error => console.error('Error fetching navbar:', error));
