function openTab(tabName) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(tabName).style.display = "block";
}
