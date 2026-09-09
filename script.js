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

//tabs section logic 
const tabs = document.querySelector(".tabs");
const btns = document.querySelectorAll(".btn");
const content = document.querySelectorAll(".content");

tabs.addEventListener("click", function(e){
    const id = e.target.dataset.id;
    if (id){
        //remove selected from buttons 
        btns.forEach(function(btn){
            btn.classList.remove("live");
        });
        e.target.classList.add("live");
        content.forEach(function(content){
            content.classList.remove("live");
        });

        const element = document.getElementById(id);
        element.classList.add("live");
    }
});

//pomodoro timer logic
const startTime = document.getElementById("start");
const stopTime = document.getElementById ('stop');
const resetTime = document.getElementById('reset');
const timer = document.getElementById('pm-timer');
const timestartSound = new Audio('./media/ding.mp3');
const timesupSound = new Audio('./media/ohyeah.mp3');

let interval;
let timeLeft = 1500;

function updateTimer(){
    let minutes = Math.floor (timeLeft/60);
    let seconds = timeLeft%60;
    let formattedTime = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    timer.innerHTML = formattedTime;

}

function startTimer(){
    clearInterval(interval);
    showNotification("Timer Started!");
    timestartSound.play();

    interval = setInterval(()=> {timeLeft--;
    updateTimer();
    saveData();
    if (timeLeft === 0){
        clearInterval(interval);
        showNotification("Time's Up");
        timesupSound.play();
        timeLeft = 1500;
        updateTimer();
        saveData();
    }
},1000);
}

function stopTimer(){
    clearInterval(interval);
    showNotification("Timer Stopped!");
    saveData();
}

function resetTimer(){
    clearInterval(interval);
    timeLeft = 1500;
    showNotification("Timer Reset!")
    updateTimer();
    saveData();
}

startTime.addEventListener("click", startTimer);
stopTime.addEventListener("click", stopTimer);
resetTime.addEventListener("click", resetTimer);

//short break timer logic
const startShortBreak = document.getElementById('sb-start');
const stopShortBreak = document.getElementById('sb-stop');
const resetShortBreak = document.getElementById('sb-reset');
const sbTimer = document.getElementById('sb-timer');

let sbinterval;
let sbtimeLeft = 300;

function updatesbTimer(){
    let sbminutes = Math.floor (sbtimeLeft/60);
    let sbseconds = sbtimeLeft%60;
    let sbformattedTime = `${sbminutes.toString().padStart(2,'0')}:${sbseconds.toString().padStart(2,'0')}`;
    sbTimer.innerHTML = sbformattedTime;
}

function startsbTimer(){
    clearInterval(sbinterval);
    showNotification('Timer Started!');
    timestartSound.play();

    sbinterval = setInterval(()=> {sbtimeLeft--;
        updatesbTimer();
        saveData();

        if (sbtimeLeft === 0){
            clearInterval(sbinterval);
            showNotification("Time's Up");
            timesupSound.play();
            sbtimeLeft = 300;
            updatesbTimer();
            saveData();
        }
    },1000);
}

function stopsbTimer(){
    clearInterval(sbinterval);
    showNotification('Timer Stopped');
    saveData();
}

function resetsbTimer(){
    clearInterval(sbinterval);
    sbtimeLeft = 300;
    showNotification('Timer Reset')
    updatesbTimer();
    saveData();
}

startShortBreak.addEventListener("click", startsbTimer);
stopShortBreak.addEventListener("click",stopsbTimer);
resetShortBreak.addEventListener("click", resetsbTimer);

//long break timer logic
const startLongBreak = document.getElementById('lb-start');
const stopLongBreak = document.getElementById('lb-stop');
const resetLongBreak = document.getElementById('lb-reset');
const lbTimer = document.getElementById('lb-timer');

let lbinterval;
let lbtimeLeft = 900;

function updatelbTimer(){
    let lbminutes = Math.floor (lbtimeLeft/60);
    let lbseconds = lbtimeLeft%60;
    let lbformattedTime = `${lbminutes.toString().padStart(2,'0')}:${lbseconds.toString().padStart(2,'0')}`;
    lbTimer.innerHTML = lbformattedTime;
}

function startlbTimer(){
    clearInterval(lbinterval);
    showNotification('Timer Started!');
    timestartSound.play();

    lbinterval = setInterval(()=> {lbtimeLeft--;
        updatelbTimer();
        saveData();

        if (lbtimeLeft === 0){
            clearInterval(lbinterval);
            showNotification("Time's Up");
            timesupSound.play();
            lbtimeLeft = 300;
            updatelbTimer();
            saveData();
        }
    },1000);
}

function stoplbTimer(){
    clearInterval(lbinterval);
    showNotification('Timer Stopped');
    saveData();
}

function resetlbTimer(){
    clearInterval(lbinterval);
    lbtimeLeft = 900;
    showNotification('Timer Reset')
    updatelbTimer();
    saveData();
}

startLongBreak.addEventListener("click", startlbTimer);
stopLongBreak.addEventListener("click",stoplbTimer);
resetLongBreak.addEventListener("click", resetlbTimer);

//task tracer logic
const inputBox = document.getElementById('input-box');
const dateInput = document.getElementById('date-box');
const descBox = document.getElementById('desc-box');
const taskList = document.getElementById('task-list');
const successSound = new Audio('./media/ding.mp3');
const deleteSound = new Audio('./media/fahhh.mp3');
const completeSound = new Audio('./media/wow.mp3');

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
        // li.classList.add('pop-in');

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
         saveData();
         deleteSound.play();
         showNotification("Task removed!");
         
    }

    else {
        let li = e.target.closest('li'); 
        if(li) {
            li.classList.toggle("checked");
            saveData();
            showNotification("Task completed successfully!");
            completeSound.play();
            
        }
    }
}, false);

function saveData() {
    localStorage.setItem("taskData", taskList.innerHTML);
    localStorage.setItem("timerState",timeLeft);
};

function loadData() {
   console.log("1. loadData function started!");

   // Load the task list
   if (localStorage.getItem("taskData")){
       taskList.innerHTML = localStorage.getItem("taskData");
       console.log("2. Tasks loaded successfully.");
   } 

   // Load the timer
   const savedTime = localStorage.getItem("timerState");
   console.log("3. Found saved time in memory:", savedTime);

   if (savedTime !== null && savedTime !== "NaN") {
       // Convert string to integer
       timeLeft = parseInt(savedTime); 
       console.log("4. timeLeft math variable updated to:", timeLeft);
       
       updateTimer();
   } else {
       console.log("5. No valid timer found. Starting fresh.");
   }
}

loadData();