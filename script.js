const questions = [
    { question: "What is the most popular Christmas tree decoration?", options: ["Tinsel", "Lights", "Ornaments", "Candy Canes"], correct: "Lights", hint: "It twinkles!" },
    { question: "What is the traditional Christmas flower?", options: ["Rose", "Tulip", "Poinsettia", "Lily"], correct: "Poinsettia", hint: "It’s red and green!" },
    { question: "What color is Santa's suit?", options: ["Red", "Green", "Blue", "White"], correct: "Red", hint: "It's Santa's iconic color!" },
    { question: "Which country started the tradition of putting up a Christmas tree?", options: ["Germany", "USA", "France", "England"], correct: "Germany", hint: "This country is known for its Christmas markets." },
    { question: "What is the name of the reindeer with the red nose?", options: ["Dasher", "Rudolph", "Comet", "Blitzen"], correct: "Rudolph", hint: "His nose shines bright!" },
    { question: "What popular Christmas beverage is also called 'milk punch'?", options: ["Eggnog", "Hot Chocolate", "Cider", "Tea"], correct: "Eggnog", hint: "It’s creamy and spiced." },
    { question: "In what city was Jesus born?", options: ["Bethlehem", "Nazareth", "Jerusalem", "Capernaum"], correct: "Bethlehem", hint: "It’s in Israel." },
    { question: "How many days are there in the Christmas Advent calendar?", options: ["12", "24", "30", "31"], correct: "24", hint: "It’s the countdown to Christmas." },
    { question: "What do people traditionally put on top of a Christmas tree?", options: ["Angel", "Star", "Candy Canes", "Snowman"], correct: "Star", hint: "It lights the way!" },
    { question: "What is the name of the snowman in the famous Christmas song?", options: ["Frosty", "Snowy", "Jack", "Buddy"], correct: "Frosty", hint: "He’s a jolly soul!" }

];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30; // Time in seconds for each question

const answers = [];

// Function to start and reset the timer for each question
function startTimer() {
    timeLeft = 30; // Reset timer to 30 seconds
    document.getElementById("timeLeft").textContent = timeLeft; // Update timer display
    clearInterval(timer); // Clear any existing interval
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer); // Stop timer when it reaches 0
            navigate(1); // Automatically move to the next question when time runs out
        }
    }, 1000);
}

// Function to display quiz questions
function displayQuestion() {
    const questionData = questions[currentQuestion];
    const quizBody = document.getElementById('quiz');
    quizBody.innerHTML = ` 
        <div class="question">
            <p>${questionData.question}</p>
            <ul>
                ${questionData.options.map(option => ` 
                    <li>
                        <input type="radio" name="answer" value="${option}" onclick="highlightAnswer('${option}')"> ${option}
                    </li>`).join('')}
            </ul>
            <p><strong>Hint:</strong> ${questionData.hint}</p>
        </div>
    `;

    // Lock or unlock options based on whether the question has already been answered
    if (answers[currentQuestion]) {
        lockOptions(); // Lock options if an answer was already selected
        // Highlight the selected answer
        const selectedOption = answers[currentQuestion];
        highlightAnswer(selectedOption);
    } else {
        unlockOptions(); // Unlock options if no answer has been selected yet
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (currentQuestion === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    if (currentQuestion === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }

    startTimer(); // Start the timer when the question is displayed
}

// Function to navigate between questions
function navigate(direction) {
    // Save the selected answer before moving to the next question
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        answers[currentQuestion] = selectedOption.value;

        // Update score if the answer is correct
        const correctAnswer = questions[currentQuestion].correct;
        if (selectedOption.value === correctAnswer) {
            score++;
        }
    }

    // Lock the options after answer is selected
    lockOptions();

    currentQuestion += direction;
    if (currentQuestion < 0) currentQuestion = 0;
    if (currentQuestion >= questions.length) currentQuestion = questions.length - 1;
    displayQuestion();
}

// Function to highlight the selected answer
function highlightAnswer(selectedOption) {
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
        const optionLabel = option.parentElement;
        if (option.value === selectedOption) {
            optionLabel.classList.add('selected'); // Add a 'selected' class to highlight
        } else {
            optionLabel.classList.remove('selected'); // Remove the highlight from non-selected options
        }
    });
}

// Function to lock options after selection (disable radio buttons but show the selected answer)
function lockOptions() {
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
        option.disabled = true; // Disable the radio buttons once an option is selected
    });
}

// Function to unlock options when navigating back
function unlockOptions() {
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
        option.disabled = false; // Enable the radio buttons again if needed (on navigating back)
    });
}

// Function to handle quiz submission and display results
function submitQuiz() {
    clearInterval(timer); // Stop the timer

    // Calculate and display the actual score
    let score = 0;
    questions.forEach((question, index) => {
        if (answers[index] === question.correct) {
            score++; // Increment score for correct answers
        }
    });

    // Display final score
    const scoreContainer = document.getElementById('score-container');
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${score} / ${questions.length}`;
    scoreContainer.style.display = 'block';

    // Play the Christmas audio
    const christmasAudio = document.getElementById('christmasAudio');
    christmasAudio.play(); // Play the audio when the quiz is submitted

    // Hide the entire quiz container (header, body, buttons)
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.style.display = 'none';

    // Hide the quiz navigation buttons and submit button
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'none';

    // Display incorrect answers and corrections
    let incorrectAnswersHtml = '';
    questions.forEach((question, index) => {
        const userAnswer = answers[index];
        if (userAnswer !== question.correct) {
            incorrectAnswersHtml += `
                <div class="answer">
                    <p><strong>Question:</strong> ${question.question}</p>
                    <p><strong>Your Answer:</strong> ${userAnswer}</p>
                    <p><strong>Correct Answer:</strong> ${question.correct}</p>
                </div>
            `;
        }
    });
    const answersList = document.getElementById('answersList');
    answersList.innerHTML = incorrectAnswersHtml;

    // Trigger confetti celebration
    celebrateWithConfetti();
}

function celebrateWithConfetti() {
    // Trigger confetti when the "Celebrate!" button is clicked
    confetti(); // Assuming confetti.js is included
}


// Initialize the quiz
displayQuestion();
confetti();