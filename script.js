// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current section in navigation
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.effect-card, .concern-card, .research-item, .tip-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Tab functionality for detailed research
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabName = button.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Chatbot functionality
    initializeChatbot();
});

// Chatbot knowledge base
const chatbotResponses = {
    // Greetings and general
    'hello|hi|hey': 'Hello! I\'m here to support you with gaming habits and addiction concerns. What would you like to talk about?',
    'how are you|how do you do': 'I\'m here and ready to help! How can I support you today?',
    'what can you do': 'I can help you with: understanding gaming addiction, strategies for reducing gaming, dealing with cravings, setting healthy boundaries, and resources for professional help.',
    
    // Addiction recognition
    'am i addicted|gaming addiction|addicted to gaming': 'Signs of gaming addiction include: losing track of time, neglecting responsibilities, using gaming to escape problems, failed attempts to cut back, and relationship issues. If you identify with several of these, it\'s worth considering support.',
    'how do i know if|warning signs': 'Key warning signs include: gaming replaces other activities, continued gaming despite problems, withdrawal symptoms when not gaming, tolerance (needing more gaming), and deception about gaming habits.',
    'symptoms of gaming addiction': 'Common symptoms are: preoccupation with gaming, withdrawal anxiety, tolerance requiring more time, loss of interest in other activities, continued excessive use despite problems, and jeopardizing relationships or opportunities.',
    
    // Quitting and reduction strategies
    'how to quit|stop gaming|quit gaming': 'Gradual steps work better: set daily time limits, schedule gaming-free periods, replace gaming with other activities (exercise, hobbies, socializing), remove triggers, find accountability partners, and consider professional help if needed.',
    'tips for reducing|reduce gaming time|cut back': 'Try these strategies: use alarms/timers, play with friends to time-box sessions, keep console/PC out of bedroom, find alternative hobbies, exercise more, and make a visible commitment to your goals.',
    'can\'t stop playing|keep playing too much': 'This is common. Try: deleting games, changing passwords, telling family/friends for accountability, filling your time with activities you enjoy, and seeking professional support if it\'s severe.',
    'withdrawal|anxiety when not gaming|irritable': 'Gaming withdrawal is real - your brain adapted to dopamine hits. It gets better! Exercise helps, connect with people, practice relaxation techniques, and give it 2-4 weeks as your brain rebalances.',
    
    // Coping strategies
    'what to do instead|alternatives|other activities': 'Consider: sports/exercise, creative hobbies (art, music, writing), reading, social activities with friends, meditation, learning new skills, outdoor activities, or volunteering.',
    'dealing with boredom|bored': 'Boredom is temporary! Make a list of activities you enjoy, try something new, exercise (releases natural dopamine), call a friend, or work on a project. Boredom decreases as you adjust.',
    'stress|anxiety|depression': 'Gaming can mask these feelings. Try: exercise, meditation, talking to friends/family, journaling, or professional counseling. Addressing root causes is important for lasting change.',
    
    // Support and help
    'professional help|therapy|counselor': 'Consider seeing a therapist who specializes in behavioral addiction. Many provide online sessions. Resources: psychologytoday.com, your doctor, or call SAMHSA 1-800-662-4357.',
    'tell my parents|talk to family': 'Honesty helps! Explain your concerns, ask for their support, suggest accountability measures together, and focus on positive change rather than shame.',
    'friend is addicted': 'Express concern without judgment, suggest alternatives, encourage breaks, offer support (not enabling), recommend professional help if serious, and set healthy boundaries.',
    
    // Motivation and encouragement
    'can i do this|possible to quit': 'Absolutely! Many people successfully reduce or quit gaming. Recovery takes time and effort, but it\'s very possible. Small wins count - celebrate progress!',
    'motivation|why should i|benefits of quitting': 'Benefits include: better sleep, improved focus and grades, stronger relationships, more time for other interests, increased self-confidence, and better mental health.',
    'relapsed|messed up|failed': 'Relapse is normal in recovery. Don\'t beat yourself up - reflect on triggers, learn from it, and restart immediately. Progress isn\'t always linear. Keep trying!',
    'day without gaming|proud': 'That\'s amazing! Every day is a victory. The urges will get weaker. Celebrate this progress and keep building on it!',
    
    // General
    'research|studies|science': 'Gaming affects dopamine systems in the brain. The good news: the brain is adaptable and resets within weeks of reduced gaming. Neuroplasticity works in your favor!',
    'thanks|thank you': 'You\'re welcome! I\'m here anytime you need support. You\'ve got this!',
};

function initializeChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatWidget = document.querySelector('.chatbot-widget');

    // Toggle chat window
    toggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Close chat window
    closeBtn.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessageToChat(message, 'user');
        chatInput.value = '';

        // Get and add bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessageToChat(response, 'bot');
        }, 500);
    }

    function addMessageToChat(text, sender) {
        const messagesDiv = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Check for keyword matches
        for (const [keywords, response] of Object.entries(chatbotResponses)) {
            const keywordList = keywords.split('|');
            if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
                return response;
            }
        }

        // Default response if no match
        return 'I understand. That\'s an important topic. Could you tell me more specifically about what you\'d like help with? I can discuss addiction, strategies for reduction, or coping techniques.';
    }
}

// Quiz Functionality
const quizData = [
    {
        question: "Which type of video game is best known for improving reaction time and attention?",
        options: ["Action games", "Puzzle games", "Simulation games", "Story-based games"],
        correct: 0,
        explanation: "Action games have been shown to significantly improve reaction time and attention span through fast-paced gameplay."
    },
    {
        question: "What brain chemical is released during gaming and is associated with reward?",
        options: ["Serotonin", "Dopamine", "Cortisol", "Adrenaline"],
        correct: 1,
        explanation: "Dopamine is released during gaming, which is associated with pleasure and reward, but excessive release can lead to addiction."
    },
    {
        question: "How can blue light from screens affect sleep?",
        options: ["It increases melatonin", "It suppresses melatonin production", "It has no effect", "It increases serotonin"],
        correct: 1,
        explanation: "Blue light suppresses melatonin production, making it harder to fall asleep when gaming before bedtime."
    },
    {
        question: "Which cognitive skill is enhanced by strategy games like chess or turn-based games?",
        options: ["Reaction time", "Problem-solving and planning", "Hand-eye coordination", "Memorization only"],
        correct: 1,
        explanation: "Strategy games enhance critical thinking, planning, and decision-making by requiring players to think multiple steps ahead."
    },
    {
        question: "What is a healthy gaming balance approach?",
        options: ["Gaming all day if you enjoy it", "Never gaming at all", "Mixing gaming with physical activity, social interaction, and sleep", "Gaming only on weekends"],
        correct: 2,
        explanation: "A balanced approach means ensuring gaming doesn't replace physical activity, social interaction, sleep, or other important aspects of a healthy lifestyle."
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let quizStarted = false;

function initQuiz() {
    const quizContainer = document.getElementById('quiz-content');
    quizContainer.innerHTML = '';
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    quizStarted = true;
    displayQuestion();
}

function displayQuestion() {
    const quizContainer = document.getElementById('quiz-content');
    const question = quizData[currentQuestionIndex];
    
    let html = `
        <div class="quiz-question">
            <h4>Question ${currentQuestionIndex + 1} of ${quizData.length}</h4>
            <p>${question.question}</p>
            <div class="quiz-options">
    `;
    
    question.options.forEach((option, index) => {
        const isSelected = userAnswers[currentQuestionIndex] === index;
        html += `
            <label class="quiz-option ${isSelected ? 'selected' : ''}">
                <input type="radio" name="quiz-option" value="${index}" ${isSelected ? 'checked' : ''} />
                ${option}
            </label>
        `;
    });
    
    html += '</div>';
    
    if (currentQuestionIndex > 0) {
        html += '<button class="quiz-nav-btn" onclick="prevQuestion()" style="margin-top: 1rem; margin-right: 0.5rem; padding: 0.5rem 1rem; background: #cbd5e0; border: none; border-radius: 6px; cursor: pointer;">← Back</button>';
    }
    
    if (currentQuestionIndex < quizData.length - 1) {
        html += '<button class="quiz-nav-btn" onclick="nextQuestion()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3182ce; color: white; border: none; border-radius: 6px; cursor: pointer;">Next →</button>';
    }
    
    quizContainer.innerHTML = html;
    
    // Add event listeners for radio buttons
    document.querySelectorAll('input[name="quiz-option"]').forEach((radio, index) => {
        radio.addEventListener('change', () => {
            userAnswers[currentQuestionIndex] = index;
            displayQuestion();
        });
    });
    
    // Show/hide submit button
    const submitBtn = document.getElementById('quiz-submit');
    if (currentQuestionIndex === quizData.length - 1) {
        submitBtn.style.display = 'block';
    } else {
        submitBtn.style.display = 'none';
    }
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function submitQuiz() {
    let score = 0;
    const feedbackHtml = document.getElementById('feedback-text');
    let feedback = '';
    
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
        
        const isCorrect = answer === quizData[index].correct;
        feedback += `
            <div class="feedback-item ${isCorrect ? 'correct' : 'incorrect'}">
                <strong>Q${index + 1}: ${quizData[index].question}</strong>
                <p><strong>Your answer:</strong> ${answer !== null ? quizData[index].options[answer] : 'Not answered'}</p>
                ${!isCorrect ? `<p><strong>Correct answer:</strong> ${quizData[index].options[quizData[index].correct]}</p>` : ''}
                <p><strong>Explanation:</strong> ${quizData[index].explanation}</p>
            </div>
        `;
    });
    
    document.getElementById('score-text').textContent = `You scored ${score} out of ${quizData.length}!`;
    feedbackHtml.innerHTML = feedback;
    
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-submit').style.display = 'none';
    document.getElementById('quiz-restart').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'block';
}

function restartQuiz() {
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-restart').style.display = 'none';
    initQuiz();
}

// Initialize quiz button listener
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('quiz-submit');
    const restartBtn = document.getElementById('quiz-restart');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitQuiz);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
    
    // Initialize quiz on page load if quiz section is visible
    const quizContent = document.getElementById('quiz-content');
    if (quizContent && quizContent.innerHTML === '') {
        initQuiz();
    }
});

