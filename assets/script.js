//Page element Selectors

//Quiz Elements:
const timerEl = document.querySelector("header span#time");
const startDivEl = document.querySelector("div.start-div");
const startButton = document.querySelector("button#start");
const questionDivEl = document.querySelector("div.question-div");
const answerButtons = document.querySelector("div.buttons");
const questionEl = document.querySelector("h1#question");
const rightWrongEl = document.querySelector("div#right-wrong");

// End of quiz elements:
const endDivEl = document.querySelector("div.end-div");
const finalScoreEl = document.querySelector("h2 span#final-score");
const scoreForm = document.querySelector("form#score-form");
const initialsInput = document.querySelector("input#initials");

// High Score elements:
const hsLink = document.querySelector("header div#hs");
const highScores = document.querySelector("div.high-scores");
const scoresList = document.querySelector("ol#scores-list");
const clearHsBtn = document.querySelector("button#clear");
const goBackHsBtn = document.querySelector("button#go-back");

// Quiz question bank pulled from 'https://www.w3schools.com/js/js_quiz.asp'

const questionBank = [
    {
        question: "How do you create a function in JavaScript?",
        possibleAns: ["a. function:myFunction()", "b. function myFunction ()", "c. function=myFunction", "d. function = myFunction()"],
        correctAns: 1
    },

    {
        question: "How do you write an IF statement for executing some code if 'i' is NOT equal to 5?",
        possibleAns: ["a. if i <> 5", "b. if (i <> 5)", "c. if (i !== 5)", "d. if i =! 5 then"],
        correctAns: 2
    },

    {
        question: "How do you write 'Hello World' in an alert box?",
        possibleAns: ["a. alert('Hello World');", "b. msg('Hello World');", "c. alertBox('Hello World');", "d. msgBox('Hello World');"],
        correctAns: 0
    },

    {
        question: "An IF statement is an example of a ...?",
        possibleAns: ["a. Ternary operator", "b. Conditional", "c. Boolean", "d. Variable"],
        correctAns: 1
    },

    {
        question: "What is the correct syntax for referring to an external script calle 'xxx.js'?",
        possibleAns: ["a. <script href='xxx.js'>", "b. <script value='xxx.js'>", "c. <script name='xxx.js'>", "d. <script src='xxx.js'>"],
        correctAns: 3
    },

];

// Initialze Quiz variables

let questionIdx = 0; //Tracking current question
let secondsLeft = 60; //Tracking time left and the score
let timerInterval; //Timer Interval
let flashTimeout; //Timeout for right-wrong message

// Functions to Show and Hide elements

function hide(element) {
    element.setAttribute("style", "display: none;");
}

function show(element) {
    element.setAttribute("style", "display: block;");
}

// Quiz Functions

// Loads Question into html elements
function displayQuestion() {
    const currQuestion = questionBank[questionIdx]; // loads the current question from question bank
    questionEl.textContent = currQuestion.question; // puts question in the question heading
    // puts possible answers into answer buttons
    const possibleAnswers = currQuestion.possibleAns;
    for (let i = 0; i < possibleAnswers.length; i++) {
        answerButtons.children[i].textContent = possibleAnswers[i];
    }
}

// Quiz end - when there are no more questions or time runs out, call this function
function endQuiz() {
    clearInterval(timerInterval); // clears the timer interval
    timerEl.textContent = 0; // sets the timer display to 0

    // Test for negative time
    if (secondsLeft < 0) {
        secondsLeft = 0;
    }

    finalScoreEl.textContent = secondsLeft;// Displays time left and the score
    hide(questionDivEl); // Hides the question div
    show(endDivEl); // Shows the end of quiz div

}

// Starts the timer interval and displays time remaining on screen
function startTimer() {
    timerInterval = setInterval(function () {
        secondsLeft--; // Time left
        timerEl.textContent = secondsLeft; // Displays time left
        // When timer runs out
        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            // End Quiz
            endQuiz();
        }
    }, 1000)
}

// Starts the quiz when the Start Quiz button is clicked
function startQuiz() {
    // Hide start div
    hide(startDivEl);
    // Display first question from quiz bank
    displayQuestion();
    // Show question div
    show(questionDivEl);
    // Start timer
    startTimer();
}

