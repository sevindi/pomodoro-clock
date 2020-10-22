let sessionMinute = 25,
    breakMinute = 5,
    sessionSeconds,
    breakSeconds,
    remainingSec,
    sessionLength = $("#session-length"),
    breakLength = $("#break-length"),
    timerLabel = $("#timer-label"),
    timeLeft = $("#time-left"),
    start = $("#start"),
    pause = $("#pause"),
    reset = $("#reset"),
    resume = $("#resume"),
    counter,
    breakSound = new Audio('https://filebin.net/ra239ukbqcdl3enn/alarm.mp3?t=bdntpx63');

sessionLength.text(sessionMinute);
breakLength.text(breakMinute);
timeLeft.text(sessionMinute);
timerLabel.text("SESSION");

function formatTime(seconds) {
  let h = Math.floor(seconds / 3600),
      m = Math.floor(seconds / 60) % 60,
      s = seconds % 60;
      if (m < 10) m = "0" + m;
      if (s < 10) s = "0" + s;
      if (h > 0) {
        h = "0" + h;
        timeLeft.text(h + ":" + m + ":" + s);
      } else { timeLeft.text(m + ":" + s); }
} 

function runTimer(seconds, sessionOrBreak) {
  counter = setInterval(function(){
    seconds--;
    remainingSec = seconds;
    formatTime(remainingSec);
    if (remainingSec < 0) {
      clearInterval(counter);
      breakSound.play();
      start.toggleClass("break");
      sessionOrBreak();
    }
  }, 1000);
}

function startSession() {
  timerLabel.text("SESSION");
  sessionSeconds = parseInt(sessionLength.text()) * 60;
  runTimer(sessionSeconds, startBreak);
}

function startBreak() {
  timerLabel.text("BREAK");
  start.toggleClass("break");
  breakSeconds = parseInt(breakLength.text()) * 60;
  runTimer(breakSeconds, startSession);
}

function changeDisplay(val, arr) {
  for(let i = 0; i < arr.length; i++) {
    let el = arr[i];
    el.css("display", val);
  }
}

start.click(function() {
  changeDisplay("none", [start]);
  changeDisplay("inline-block", [pause, reset]);
  startSession();
});

pause.click(function() {
  changeDisplay("none", [pause]);
  changeDisplay("inline-block", [resume]);
  clearInterval(counter);
});

resume.click(function() {
  changeDisplay("none", [resume]);
  changeDisplay("inline-block", [pause]);
  if(!start.hasClass("break")) {
    counter = setInterval(function() {
      remainingSec--;
      formatTime(remainingSec);
      if (remainingSec < 0) {
        clearInterval(counter);
        breakSound.play();
        startBreak();
      }
    }, 1000);
  } else {
    runTimer(remainingSec, startSession);
  }
});

reset.click(function() {
  changeDisplay("inline-block", [start]);
  changeDisplay("none", [pause, resume]);
  clearInterval(counter);
  timeLeft.text(sessionLength.text());
});

$("#session-decrement").click(function() {
  sessionMinute < 2 ? sessionMinute = 1 : sessionMinute--;
  $("#session-length, #time-left").text(sessionMinute);
});

$("#session-increment").click(function() {
  sessionMinute++;
  $("#session-length, #time-left").text(sessionMinute);
});

$("#break-decrement").click(function() {
  breakMinute < 2 ? breakMinute = 1 : breakMinute--;
  $("#break-length").text(breakMinute);
});

$("#break-increment").click(function() {
  breakMinute++;
  $("#break-length").text(breakMinute);
});