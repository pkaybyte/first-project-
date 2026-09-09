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

//pop up for the timer
let popupDismissed = false;
const popup = document.getElementById('scrollPopUp');
const popupDisplay = document.getElementById('popup-timer-display');
const popupLabel = document.getElementById('popup-label');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300 && !popupDismissed) {
        const sourceElement = document.querySelector('timer');

    if (sourceElement && targetContainer) {
        targetContainer.innerHTML = sourceElement.innerHTML;
    }

    popup.classList.add('show');
    }
});

function closePopup() {
    popup.classList.remove('show');
    popupDismissed = true;
}

//sound references 
const timestartSound = new Audio('./media/ding.mp3');
const timesupSound = new Audio('./media/ohyeah.mp3');
const breakoverSound = new Audio('./media/whistle.mp3');

//track active mode (pomodoro/shortbreak/longbreak)
let activeMode = "pomodoro";

//master interval
let timeInterval = null;

//set time in seconds for all timers
const pomo_time = 1500;
const lb_time = 900;
const sb_time = 300;

//current countdown variables 
let timeLeft = pomo_time;
let lbtimeLeft = lb_time;
let sbtimeLeft = sb_time;

const timer = document.getElementById('pm-timer');
const sbTimer = document.getElementById('sb-timer');
const lbTimer = document.getElementById('lb-timer');

//display updates
function updateTimer(){
    let minutes = Math.floor (timeLeft/60);
    let seconds = timeLeft%60;
    let formattedTime = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    if(timer) timer.innerHTML = formattedTime;
    if(activeMode === 'pomodoro' && popupDisplay) popupDisplay.textContent = formattedTime;
}

function updatesbTimer(){
    let sbminutes = Math.floor (sbtimeLeft/60);
    let sbseconds = sbtimeLeft%60;
    let formattedTime = `${sbminutes.toString().padStart(2,'0')}:${sbseconds.toString().padStart(2,'0')}`;
    if(sbTimer) sbTimer.innerHTML = formattedTime;
    if (activeMode == 'short' && popupDisplay) popupDisplay.textContent = formattedTime;
}

function updatelbTimer(){
    let lbminutes = Math.floor (lbtimeLeft/60);
    let lbseconds = lbtimeLeft%60;
    let formattedTime = `${lbminutes.toString().padStart(2,'0')}:${lbseconds.toString().padStart(2,'0')}`;
    if(lbTimer) lbTimer.innerHTML = formattedTime;
    if(activeMode == 'long' && popupDisplay) popupDisplay.textContent = formattedTime;
}

//reset all logic
function resetAll(){
    clearInterval(timeInterval);
    timeInterval = null;

    timeLeft = pomo_time;
    sbtimeLeft = sb_time;
    lbtimeLeft = lb_time;

    showNotification("Timer Reset!")
    updateTimer();
    updatelbTimer();
    updatesbTimer();
    saveData();
}

//pomodoro timer logic

function startTimer(){
    resetAll();
    activeMode = 'pomodoro'
    if (popupLabel) popupLabel.textContent('Pomodoro');
    showNotification("Pomodoro Started!");
    timestartSound.play();

    interval = setInterval(()=> {
    timeLeft--;
    updateTimer();
    saveData();

    if (timeLeft === 0){
        clearInterval(timeInterval);
        showNotification("Time's Up");
        timesupSound.play();
        timeLeft = pomo_time;
        updateTimer();
        saveData();
    }
},1000);
}

function stopTimer(){
    clearInterval(interval);
    showNotification("Pomodoro Complete!");
    saveData();
}

function resetTimer(){
    clearInterval(timeInterval);
    timeLeft = pomo_time;
    showNotification('Pomodoro Reset')
    updateTimer();
    saveData();
}

//short break timer 
function startsbTimer(){
    resetAll();
    activeMode = 'short';
    if(popupLabel) popupLabel.textContent = 'Short Break';

    showNotification('Short Break Started!');
    timestartSound.play();

    sbinterval = setInterval(()=> {
        sbtimeLeft--;
        updatesbTimer();
        saveData();

        if (sbtimeLeft === 0){
            clearInterval(timeInterval);
            showNotification("Break's Over");
            breakoverSound.play();
            sbtimeLeft = sb_time;
            updatesbTimer();
            saveData();
        }
    },1000);
}

