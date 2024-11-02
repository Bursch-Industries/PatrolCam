
    fetch('/navbar')
    .then(response => response.text())
    .then(data => {
        console.log(data);
        document.getElementById('navbar').innerHTML = data;
    });
