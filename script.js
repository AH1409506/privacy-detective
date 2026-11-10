
// PRIVACY DETECTIVE
// Interactive case files and knowledge quiz

// CASE FILES

const caseData = {
    gps: {
        correct: 1,
        options: [
            "Allow continuous precise tracking because the app says it improves recommendations.",
            "Allow precise location only while using the app, unless background access is genuinely necessary.",
            "Allow background access as long as the app promises not to sell location data."
        ],
        explanations: [
            "Continuous tracking collects more information than the app may need. This conflicts with data minimization.",
            "Correct! Limiting location access to when it is needed follows data minimization and purpose limitation.",
            "A promise not to sell data does not mean continuous tracking is necessary. The app should still collect only the information it needs."
        ]
    },

    ethics: {
        correct: 1,
        options: [
            "Collect as much user information as possible because it could become useful later.",
            "Explain what information is collected, why it is needed, and give users meaningful choices.",
            "Hide complicated privacy practices in the terms of service because users can choose whether to read them."
        ],
        explanations: [
            "Collecting information just in case it becomes useful ignores data minimization and can create unnecessary privacy risks.",
            "Correct! Transparency, informed choice, and limiting unnecessary collection are important ethical principles.",
            "Putting information in terms of service does not automatically make a practice transparent or ethically responsible."
        ]
    },

    law: {
        correct: 0,
        options: [
            "COPPA is a U.S. federal law that applies to certain online services directed to children under 13 and covered services that know they collect personal information from children under 13.",
            "COPPA is a voluntary privacy guideline that companies can follow if they choose.",
            "COPPA applies to every website visitor under 18 and requires parental permission for every type of online activity."
        ],
        explanations: [
            "Correct! COPPA is a federal law with specific requirements for covered online services and children's personal information.",
            "COPPA is not simply a voluntary guideline. It is an enforceable federal law.",
            "COPPA focuses on children under 13 in covered circumstances, not every person under 18 or every online activity."
        ]
    }
};

let solvedCases = new Set();

// Set the case choices and correct answers.
document.querySelectorAll(".choices").forEach((group) => {
    const caseName = group.dataset.case;
    const caseInfo = caseData[caseName];

    if (!caseInfo) return;

    const buttons = Array.from(group.querySelectorAll(".choice"));
    const feedback = group.parentElement.querySelector(".feedback");

    buttons.forEach((button, index) => {
        if (caseInfo.options[index] !== undefined) {
            button.textContent = caseInfo.options[index];
        }

        button.dataset.correct =
            index === caseInfo.correct ? "true" : "false";

        button.disabled = false;

        button.addEventListener("click", () => {
            if (solvedCases.has(caseName)) return;

            // Clear the previous attempt's visual feedback.
            buttons.forEach((option) => {
                option.classList.remove("correct", "incorrect");
            });

            const isCorrect = index === caseInfo.correct;

            if (isCorrect) {
                solvedCases.add(caseName);
                button.classList.add("correct");

                feedback.textContent =
                    "✓ " + caseInfo.explanations[index];

                feedback.style.color = "#72e0a2";

                // Keep the choices disabled after a correct answer.
                buttons.forEach((option) => {
                    option.disabled = true;
                });

            } else {
                button.classList.add("incorrect");

                // Show the correct answer and its explanation.
                const correctButton = buttons[caseInfo.correct];

                if (correctButton) {
                    correctButton.classList.add("correct");
                }

                feedback.textContent =
                    "Not quite. " +
                    caseInfo.explanations[index] +
                    " The best answer is: " +
                    caseInfo.options[caseInfo.correct] +
                    " " +
                    caseInfo.explanations[caseInfo.correct] +
                    " Try again!";

                feedback.style.color = "#ffb0b0";

                // IMPORTANT: Re-enable EVERY answer, including the correct one.
                buttons.forEach((option) => {
                    option.disabled = false;
                });
            }

            document.getElementById("case-progress").textContent =
                `Cases solved: ${solvedCases.size} of 3`;
        });
    });
});

// KNOWLEDGE QUIZ

const questions = [
    {
        question: "A navigation app records your location history. What is the most important privacy concern?",
        answers: [
            "Location records can reveal routines and sensitive places, even without recording conversations.",
            "Location history is harmless whenever an app uses encryption.",
            "Location information is private only if a user never shares their phone number."
        ],
        correct: 0,
        explanation: "Location history can reveal routines, visits, and potentially sensitive information. Privacy depends on how information is collected, used, stored, and shared."
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
            "Following the law automatically means a technology is fair and ethical.",
            "Ethics considers fairness and potential harm, while laws establish enforceable requirements.",
            "Ethical principles only matter when no laws exist."
        ],
        correct: 1,
        explanation: "Ethics and law overlap, but they are different. A practice may comply with the law yet still raise concerns about fairness, transparency, or harm."
    },
    {
        question: "Which situation is most likely covered by U.S. COPPA?",
        answers: [
            "A covered online service collects personal information from a child under 13 in circumstances covered by the law.",
            "Any website collects information from an adult who does not read its privacy policy.",
            "A website collects information from every visitor under 18, regardless of the service or circumstances."
        ],
        correct: 0,
        explanation: "COPPA applies to certain online services directed to children under 13 and other covered services with actual knowledge that they collect personal information from children under 13. The specific requirements depend on the circumstances."
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