function stopsbTimer(){
    clearInterval(timeInterval);
    showNotification('Timer Stopped');
    saveData();
}

function resetsbTimer(){
    clearInterval(timeInterval);
    sbtimeLeft = sb_time;
    showNotification('Timer Reset')
    updatesbTimer();
    saveData();
}

//long break timer 
function startlbTimer(){
    resetAll();
    activeMode = 'long';
    if(popupLabel) popupLabel.textContent = 'Long Break';

    showNotification('Long Break Started!');
    timestartSound.play();

    lbinterval = setInterval(()=> {
        lbtimeLeft--;
        updatelbTimer();
        saveData();

        if (lbtimeLeft === 0){
            clearInterval(timeInterval);
            showNotification("Break's Over");
            breakoverSound.play();
            lbtimeLeft = sb_time;
            updatelbTimer();
            saveData();
        }
    },1000);
}

function stoplbTimer(){
    clearInterval(timeInterval);
    showNotification('Timer Stopped');
    saveData();
}

function resetlbTimer(){
    clearInterval(timeInterval);
    lbtimeLeft = sb_time;
    showNotification('Timer Reset')
    updatelbTimer();
    saveData();
}

// Button Bindings
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

document.getElementById('sb-start').addEventListener('click', startsbTimer);
document.getElementById('sb-stop').addEventListener('click', stopsbTimer);
document.getElementById('sb-reset').addEventListener('click', resetsbTimer);

document.getElementById('lb-start').addEventListener('click', startlbTimer);
document.getElementById('lb-stop').addEventListener('click', stoplbTimer);
document.getElementById('lb-reset').addEventListener('click', resetlbTimer);


//task tracer logic
const inputBox = document.getElementById('input-box');
const dateInput = document.getElementById('date-box');
const descBox = document.getElementById('desc-box');
const taskList = document.getElementById('task-list');
const successSound = new Audio('./media/ding.mp3');
const deleteSound = new Audio('./media/fahhh.mp3');
const completeSound = new Audio('./media/wow.mp3');

//automatic date entry for task tracer
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        if (dateInput) {
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }

function addTask() {
    if(inputBox.value === '' || dateInput.value === '' || descBox.value === '') {
        alert('Please fill in all fields before adding a task.');
    }
    else {
        let li = document.createElement("li");
        // let rawDate = document.getElementById("date-box").value;
        let formattedDate = dateInput.value.split("-").reverse().join("/");

        // document.getElementById('date-box').value = autoDate;

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
    dateInput.value = `${yyyy}-${mm}-${dd}`;
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
  localStorage.setItem('taskData', taskList.innerHTML);
  localStorage.setItem('activeTimerMode', activeMode);
  localStorage.setItem('pomoState', timeLeft);
  localStorage.setItem('shortState', sbtimeLeft);
  localStorage.setItem('longState', lbtimeLeft);
}

function loadData() {
  if (localStorage.getItem('taskData')) {
    taskList.innerHTML = localStorage.getItem('taskData');
  }

  if (localStorage.getItem('pomoState')) timeLeft = parseInt(localStorage.getItem('pomoState'));
  if (localStorage.getItem('shortState')) sbtimeLeft = parseInt(localStorage.getItem('shortState'));
  if (localStorage.getItem('longState')) lbtimeLeft = parseInt(localStorage.getItem('longState'));

  const savedMode = localStorage.getItem('activeTimerMode');
  if (savedMode) {
    activeMode = savedMode;
    if (popupLabel) {
      popupLabel.textContent =
        savedMode === 'pomodoro' ? 'Pomodoro' : savedMode === 'short' ? 'Short Break' : 'Long Break';
    }
  }

  updateTimer();
  updatesbTimer();
  updatelbTimer();
}

loadData();