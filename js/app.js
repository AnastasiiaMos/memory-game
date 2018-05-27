// Script for Matching Game

// A list of all cards
var allCards = [
  "fa fa-diamond",
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bicycle",
  "fa fa-bomb",
  "fa fa-bomb"
];

// A list of opened cards
var openedCards = [];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  };

  return array;
}

// A list of shuffled cards
var shuffledCards = shuffle(allCards);

// Removes all subelements of the "deck" class
$(".deck").empty();

// Loops through the shuffledCards list and creates HTML for each card
for (i = 0; i < shuffledCards.length; i++) {
  $(".deck").append($('<li class="card"><i class="' + shuffledCards[i] + '"></i></li>'));
};

var moves = 0;
var stars = 3;

// Sets to zero number of moves in the HTML when the page loads
$('.moves').text(moves);

// Depending on the number of moves user made changes HTML for the number of stars
function movesAndStars() {
  const TO_TWO_STARS = 25;
  const TO_ONE_STAR = 35;

  if (moves > TO_TWO_STARS && moves <= TO_ONE_STAR) {
    $("section ul li").hide();
    $("section ul").append("<li><i class='fa fa-star'></i></li>");
    $("section ul").append("<li><i class='fa fa-star'></i></li>");
    $("section ul").append("<li><i class='fa fa-star-o'></i></li>");
    stars = 2;
  } else if (moves > TO_ONE_STAR) {
    $("section ul li").hide();
    $("section ul").append("<li><i class='fa fa-star'></i></li>");
    $("section ul").append("<li><i class='fa fa-star-o'></i></li>");
    $("section ul").append("<li><i class='fa fa-star-o'></i></li>");
    stars = 1;
  };

  $('.moves').text(moves);
}

// Here follows setting up the timer
var hours = 0;
var mins = 0;
var secs = 0;

// On the first click timer starts counting with interval of 1000 milliseconds
$(".deck").one("click", function() {
  timer = setInterval(startCount, 1000);
});

// Increases number of seconds (minutes and hours, if needed) spent on the game
function startCount() {
  secs++;

  if (secs === 60) {
    secs = 0;
    mins++;
  };

  if (mins === 60) {
    mins = 0;
    hours++;
  };

  $(".timer").text(addZero(hours) + ":" + addZero(mins) + ":" + addZero(secs));
}

// Prepends "0" for one digit number
function addZero(digit) {
  return digit < 10 ? ("0" + digit) : digit;
}

/*
 * When user clicks on restart picture, he is asked if he really wants to start
 * the game again and loose his scores. If yes the page reloads
 */
$(".restart").click(function() {
  swal("Are you sure you want to restart the game? Your progress will be lost.", {
  allowOutsideClick: false,
  buttons: ["Cancel", "Restart"],
  }).then(function(isConfirm) {
    if (isConfirm) {
      location.reload();
    };
  })
})

// Adds the card from the shuffledCards list to the openedCards list
function addToOpenedCards(card) {
  if (card.hasClass("open")) {
    openedCards.push(shuffledCards[card.index()]);
  };
}

/*
 * When the game is finished timer stops and user gets message with number of
 * moves and stars he got and time he spent. User also asked if he wants to play
 * again. If yes the page reloads
 */
function endGame() {
  clearInterval(timer);

  swal({
  title: "Sweet! You won the game!",
  text: "With " + moves + " moves, " + stars + " stars and " + hours + "h " + mins + "min " + secs + "sec.",
  icon: "success",
  allowOutsideClick: false,
  buttons: ["No, thanks", "Play again"],
  }).then(function(isConfirm) {
    if (isConfirm) {
      location.reload();
    };
  })
}

/*
 * Plays the game of matching cards. Every card click increases number of clicks,
 * calls functions:
 * - movesAndStars() - to evaluate number of stars;
 * - addToOpenedCards() - to add the card to the openedCards list.
 * If two cards match they change background color and stay fixed.
 * If two cards do not match they hide after 1 second.
 * If all cards match the game is finished and the function endGame() is called.
 */
function openOnClick() {
  $(".card").click(function() {
    moves++;
    movesAndStars();
    $(this).addClass("open show animated");
    addToOpenedCards($(this));

    if (openedCards.length % 2 === 0) {

      if ($(this).find("i").hasClass(openedCards[openedCards.length - 2])) {
        $(".card.open.show").addClass("match tada").removeClass("open show");
      } else {
        $(".open.show.animated").addClass("jello");
        $(".card").addClass("blocked");
        setTimeout(function() {
          $(".card.open.show").removeClass("open show animated jello");
          $(".card.blocked").removeClass("blocked");
          openedCards.splice(-2, 2);
        }, 1000);
      };
    };

    if (openedCards.length === shuffledCards.length) {
      endGame();
    };
  })
}


// Starts the game
openOnClick();