// Pie Charts for Statistics
function initializeCharts() {
    const chartColor1 = '#667eea';
    const chartColor2 = '#764ba2';
    
    // Teen Gaming Participation Chart
    const participationCtx = document.getElementById('gamingParticipationChart');
    if (participationCtx) {
        new Chart(participationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Gamers', 'Non-Gamers'],
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#3182ce', '#cbd5e0'],
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: { size: 12 },
                            padding: 15
                        }
                    }
                }
            }
        });
    }
    
    // Weekly Time Breakdown Chart
    const weeklyCtx = document.getElementById('weeklyBreakdownChart');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Healthy Gaming (0-10 hrs)', 'Moderate (10-20 hrs)', 'At Risk (20+ hrs)'],
                datasets: [{
                    data: [60, 25, 15],
                    backgroundColor: ['#38a169', '#f6ad55', '#e53e3e'],
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: { size: 11 },
                            padding: 10
                        }
                    }
                }
            }
        });
    }
    
    // Gaming Research Focus Chart
    const researchCtx = document.getElementById('researchFocusChart');
    if (researchCtx) {
        new Chart(researchCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cognitive Benefits', 'Health Concerns', 'Social Impact', 'Brain Structure'],
                datasets: [{
                    data: [35, 30, 20, 15],
                    backgroundColor: ['#3182ce', '#e53e3e', '#9f7aea', '#38a169'],
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: { size: 10 },
                            padding: 10
                        }
                    }
                }
            }
        });
    }
    
    // Global Gaming Distribution Chart
    const globalCtx = document.getElementById('globalDistributionChart');
    if (globalCtx) {
        new Chart(globalCtx, {
            type: 'doughnut',
            data: {
                labels: ['Asia', 'Europe', 'North America', 'Other Regions'],
                datasets: [{
                    data: [50, 25, 15, 10],
                    backgroundColor: ['#f6ad55', '#3182ce', '#38a169', '#9f7aea'],
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: { size: 11 },
                            padding: 10
                        }
                    }
                }
            }
        });
    }
}

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
});

