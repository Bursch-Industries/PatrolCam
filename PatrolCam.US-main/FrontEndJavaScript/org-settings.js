function openTab(tabName) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(tabName).style.display = "block";
}
// Toggle accordion function
function toggleAccordion(element) {
    const content = element.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
    const toggleButton = element.querySelector('.toggle-button');
    toggleButton.textContent = toggleButton.textContent === "▼" ? "▲" : "▼";
}

// Fetch officer data from the backend
async function fetchOfficerData(officerId) {
    try {
        const response = await fetch(`/api/officer/${officerId}`);
        const data = await response.json();

        // Populate fields
        document.getElementById(`officer-name-${officerId}`).innerText = data.name;
        document.getElementById(`email-${officerId}`).value = data.email;
        document.getElementById(`password-${officerId}`).value = data.password;
        document.getElementById(`lastLogin-${officerId}`).value = data.lastLogin;
    } catch (error) {
        console.error("Error fetching officer data:", error);
    }
}

// Save changes
async function saveChanges(officerId) {
    const email = document.getElementById(`email-${officerId}`).value;
    const password = document.getElementById(`password-${officerId}`).value;

    try {
        await fetch(`/api/officer/${officerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        alert("Changes saved successfully.");
    } catch (error) {
        console.error("Error saving changes:", error);
    }
}

// Call fetchOfficerData to load data when the page loads
document.addEventListener("DOMContentLoaded", () => fetchOfficerData("officer-id"));

