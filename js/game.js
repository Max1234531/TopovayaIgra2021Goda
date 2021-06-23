const numDivs = 36;
const maxHits = 10;

let hits = 0;
let firstHitTime = 0;
let divSelector = null;
let penS = null;
let miss = 0;
let penalty = 0;
let score = 0;

function round() {

  if (divSelector !== null) {
    $(divSelector).removeClass("target");
    $(divSelector).text('');
  }
  else firstHitTime = getTimestamp();

  if (penS!== null){
    $(penS).removeClass("penalty");
    $(penS).text('');
  }

  divSelector = randomDivId();
  penS = randomDivId();

  while (penS === divSelector) {
    divSelector = randomDivId();
    penS = randomDivId();
  }
  
  $(divSelector).addClass("target");
  $(divSelector).text(hits+1);

  $(penS).addClass("penalty");
  $(penS).text(hits+1);

  

  if (hits === maxHits) {
    $(penS).removeClass("penalty");
    $(penS).text('');
    $(divSelector).removeClass("target");
    $(divSelector).text('');
    endGame();
  }
}

function endGame() {

  $("#pole").addClass("d-none");
  $("#button-reload").removeClass("d-none");

  let totalPlayedMillis = getTimestamp() - firstHitTime;
  let totalPlayedSeconds = Number(totalPlayedMillis / 1000).toPrecision(3);
  
  $("#total-time-played").text(totalPlayedSeconds);
  $("#total-miss").text(miss);
  $("#total-penalty").text(penalty);

  let ts = score-penalty-miss;
  if (ts<0) ts = 0;

  $("#total-score").text(ts);
  if (ts == 10) $("#message").text("Идеально!");
  else if(ts >= 8 && ts <= 9) $("#message").text("Отличный результат!");
  else if(ts >= 5 && ts <= 7) $("#message").text("Неплохо!");
  else if(ts >= 2 && ts <= 4) $("#message").text("Не самая лучшая реакция...");
  else if(ts >= 0 && ts <= 1) $("#message").text("Кажется, в этот раз вам совсем не повезло...");
  else if(ts > 10 && ts < 0) $("#message").text("Ух ты! Кажется, вы обнаружили ̶б̶а̶г секретную тактику!");

  //я пробовал ставить просто else, но почему-то тогда часто прокал невозможный результат 0_0 

  $("#win-message").removeClass("d-none");
}

function handleClick(event) {
  if ($(event.target).hasClass("target")) {
    hits = hits + 1;
    score++;
    round();
  }

  else if ($(event.target).hasClass("penalty")){
    $(event.target).addClass("warn");
    $(event.target).text("😈");
    penalty++;
    console.log("penalty");
    setTimeout(() => {$(event.target).removeClass("warn");
                      $(event.target).removeClass("penalty");
                      $(event.target).text("");
                      },70);
  }

  else {
    $(event.target).addClass("miss");
    $(event.target).text("MISS 😔");
    miss++;
    console.log("miss");
    setTimeout(() => {$(event.target).removeClass("miss");
                      $(event.target).text("");
                      },70); //чтобы исчезало
  }
}

function init() {

  $("#button-start").click(()=>{$("#pole").removeClass("d-none");
                                $("#button-start").addClass("d-none");
                                round();});
  
  

  $(".game-field").click(handleClick);
  $("#button-reload").click(function() {
    $("#pole").removeClass("d-none");
    $("#button-reload").addClass("d-none");
    $("#win-message").addClass("d-none");
    hits = 0;
    firstHitTime = 0;
    divSelector = null;
    penS = null;
    score = 0;
    miss = 0;
    penalty = 0;
    round();
  });
}

$(document).ready(init);