// Gaming Hours Calculator
const gamingHoursSlider = document.getElementById('gaming-hours');
const gamingHoursNumber = document.getElementById('hours-number');

if (gamingHoursSlider && gamingHoursNumber) {
    function updateCalculator() {
        const hours = parseInt(gamingHoursSlider.value);
        gamingHoursNumber.value = hours;
        displayCalculatorResults(hours);
    }
    
    gamingHoursSlider.addEventListener('input', updateCalculator);
    gamingHoursNumber.addEventListener('input', () => {
        const value = Math.min(Math.max(parseInt(gamingHoursNumber.value) || 0, 0), 70);
        gamingHoursSlider.value = value;
        gamingHoursNumber.value = value;
        displayCalculatorResults(value);
    });
    
    function displayCalculatorResults(hours) {
        const positiveEffectsList = document.getElementById('positive-effects-list');
        const concernEffectsList = document.getElementById('concern-effects-list');
        const recommendationText = document.getElementById('recommendation-text');
        
        let positiveEffects = [];
        let concerns = [];
        let recommendation = '';
        
        if (hours >= 1) {
            positiveEffects.push('Improved hand-eye coordination');
            positiveEffects.push('Enhanced reaction time');
            positiveEffects.push('Better problem-solving skills');
        }
        
        if (hours >= 5) {
            positiveEffects.push('Increased strategic thinking');
            positiveEffects.push('Improved focus and attention');
        }
        
        if (hours >= 10) {
            positiveEffects.push('Advanced cognitive skills');
            concerns.push('Potential eye strain from prolonged screen time');
        }
        
        if (hours >= 15) {
            concerns.push('May interfere with sleep if played late');
            concerns.push('Risk of reduced physical activity');
        }
        
        if (hours >= 25) {
            concerns.push('Potential for gaming addiction');
            concerns.push('May impact academic performance');
            concerns.push('Increased risk of social withdrawal');
        }
        
        if (hours >= 35) {
            concerns.push('Significant health concerns - very high risk');
            concerns.push('Strong likelihood of interference with daily responsibilities');
        }
        
        if (hours === 0) {
            recommendation = 'No gaming reported. Consider adding some gaming for cognitive benefits!';
        } else if (hours <= 10) {
            recommendation = 'Excellent! Your gaming habits are very healthy and balanced. You\'re getting cognitive benefits while maintaining other important activities.';
        } else if (hours <= 20) {
            recommendation = 'Good balance. Monitor your gaming time and ensure it doesn\'t interfere with sleep, school, and physical activity.';
        } else if (hours <= 30) {
            recommendation = 'Consider reducing gaming time. Try setting daily limits and taking regular breaks. Balance gaming with other activities.';
        } else {
            recommendation = 'High concern. Your gaming time may be affecting your health and responsibilities. Consider speaking with someone about healthy gaming habits.';
        }
        
        positiveEffectsList.innerHTML = positiveEffects.map(effect => `<li>${effect}</li>`).join('');
        concernEffectsList.innerHTML = concerns.map(concern => `<li>${concern}</li>`).join('');
        recommendationText.textContent = recommendation;
    }
    
    // Initialize on load
    displayCalculatorResults(10);
}
