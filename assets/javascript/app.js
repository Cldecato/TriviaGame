$(document).ready(function() {

    var queryURL = "https://opentdb.com/api.php?amount=1&type=multiple";
    var choices = [];
    var question;
    var correct;
    var incorrect;
    var category;
    var userGuess;
    var loser;
    var victory;
    var clicks = 0;
    var gameLength = 10;
    var time = 20;
    var intervalId;
    var correctAns = 0;
    var totalQs = 0;

    function getAPI() {
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            var help = response.results[0];
            question = help.question;
            correct = help.correct_answer;
            incorrect = help.incorrect_answers;
            category = help.category;
            choices.push(correct);
            for ( i = 0; i < incorrect.length; i++) {
                choices.push(incorrect[i]);
            }
            showQuestion();
            showButtons();
            $("#victory").empty();
        }).fail(function(err) {
            throw err;
        });
    }

    function showQuestion() {
        $("#question").html("Question: " + question);
        $("#category").html("Category: " + category);
    }

    function showButtons() {
        $(".list-group").empty();
        for ( i = 0; i < choices.length; i++) {
            var btn = $("<button>");
            btn.addClass("options");
            btn.attr("id", "btn" + i);
            btn.attr("data-name", choices[i]);
            btn.text(choices[i]);
            $(".list-group").append(btn);
        }
    }

    function displayAnswer() {
        totalQs++;
        if ( time === 0) {
            clearScreen();
            $("#timer").html("<h3>Times Up!</h3>");
            loser = "assets/images/loser.mpeg-4.mp4";
            gif = $("<img>");
            gif.attr("src", loser);
            $("#victory").append(gif);
        } else if ( userGuess == correct ) {
            clearScreen();
            correctAns++;
            stewie = "assets/images/stewie.jpg";
            img = $("<img>");
            img.attr("src", stewie);
            $("#victory").append(img);
        } else if (userGuess !== correct) {
            clearScreen();
            loser = "assets/images/loser.mpeg-4.mp4";
            gif = $("<img>");
            gif.attr("src", loser);
            $("#victory").append(gif);
        } else {
            clearScreen();
            $("#victory").html("Game Over!")
        }
        var windowTimeout = setTimeout(function() {
            getAPI();
        }, 3000);
    }

    function clearScreen() {
        $("#buttonDiv").empty();
        $("#question").empty();
        $("#category").empty();
        $("#timer").empty();
    }

    function run() {
        clearInterval(intervalId);
        intervalId = setInterval(decrement, 1000);
    }
    
    function decrement() {
        time--;
        $("#timer").html("Time Left: " + time);
        if ( time === 0) {
            stop();
            displayAnswer();
        }
    }

    function stop() {
        clearInterval(intervalId);
    }
    
    $("#buttonDiv").on("click", "button", function(event) {
        event.preventDefault();
        if ( clicks === 0 ) {
            getAPI();
            run();
        } else {
            userGuess = $(this).attr("data-name");
            displayAnswer();
            stop();
        }
        clicks++
    })
})