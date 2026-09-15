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

if (tabs) {
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
})
};

//global storage keys for cross-page persistence
const end_time_key = 'timer-end-timestamp';
const running_key = 'timer-running';
const active_key = 'activeTimerMode';

//pop up for the timer
let popupDismissed = false;
const popup = document.getElementById('scrollPopUp');
const popupDisplay = document.getElementById('popup-timer-display');
const popupLabel = document.getElementById('popup-mode-label');

window.addEventListener('scroll', () => {
    if (popupDismissed || !popup) return;
    // const isRunning = localStorage.getItem(running_key) === 'true';

    if (window.scrollY > 300) {
    //     const sourceElement = document.querySelector('timer'); 

    // if (sourceElement && targetContainer) {
    //     targetContainer.innerHTML = sourceElement.innerHTML;
    // }

    popup.classList.add('show');
    } else {
        popup.classList.remove('show');
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

function formatSeconds(totalseconds) {
    const minutes = Math.floor(totalseconds/60);
    const seconds = totalseconds % 60;
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2, "0")}`;
}

//display updates
function updateTimer(){
    const formattedTime = formatSeconds(timeLeft);
    if(timer) timer.innerHTML = formattedTime;
    if(activeMode === 'pomodoro' && popupDisplay) popupDisplay.textContent = formattedTime;
}

function updatesbTimer(){
    const formattedTime = formatSeconds(sbtimeLeft);
    if(sbTimer) sbTimer.innerHTML = formattedTime;
    if (activeMode == 'short' && popupDisplay) popupDisplay.textContent = formattedTime;
}

function updatelbTimer(){
    const formattedTime = formatSeconds(lbtimeLeft);
    if(lbTimer) lbTimer.innerHTML = formattedTime;
    if(activeMode == 'long' && popupDisplay) popupDisplay.textContent = formattedTime;
}

function updatePopupLabel() {
    if(!popupLabel) return;
    if (activeMode == 'pomodoro') popupLabel.textContent = 'Pomodoro';
    else if (activeMode == 'short') popupLabel.textContent = 'Short Break';
    else if (activeMode == 'long') popupLabel.textContent = 'Long Break'
}

//reset all logic
function resetAll(){
    clearInterval(timeInterval);
    timeInterval = null;

    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);

    timeLeft = pomo_time;
    sbtimeLeft = sb_time;
    lbtimeLeft = lb_time;

    updateTimer();
    updatelbTimer();
    updatesbTimer();
    saveData();
}

function startCountdown(durationSecs, modeName, startMessage, finishSound, finishMessage) {
    resetAll();
    activeMode = modeName;
    updatePopupLabel();

    const targetEndTime = Date.now() + (durationSecs * 1000);
    localStorage.setItem(end_time_key, targetEndTime);
    localStorage.setItem(running_key, 'true');
    localStorage.setItem(active_key, activeMode);

    showNotification(startMessage);
    timestartSound.play();

    runTimerLoop(targetEndTime, finishSound, finishMessage, durationSecs);
}

function runTimerLoop(targetEndTime, finishSound, finishMessage, defaultDuration) {
    clearInterval(timeInterval);

    if (popup && !popupDismissed && window.scrollY > 300) {
        popup.classList.add('show');
    }

    const tick = () => {
        const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000));

        if (activeMode === 'pomodoro') timeLeft = remaining;
        else if (activeMode === 'short') sbtimeLeft = remaining;
        else if (activeMode === 'long') lbtimeLeft = remaining;

        updateTimer();
        updatesbTimer();
        updatelbTimer();
        saveData();

        if (remaining <= 0) {
            clearInterval(timeInterval);
            localStorage.setItem(running_key, 'false');
            localStorage.removeItem(end_time_key);

            if (finishSound) timesupSound.play();
            showNotification(finishMessage || "Time's Up!");

            if (activeMode === 'pomodoro') timeLeft = defaultDuration;
            else if (activeMode === 'short') sbtimeLeft = defaultDuration;
            else if (activeMode === 'long') lbtimeLeft = defaultDuration;

            updateTimer();
            updatesbTimer();
            updatelbTimer();
            saveData();
        }
    };

    tick();
    timeInterval = setInterval(tick, 500);
}

//pomodoro timer logic

function startTimer(){
    startCountdown(pomo_time, 'pomodoro', 'Pomodoro Started', timesupSound, "Time's Up");
}

function stopTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    showNotification("Pomodoro Complete!");
    saveData();
}

function resetTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    timeLeft = pomo_time;
    showNotification('Pomodoro Reset')
    updateTimer();
    saveData();
}

//short break timer 
function startsbTimer(){
    startCountdown(sb_time, 'short', 'Short Break Started', breakoverSound, "Short Break Over");
}

function stopsbTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    showNotification('Timer Stopped');
    saveData();
}

function resetsbTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    sbtimeLeft = sb_time;
    showNotification('Timer Reset')
    updatesbTimer();
    saveData();
}

//long break timer 
function startlbTimer(){
    startCountdown(lb_time, 'long', 'Long Break Over', breakoverSound, "Long Break Over");
}

function stoplbTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    showNotification('Timer Stopped');
    saveData();
}

function resetlbTimer(){
    clearInterval(timeInterval);
    localStorage.setItem(running_key, 'false');
    localStorage.removeItem(end_time_key);
    lbtimeLeft = lb_time;
    showNotification('Timer Reset')
    updatelbTimer();
    saveData();
}

// Timer Button Listeners
const pmStart = document.getElementById('pm-start');
const pmStop = document.getElementById('pm-stop');
const pmReset = document.getElementById('pm-reset');
if (pmStart) pmStart.addEventListener('click', startTimer);
if (pmStop) pmStop.addEventListener('click', stopTimer);
if (pmReset) pmReset.addEventListener('click', resetTimer);

const sbStart = document.getElementById('sb-start');
const sbStop = document.getElementById('sb-stop');
const sbReset = document.getElementById('sb-reset');
if (sbStart) sbStart.addEventListener('click', startsbTimer);
if (sbStop) sbStop.addEventListener('click', stopsbTimer);
if (sbReset) sbReset.addEventListener('click', resetsbTimer);

const lbStart = document.getElementById('lb-start');
const lbStop = document.getElementById('lb-stop');
const lbReset = document.getElementById('lb-reset');
if (lbStart) lbStart.addEventListener('click', startlbTimer);
if (lbStop) lbStop.addEventListener('click', stoplbTimer);
if (lbReset) lbReset.addEventListener('click', resetlbTimer);

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
        const dd = String(today.getDate()).padStart(2, "0");
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

if(taskList){
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
}

function saveData() {
    if (taskList) {
        localStorage.setItem('taskData', taskList.innerHTML);
    }
    localStorage.setItem(active_key, activeMode);
    localStorage.setItem('pomoState', timeLeft);
    localStorage.setItem('shortState', sbtimeLeft);
    localStorage.setItem('longState', lbtimeLeft);
}

function loadData() {
    if (taskList && localStorage.getItem('taskData')) {
        taskList.innerHTML = localStorage.getItem('taskData');
    }

    if (localStorage.getItem('pomoState')) timeLeft = parseInt(localStorage.getItem('pomoState'), 10);
    if (localStorage.getItem('shortState')) sbtimeLeft = parseInt(localStorage.getItem('shortState'), 10);
    if (localStorage.getItem('longState')) lbtimeLeft = parseInt(localStorage.getItem('longState'), 10);

    const savedMode = localStorage.getItem(active_key);
    if (savedMode) {
        activeMode = savedMode;
    }
    updatePopupLabel();

    const isRunning = localStorage.getItem(running_key) === 'true';
    const savedEndTime = parseInt(localStorage.getItem(end_time_key), 10);

    if (isRunning && savedEndTime) {
        const remaining = Math.max(0, Math.round((savedEndTime - Date.now()) / 1000));
        
        if (remaining > 0) {
            if (popup && !popupDismissed && window.scrollY > 300) {
                popup.classList.add('show');
            }
            
            let sound = timesupSound;
            let msg = "Time's Up";
            let defaultDur = pomo_time;

            if (activeMode === 'short') {
                sound = breakoverSound;
                msg = "Break's Over";
                defaultDur = sb_time;
            } else if (activeMode === 'long') {
                sound = breakoverSound;
                msg = "Break's Over";
                defaultDur = lb_time;
            }

            runTimerLoop(savedEndTime, sound, msg, defaultDur);
        } else {
            localStorage.setItem(running_key, 'false');
            localStorage.removeItem(end_time_key);
            updateTimer();
            updatesbTimer();
            updatelbTimer();
        }
    } else {
        updateTimer();
        updatesbTimer();
        updatelbTimer();
    }
}

loadData();