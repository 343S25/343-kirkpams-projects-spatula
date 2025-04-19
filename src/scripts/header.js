// Main js file for the header

// Sets tasks button to switch to task settings page
document.getElementById('tasks').onclick = () => {
    if (window.location.href.slice(window.location.href.length - 10) == "tasks.html") {
        window.location.href = "index.html";
    } else {
        window.location.href = "tasks.html";
    }
};

document.getElementById('weather').onclick = () => {
    window.location.href = "https://www.wunderground.com/";
};

document.getElementById('logo').onclick = () => {
    window.location.href = "index.html";
};

