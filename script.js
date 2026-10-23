// PRIVACY DETECTIVE
// Interactive case files and knowledge quiz

const caseExplanations = {
    gps: {
        correct: "Correct! Location access can reveal routines and sensitive places. Check the app's purpose and privacy settings, and allow only the access you are comfortable with."
    },
    ethics: {
        correct: "Correct! Ethical developers consider transparency, consent, fairness, and potential harm. Raise concerns responsibly and seek a privacy-respecting solution."
    },
    law: {
        correct: "Correct! COPPA is a U.S. federal law concerning the online collection of personal information from children under 13 in covered circumstances. It does not prohibit all data collection."
    }
};

let solvedCases = new Set();

document.querySelectorAll(".choices").forEach((group) => {
    const caseName = group.dataset.case;
    const feedback = group.parentElement.querySelector(".feedback");

    group.querySelectorAll(".choice").forEach((button) => {
        button.addEventListener("click", () => {
            if (solvedCases.has(caseName)) return;

            const isCorrect = button.dataset.correct === "true";

            // Allow another attempt after an incorrect answer.
            if (isCorrect) {
                solvedCases.add(caseName);
            }

            group.querySelectorAll(".choice").forEach((option) => {
                option.disabled = true;

                if (option.dataset.correct === "true") {
                    option.classList.add("correct");
                } else if (option === button && !isCorrect) {
                    option.classList.add("incorrect");
                }
            });

            if (isCorrect) {
                feedback.textContent = "✓ " + caseExplanations[caseName].correct;
                feedback.style.color = "#72e0a2";
            } else {
                feedback.textContent =
                    "Not quite. Review the highlighted correct answer and its explanation, then try the case again.";
                feedback.style.color = "#ffb0b0";

                // Re-enable answers after showing the explanation.
                // The correct answer stays visibly highlighted.
                group.querySelectorAll(".choice").forEach((option) => {
                    if (option.dataset.correct !== "true") {
                        option.disabled = false;
                    }
                });
            }

            document.getElementById("case-progress").textContent =
                `Cases solved: ${solvedCases.size} of 3`;
        });
    });
});

// Knowledge quiz

const questions = [
    {
        question: "A navigation app records your location history. What is a legitimate privacy concern?",
        answers: [
            "The data could reveal a person's routines and frequently visited places.",
            "GPS automatically makes every phone call public.",
            "Location information can never be linked to an individual."
        ],
        correct: 0,
        explanation: "Location history can reveal routines, visits, and potentially sensitive information. Check permissions and the service's privacy practices."
    },
    {
        question: "What is a sensible way to protect your privacy when using apps?",
        answers: [
            "Give every app every permission it requests.",
            "Review permissions and limit access that is not needed.",
            "Use the same password on every account."
        ],
        correct: 1,
        explanation: "Limiting unnecessary permissions reduces exposure. Strong, unique passwords and multifactor authentication also help protect accounts."
    },
    {
        question: "What is the main purpose of a non-disclosure agreement (NDA)?",
        answers: [
            "To guarantee that a company can never be sued.",
            "To make all information owned by a business secret forever.",
            "To establish contractual duties for protecting specified confidential information."
        ],
        correct: 2,
        explanation: "An NDA sets out confidentiality obligations for covered information. Its effect depends on its terms and applicable law."
    },
    {
        question: "Which statement about ethics and law is most accurate?",
        answers: [
            "If an action is legal, it is always ethical.",
            "Ethics considers fairness and harm, while laws create legal requirements.",
            "Ethics and law mean exactly the same thing."
        ],
        correct: 1,
        explanation: "Ethics and law overlap, but they are different. A practice may comply with a law yet still raise concerns about fairness, transparency, or harm."
    },
    {
        question: "Under U.S. COPPA, which situation is especially relevant to the law?",
        answers: [
            "A covered online service collects personal information from a child under 13 in circumstances covered by the rule.",
            "An adult uses a paper map.",
            "A website changes its background color."
        ],
        correct: 0,
        explanation: "COPPA applies to certain online services directed to children under 13 and other covered services with actual knowledge that they collect personal information from children under 13. Specific obligations depend on the circumstances."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionNumber = document.getElementById("question-number");
const scoreLabel = document.getElementById("score-label");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("quiz-answers");
const quizFeedback = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("next-question");
const progressFill = document.getElementById("progress-fill");
const quizResult = document.getElementById("quiz-result");

function showQuestion() {
    answered = false;

    const question = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreLabel.textContent = `Score: ${score}`;
    questionText.textContent = question.question;
    quizFeedback.textContent = "";
    answersContainer.replaceChildren();

    quizResult.hidden = true;
    nextButton.hidden = true;

    progressFill.style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "answer-option";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        answersContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = questions[currentQuestion];
    const buttons = answersContainer.querySelectorAll("button");
    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        score++;
    }

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("incorrect");
        }
    });

    quizFeedback.textContent =
        (isCorrect ? "✓ Correct! " : "Not quite. ") +
        question.explanation;

    scoreLabel.textContent = `Score: ${score}`;
    nextButton.hidden = false;

    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "See my results →"
            : "Next question →";
}

function showResults() {
    questionNumber.textContent = "Investigation complete";
    progressFill.style.width = "100%";
    questionText.textContent = "Your final report";
    answersContainer.replaceChildren();
    quizFeedback.textContent = "";
    nextButton.hidden = true;
    quizResult.hidden = false;

    const percentage = Math.round((score / questions.length) * 100);

    document.getElementById("result-title").textContent =
        `${score} out of ${questions.length} correct (${percentage}%)`;

    let message;

    if (score === 5) {
        message = "Excellent detective work! You demonstrated a strong understanding of these privacy, ethics, and law concepts.";
    } else if (score >= 3) {
        message = "Good work! Review the explanations for any questions you missed to strengthen your understanding.";
    } else {
        message = "Keep investigating! Review the field notes and case files, then try again to build your understanding.";
    }

    document.getElementById("result-text").textContent = message;
}

nextButton.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
});

document.getElementById("restart-quiz").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    showQuestion();

    document.getElementById("quiz").scrollIntoView({
        behavior: "smooth"
    });
});

showQuestion();