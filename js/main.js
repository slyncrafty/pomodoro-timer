const timer = document.getElementById('timer');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const message = document.querySelector('.message');

timer.addEventListener('change', setTimer);
start.addEventListener('click', startTimer);
stop.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);

let interval = null, endTime = null;
let isRunning = false;

window.addEventListener('DOMContentLoaded', () => {
  timer.value = "25:00";
  setTimer(); 
});


function parseTimeInput(input) {
  const regex = /^(\d{1,2}):([0-5]?\d)$/;
  const match = input.match(regex);
  if(!match){
    message.textContent = 'Invalid Time! Please Try Again.'
    clearInterval(interval);
    return null;
  }
  [_, minutes, seconds] = match;
  minutes = parseInt(minutes, 10);
  seconds = parseInt(seconds, 10);
  // console.log(`${minutes}:${seconds}`)
  return minutes * 60 + seconds;
}

function formatTime(seconds){
  const min = Math.floor(seconds / 60).toString().padStart(2,"0")
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function setTimer(){
  const seconds = parseTimeInput(timer.value);
  if(!seconds) {
    timer.value = formatTime(initialTime);
    return;
  }
  timeLeft = seconds;
  initialTime = seconds;
  timer.value = formatTime(timeLeft);
}

function updateTimer(){
  timer.value = formatTime(timeLeft);
  message.textContent = 'Focus!'; 
}
function startTimer() {
  if(isRunning) return;
  setTimer();
  const now = Date.now();
  endTime = now + timeLeft * 1000;
  isRunning = true;
  timer.disabled = true;
  message.textContent = 'Focus!'; 

  interval = setInterval(() => {
    const currTime = Date.now();
    timeLeft = Math.max(0, Math.round((endTime - currTime) / 1000));
    updateTimer();
    if(timeLeft <= 3) {
      timer.style.color = "red";
    }
    if(timeLeft === 0){
      clearInterval(interval);
      isRunning = false;
      timer.style.color = "black";
      timer.disabled = false;
      // console.log("time's up");
      alertSound.play();
      message.textContent = 'Time is Up!'
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  timer.disabled = false;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  timeLeft = initialTime;
  updateTimer();
  timer.style.color = "black";
  timer.disabled = false;
}

// Color Picker
const bgColorPicker = document.getElementById('bg-color');
const ftColorPicker = document.getElementById('font-color');

bgColorPicker.addEventListener('input', () => {
  document.body.style.backgroundColor=bgColorPicker.value;
  timer.style.backgroundColor=bgColorPicker.value;
});

ftColorPicker.addEventListener('input', () => {
  timer.style.color = ftColorPicker.value;
})

// Alert Sound
const alertSound = new Audio('sounds/Magic_Chime.mp3'); 