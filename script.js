const yearElement =document.getElementById('current-year'); // this finds the current year element in the footer of html
const currentYear = new Date().getFullYear(); //this gets the current year from system date
yearElement.textContent = currentYear; // this changes the text to match the current year 

let currentSize = 100;
const myButton = document.getElementById('suprise-btn');
const heroText = document.getElementById('hero-text');

myButton.addEventListener('click', function(){
     if (currentSize > 20) {
        currentSize = currentSize - 5;
        heroText.style.fontSize = currentSize + 'px';
    }
})

const themeButton = document.getElementById('dark-mode-btn');
const savedTheme = localStorage.getItem('dark-mode');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeButton.textContent = '<i class="fa-sun-o"></i>';
}

themeButton.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')){
        themeButton.textContent = '<i class="fa-moon-o"></i>';
        localStorage.setItem('siteTheme', 'dark');
    }

    else {
        themeButton.textContent = '<i class="fa-sun-o"></i>';
        localStorage.setItem('siteTheme', 'light');
    }
});