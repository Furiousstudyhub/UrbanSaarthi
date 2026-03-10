// Core State
let currentScreen = 1;
const totalScreens = 4;

// Navigation
function goToScreen(screenNumber) {
    // Hide all
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target
    document.getElementById(`screen-${screenNumber}`).classList.add('active');
    document.getElementById('screen-ind').innerText = `${screenNumber} / ${totalScreens}`;

    currentScreen = screenNumber;

    // Trigger AI Animation on Screen 2
    if (screenNumber === 2) {
        startAIAnimation();
    }
}

function nextScreen() {
    if (currentScreen < totalScreens) goToScreen(currentScreen + 1);
}

function prevScreen() {
    if (currentScreen > 1) goToScreen(currentScreen - 1);
}

// Unit Selector Logic (Screen 1)
let units = 3;
const unitCountEl = document.getElementById('unit-count');

document.getElementById('unit-minus').addEventListener('click', () => {
    if (units > 1) {
        units--;
        unitCountEl.innerText = units;
    }
});

document.getElementById('unit-plus').addEventListener('click', () => {
    if (units < 10) {
        units++;
        unitCountEl.innerText = units;
    }
});

// Urgency Selector Logic (Screen 1)
const urgencyCards = document.querySelectorAll('.urgency-card');
urgencyCards.forEach(card => {
    card.addEventListener('click', () => {
        urgencyCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// Blood Group Selector Logic (Screen 1)
const bloodPills = document.querySelectorAll('.blood-pill');
bloodPills.forEach(pill => {
    pill.addEventListener('click', () => {
        bloodPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
    });
});

// AI Animation Sequence (Screen 2)
function startAIAnimation() {
    const stepsContainer = document.querySelector('.scanning-steps');
    const counterEl = document.getElementById('scan-counter');
    const progressFill = document.getElementById('scan-progress');
    const progressText = document.getElementById('scan-percent');

    // Reset state
    stepsContainer.innerHTML = '';
    counterEl.innerText = '2,00,000';
    progressFill.style.width = '0%';
    progressText.innerText = '0% complete';

    const steps = [
        {
            icon: '✅',
            text: 'Blood group B+ filter applied',
            result: '847,291 citizens scanned',
            color: 'green'
        },
        {
            icon: '✅',
            text: 'Eligibility check complete',
            result: 'Last donation > 90 days verified',
            color: 'muted'
        },
        {
            icon: '🔄',
            text: 'Location proximity calculating...',
            result: 'Ward 47 + nearby wards',
            color: 'saffron',
            spin: true
        },
        {
            icon: '⏳',
            text: 'Donor willingness filter...',
            result: '',
            color: 'muted',
            waiting: true
        }
    ];

    // Number Animation
    let currentCount = 200000;
    const targetCount = 847;
    const duration = 2400; // 2.4s
    const steps_num = 60;
    const decrement = (currentCount - targetCount) / steps_num;

    let stepCount = 0;
    const counterInterval = setInterval(() => {
        currentCount -= decrement;
        stepCount++;

        // Update Progress
        const percent = Math.min(Math.round((stepCount / steps_num) * 100), 100);
        progressFill.style.width = `${percent}%`;
        progressText.innerText = `${percent}% complete`;

        if (stepCount >= steps_num) {
            clearInterval(counterInterval);
            counterEl.innerText = targetCount.toLocaleString();

            // Auto advance
            setTimeout(() => {
                goToScreen(3);
            }, 800);
        } else {
            counterEl.innerText = Math.round(currentCount).toLocaleString();
        }
    }, duration / steps_num);

    // Step Reveal Animation
    steps.forEach((step, index) => {
        setTimeout(() => {
            const stepHtml = `
                <div class="scan-step">
                    <div class="step-icon ${step.spin ? 'spinning' : ''}">${step.icon}</div>
                    <div class="step-text ${step.waiting ? 'waiting' : ''}">${step.text}</div>
                    <div class="step-result ${step.color === 'green' ? 'green' : ''}">${step.result}</div>
                </div>
            `;
            stepsContainer.insertAdjacentHTML('beforeend', stepHtml);

            // Trigger reflow for animation
            setTimeout(() => {
                const addedStep = stepsContainer.lastElementChild;
                if (addedStep) addedStep.classList.add('visible');
            }, 50);

        }, index * 600); // 0.6s delay between steps
    });
}

// Donor Accept Action (Screen 4)
function acceptDonation() {
    document.getElementById('donor-card-main').style.display = 'none';
    document.getElementById('donor-success').style.display = 'block';
}

// Initialize
goToScreen(1);
