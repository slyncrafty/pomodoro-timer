const timer = document.getElementById('timer');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const message = document.querySelector('.message');

timer.addEventListener('change', setTimer);
start.addEventListener('click', startTimer);
stop.addEventListener('click', stopTimer);
reset.addEventListener('click', resetTimer);

let interval;
let initialTime = 0, timeLeft = 0;


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
}
function startTimer() {
  if(interval) return;
  setTimer();
  timer.disabled = true;

  interval = setInterval(() => {
    if(timeLeft > 0){
      timeLeft--;
      updateTimer();

      if(timeLeft <= 3) {
        timer.style.color = "red";
      }
    } else {
      clearInterval(interval);
      timer.style.color = "black";
      timer.disabled = false;
      // console.log("time's up");
      message.textContent = 'Time is Up!'
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  timer.disabled = false;
}

function resetTimer() {
  clearInterval(interval);
  timeLeft = initialTime;
  updateTimer();
  timer.style.color = "black";
  timer.disabled = false;
}