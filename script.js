const yearElement =document.getElementById('current-year'); // this finds the current year element in the footer of html
const currentYear = new Date().getFullYear(); //this gets the current year from system date
yearElement.textContent = currentYear; // this changes the text to match the current year 

let currentSize = 150;
const myButton = document.getElementById('suprise-btn');
const resetButton = document.getElementById('reset-btn');
const resizeButton = document.getElementById('increase-btn');
const heroText = document.getElementById('hero-text');

myButton.addEventListener('click', function(){
     if (currentSize > 24) {
        currentSize = currentSize - 5;
        heroText.style.fontSize = currentSize + 'px';
    }
});

resetButton.addEventListener('click', function(){
    if (currentSize !== 150) {
        currentSize = 150;
        heroText.style.fontSize = currentSize + 'px';
    }
});

resizeButton.addEventListener('click', function(){
    if(currentSize <= 165){
        currentSize = currentSize + 5;
        heroText.style.fontSize = currentSize + 'px';
    }
});

const themeButton = document.getElementById('dark-mode-btn');
const savedTheme = localStorage.getItem('dark-mode');
if (savedTheme === 'dark' || savedTheme === null) {
    document.body.classList.add('dark-mode');
    themeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeButton.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')){
        themeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('siteTheme', 'dark');
    }

    else {
        themeButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('siteTheme', 'light');
    }
});

const hamburger = document.getElementById('hamburger-btn');
const navlinks = document.getElementById('nav-links');
hamburger.addEventListener ('click', function(){
    navlinks.classList.toggle('show-menu');
});