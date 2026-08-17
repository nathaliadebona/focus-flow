const lightModeBtn = document.getElementById('light-mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
let theme = localStorage.getItem('theme') || "light";

if (theme === "dark") {
    document.body.classList.add('dark-mode');
}

updateThemeIcons();

function updateThemeIcons() {
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.classList.add('active');      
        lightModeBtn.classList.remove('active');  
    } else {
        lightModeBtn.classList.add('active');    
        darkModeBtn.classList.remove('active');  
    }
}

darkModeBtn.addEventListener('click', function() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', "dark");

    updateThemeIcons();
});

lightModeBtn.addEventListener('click', function() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', "light");

    updateThemeIcons();
});