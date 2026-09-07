const yearElement =document.getElementById('current-year'); // this finds the current year element in the footer of html
const currentYear = new Date().getFullYear(); //this gets the current year from system date
yearElement.textContent = currentYear; // this changes the text to match the current year 

let currentSize = 140;
const myButton = document.getElementById('suprise-btn');
const resetButton = document.getElementById('reset-btn');
const resizeButton = document.getElementById('increase-btn');
const heroText = document.getElementById('hero-text');

if (myButton && resetButton && resizeButton && heroText) {
    myButton.addEventListener('click', function(){
         if (currentSize > 24) {
            currentSize = currentSize - 5;
            heroText.style.fontSize = currentSize + 'px';
        }
    });

    resetButton.addEventListener('click', function(){
        if (currentSize !== 140) {
            currentSize = 140;
            heroText.style.fontSize = currentSize + 'px';
        }
    });

    resizeButton.addEventListener('click', function(){
        if(currentSize <= 165){
            currentSize = currentSize + 10;
            heroText.style.fontSize = currentSize + 'px';
        }
    });
}

const themeButton = document.getElementById('dark-mode-btn');
const savedTheme = localStorage.getItem('siteTheme');
if (savedTheme === 'dark' || savedTheme === null) {
    document.body.classList.add('dark-mode');
    if (themeButton) themeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
}else {
    document.body.classList.remove('dark-mode');
    if (themeButton) themeButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

if (themeButton) {
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
}

const hamburger = document.getElementById('hamburger-btn');
const navlinks = document.getElementById('nav-links');
if (hamburger && navlinks) {
    hamburger.addEventListener ('click', function(){
        navlinks.classList.toggle('show-menu');
    });
}


const inputBox = document.getElementById('input-box');
const dateInput = document.getElementById('date-box');
const descBox = document.getElementById('desc-box');
const taskList = document.getElementById('task-list');
const successSound = new Audio('./media/pop.mp3');
const deleteSound = new Audio('./media/fahhh.mp3')

function addTask() {
    if(inputBox.value === '' || dateInput.value === '' || descBox.value === '') {
        alert('Please fill in all fields before adding a task.');
    }
    else {
        let li = document.createElement("li");
        let rawDate = document.getElementById("date-box").value;
        let formattedDate = rawDate.split("-").reverse().join("/");
        
        li.innerHTML = `
        <div class="task-content">
        <span class="task-date">${formattedDate}</span>
        <span class="task-title">${inputBox.value}</span>
        <span class="task-desc">${descBox.value}</span>
        </div>
        `;

        li.classList.add('pop-in');

        taskList.appendChild(li);
        // li.innerHTML = inputBox.value + " - " + dateInput.value + "-" + descBox.value;
        // taskList.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML ="\u00D7";
        span.className = "delete-btn";
        li.appendChild(span);
        successSound.currentTime = 0;
        successSound.play();
        showNotification("Task added successfully!");
    }

    inputBox.value = '';
    dateInput.value = '';
    descBox.value = '';
    saveData();
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message ;
    
    document.body.appendChild(toast);

    setTimeout(function(){
        toast.remove();
    }, 3000);
}

taskList.addEventListener("click", function(e){
    if(e.target.className === "delete-btn") {
         e.target.parentElement.remove();
         deleteSound.play();
         showNotification("Task removed!")
         saveData();
    }

    else {
        let li = e.target.closest('li'); 
        if(li) {
            li.classList.toggle("checked");
            showNotification("Task completed successfully!")
            saveData();
        }
    }
}, false);

function saveData() {
    localStorage.setItem("data", taskList.innerHTML);
};

function showTask() {
    taskList.innerHTML = localStorage.getItem("data"); 
}
showTask();