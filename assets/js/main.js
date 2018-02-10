const randomNumberInRange = function(max, min) {
  const minValidated = min || 0;
  const range = max - minValidated;
  return Math.floor(Math.random() * range) + minValidated;
};

(function() {
  const needleSrc = './assets/images/needle.png';
  const haystackSrc = './assets/images/haystack.png';
  const usedGuessSrc = './assets/images/red_x.png';

  let maxGuesses = 0;
  let guessCount = 0;
  let winCount = 0;
  let lossCount = 0;
  let gameResultMsg = "";
  let playing = false;

  const resetGame = function() {
    guessCount = 0;
    playing = true;
    let haystackCount = randomNumberInRange(12, 3);
    maxGuesses = Math.floor(haystackCount / 2);
    let needleLocatoin = randomNumberInRange(haystackCount);
    let haystacks = $("#haystacks");
    let guesses = $("#guesses");

    haystacks.empty();
    guesses.empty();

    for(let i = 0; i < haystackCount; i++) {
      let haystack = $("<img>").attr("src", haystackSrc).addClass("img-fluid haystack valid").data("needle", i === needleLocatoin);
      haystacks.append(haystack);
    }

    for(let j = 0; j < maxGuesses; j++) {
      let guess = $("<img>").attr("src", haystackSrc).addClass("img-fluid new-guess");
      guesses.append(guess);
    }

    startGame();
  };

  const squashImage = function(el, percent) {

    let imgHeight = {
      height: el.height() * (percent || 0.5)
    };
    el.animate(imgHeight);
  };

  const replaceImage = function(el, src) {
    el.attr("src", src);
  }

  const markGuess = function(el) {
    el.removeClass("valid");
    squashImage(el);
    let guessIcon = $(".new-guess").first().addClass("used-guess").removeClass("new-guess");
    replaceImage(guessIcon, usedGuessSrc);
  };

  const revealNeedle = function(el) {
    replaceImage(el, needleSrc);
  };

  const keepLooking = function() {
    console.log("Keep Looking!");
  }

  const wonGame = function() {
    disableHaystacks();
    winCount++;
    gameResultMsg = "YOU WIN!";
    setTimeout(updateScores, 1000);
  };

  const lostGame = function() {
    disableHaystacks();
    lossCount++;
    gameResultMsg = "YOU LOSE!";
    updateScores();
  };

  const updateScores = function() {
    $("#gameResult").text(gameResultMsg);
    $("#winCount").text(winCount);
    $("#lossCount").text(lossCount);
    $("#message").show();
    $("#splash").show();
    $("#gameBoard").hide();
  }

  const disableHaystacks = function() {
    $("#haystacks").off("click", ".haystack.valid");
  };

  const startGame = function() {

    $("#message").hide();
    $("#splash").hide();
    $("#gameBoard").show();

    $("#haystacks").on("click", ".haystack.valid", function() {

      guessCount++;

      if($(this).data("needle")) {
        revealNeedle($(this));
        wonGame();
      }
      else {
        markGuess($(this));

        if(guessCount === maxGuesses) {
          lostGame();
        }
        else {
          keepLooking();
        }
      }
    });
  }

  $("button").on("click", function() {
    if($(this).text() === "YES") {
      resetGame();
    }
    else {
      let confirmNo = confirm("Are you sure?");
      if(!confirmNo) {
        resetGame();
      }
      else {
        alert("Alright. Maybe next time.");
      }
    }
  });

  // Start the game
  resetGame();

})();