// Event listener to begin the quiz when the "Start" button is clicked
startButton.addEventListener("click", startQuiz);

// Loads the next question from the Quiz bank
function nextQuestion() {
    // Checks to see if there are more questions available in the Quiz bank
    if (questionIdx < questionBank.length - 1) {
        // Increment the question index
        questionIdx++;
        // Display next question
        displayQuestion();
    } else {
        // No more questions to display - Display "End" screen
        setTimeout(function () {
            endQuiz();
        }, 500)

    }
}

// Checks answer selection and displays right-wrong message
function checkAnswer(answer) {
    if (questionBank[questionIdx].correctAns == answer) {
        // Right answer - Flash 'Right!' message
        clearTimeout(flashTimeout);
        rightWrongEl.setAttribute("class", "right");
        rightWrongEl.textContent = "Right!";
        show(rightWrongEl);
        flashTimeout = setTimeout(function () {
            hide(rightWrongEl);
        }, 1000);
    } else {
        // Wrong answer - Flash 'Wrong' message - subtract time from clock
        secondsLeft -= 10;
        clearTimeout(flashTimeout);
        rightWrongEl.setAttribute("class", "wrong")
        rightWrongEl.textContent = "Wrong.";
        show(rightWrongEl);
        flashTimeout = setTimeout(function () {
            hide(rightWrongEl);
        }, 1000);
    }
    // Load next question
    nextQuestion();
}

// Event listener for the four answer buttons - runs checkAnswer function for right/wrong response
answerButtons.addEventListener("click", function () {
    const element = event.target
    if (element.matches("button")) {
        checkAnswer(element.value);
    }
})

// High Score - initialize array to hold HS listing

let scores = [];

// Function to compare scores for sorting
function compareScores(a, b) {
    return b.score - a.score;
}

// Displays score ranking on High Score screen
function renderScores() {
    // Hide other divs - question, end, start 
    hide(questionDivEl);
    hide(endDivEl);
    hide(startDivEl);

    // Clear current scores on page
    scoresList.innerHTML = "";

    // Sort scores in order from highest to lowest
    scores.sort(compareScores);

    // Render scores on page in LIs
    for (let i = 0; i < scores.length; i++) {
        const li = document.createElement("li");
        li.textContent = `${scores[i].initials} - ${scores[i].score}`;
        scoresList.appendChild(li);
    }
    // Show High Score Fame div
    show(highScores);
}

// Updates local storage for content of score
function storeScore() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

// Checks for scores in local storage and loads them into scores array
function loadScores() {
    const storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores) {
        scores = storedScores;
    }
}

// Load high scores from local Storage
loadScores();

// Click listeners on High Score buttons

// Clear the High Score listing of all scores button
clearHsBtn.addEventListener("click", function () {
    localStorage.clear();
    scores = [];
    renderScores();
})

// Go back to the start screen button
goBackHsBtn.addEventListener("click", function () {
    // clear timer
    clearInterval(timerInterval);
    // initialize quiz variables
    questionIdx = 0;
    secondsLeft = 60;
    // display seconds left
    timerEl.textContent = secondsLeft;
    // hide High Score div and show Start div
    hide(highScores);
    show(startDivEl);
})

// Event listener for submitting High Score listing - initials and score
scoreForm.addEventListener("submit", function () {
    event.preventDefault();
    const initials = initialsInput.value.trim();
    // check to make sure form is not blank
    if (!initials) {
        return;
    }
    // Create object with initials and score 
    const initialsScore = { initials: initials, score: secondsLeft };

    // Add initials and score to scores array
    scores.push(initialsScore);

    // Clear initials text input
    initialsInput.value = "";

    // Update localStorage with scores array
    storeScore();

    // Display High Score with scores listing
    renderScores();
})

// Event listener on High Score link at top of page to display the High Score screen
hsLink.addEventListener("click", function () {
    // Clear timer if there is one
    clearInterval(timerInterval);
    // Render the high Score score listing on the screen
    renderScores();
})