const focusTime = document.getElementById('focus-time');
const breakTime = document.getElementById('break-time');
const timer = document.querySelector('.timer');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const defaultBtn = document.getElementById('default-btn');
const message = document.querySelector('.message');
start.addEventListener('click', startTimer);
stop.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);

defaultBtn.addEventListener('click', () => {
  focusTime.value = '25:00';
  breakTime.value = '05:00';
});

let interval = null, endTime = null;
let isRunning = false, isBreak = false;
let timeLeft = 0;

// Event Listeners

window.addEventListener('DOMContentLoaded', () => {
  loadSavedTimes();
  resetTimer(); 
});

focusTime.addEventListener('change', () => setTimer(focusTime));
breakTime.addEventListener('change', () => setTimer(breakTime));

function loadSavedTimes() {
  const storeFocus = localStorage.getItem('focusTime') || "25:00";
  const storeBreak = localStorage.getItem('breakTime') || "05:00";
  focusTime.value = storeFocus;
  breakTime.value = storeBreak;
}

function saveTimes() {
  localStorage.setItem('focusTime', focusTime.value);
  localStorage.setItem('breakTime', breakTime.value);
}

// Format & Parse Input
function parseTimeInput(input) {
  const regex = /^(\d{1,2}):([0-5]?\d)$/;
  const match = input.match(regex);
  if(!match){
    message.textContent = 'Invalid Time! Please Try Again.'
    return null;
  }
  [_, minutes, seconds] = match;
  minutes = parseInt(minutes, 10);
  seconds = parseInt(seconds, 10);
  if (seconds > 59 || seconds > 59) {
    message.textContent = 'Invalid Time! Please Try Again.';
    return null;
  } 
  // console.log(`${minutes}:${seconds}`)
  message.textContent = ' ';
  return minutes * 60 + seconds;
}

function formatTime(seconds){
  const min = Math.floor(seconds / 60).toString().padStart(2,"0")
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function setTimer(inputElem){
  const seconds = parseTimeInput(inputElem.value);
  if(!seconds) {
    inputElem.value = formatTime(0);
    return;
  }
  timeLeft = seconds;
  inputElem.value = formatTime(seconds);
 }

function updateTimer(){
  timer.value = formatTime(timeLeft);
}

function applyFocusMode() {
  document.body.classList.remove('break-mode');
  message.textContent = 'Focus! 🔥🔥🔥'; 
}

function applyBreakMode() {
  document.body.classList.add('break-mode');
  message.textContent = '👾👾👾 Break Time 👾👾👾'
  breakTime.value = "BREAK" 
}

function startTimer() {
  if(isRunning) return;
  isRunning = true;
  isBreak = false;
  saveTimes();
  startMode(parseTimeInput(focusTime.value), "Focus");
}

function startMode(seconds, modeName) {
  timeLeft = seconds;
  const now = Date.now();
  endTime = now + timeLeft * 1000;

  if(modeName === "Focus") {
    applyFocusMode();
  } else {
    applyBreakMode();
  }
  
  focusTime.disabled = true;
  breakTime.disabled = true;
  clearInterval(interval);
  interval = setInterval(() => {
    const currTime = Date.now();
    timeLeft = Math.max(0, Math.round((endTime - currTime) / 1000));
    updateTimer();

    if(timeLeft <= 3) {
      timer.style.color = "red";
      document.body.classList.add("blink-bg");
    }

    if(timeLeft === 0){
      clearInterval(interval);
      isRunning = false;
      timer.style.color = "";
      document.body.classList.remove("blink-bg");

      if(!isBreak) {
        isBreak=true;
        alertSound.play();
        startMode(parseTimeInput(breakTime.value), "Break");
      } else {
        tripleBeep();
        focusTime.disabled = false;
        breakTime.disabled = false;
        message.textContent = 'Session Complete 🎉🎉🎉'
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  focusTime.disabled = false;
  breakTime.disabled = false;
  message.textContent = 'Session Stopped'
  document.body.classList.remove("blink-bg");
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  isBreak = false;
  document.body.classList.remove('blink-bg');
  applyFocusMode();
  loadSavedTimes();
  timeLeft = parseTimeInput(focusTime.value);
  updateTimer();
  timer.style.color = "";
  focusTime.disabled = false;
  breakTime.disabled = false;
  
}

// Color Picker
const bgColorPicker = document.getElementById('bg-color');
const ftColorPicker = document.getElementById('font-color');

bgColorPicker.addEventListener('input', () => {
  document.body.style.backgroundColor=bgColorPicker.value;
  document.querySelector('.timer').style.backgroundColor=bgColorPicker.value;
});

ftColorPicker.addEventListener('input', () => {
  timer.style.color = ftColorPicker.value;
})

// Alert Sound
const alertSound = new Audio('sounds/Magic_Chime.mp3'); 

function tripleBeep() {
  const ctx = new AudioContext();
  const factor = 0.5

  for (let i = 0; i < 1; i++) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'cosine';
    oscillator.frequency.setValueAtTime(500, ctx.currentTime + i * factor); 

    gain.gain.setValueAtTime(1, ctx.currentTime + i * factor);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * factor + 0.5);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime + i * factor);
    oscillator.stop(ctx.currentTime + i * factor + 0.6);
  }
}