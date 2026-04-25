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

