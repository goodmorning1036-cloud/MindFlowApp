/**
 * MindFlow Application Logic
 * 
 * Core Features:
 * - State Management (Idle -> Racing -> Completed)
 * - High Precision Timer (requestAnimationFrame)
 * - Ghost Mechanic (LocalStorage key: 'mindflow_ghost_[taskName]')
 */

// --- State ---
const state = {
    status: 'idle', // idle, racing, completed
    startTime: null,
    timerId: null,
    taskName: '',
    ghostDuration: null, // ms
    elapsed: 0,
};

// --- DOM Elements ---
const DOM = {
    app: document.getElementById('app-container'),
    // Views
    homeView: document.getElementById('home-view'),
    raceView: document.getElementById('race-view'),
    timerContainer: document.getElementById('timer-container'),
    // Inputs/Outputs
    input: document.getElementById('focus-input'),
    timerDisplay: document.getElementById('timer-display'),
    // Action Buttons
    actionContainer: document.getElementById('action-container'),
    startBtn: document.getElementById('start-btn'),
    completeBtn: document.getElementById('complete-btn'),
    // Race Elements
    youBar: document.getElementById('you-bar'),
    ghostBar: document.getElementById('ghost-bar'),
    ghostContainer: document.getElementById('ghost-container'),
    ghostTimeLabel: document.getElementById('ghost-time-label'),
    leadIndicator: document.getElementById('lead-indicator'),
    // Modal
    modal: document.getElementById('achievement-modal'),
    modalContent: document.getElementById('modal-content'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalTime: document.getElementById('modal-time'),
    modalDiff: document.getElementById('modal-diff'),
    closeModalBtn: document.getElementById('close-modal-btn'),
};

// --- Helpers ---
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
};

const getGhostKey = (task) => `mindflow_ghost_${task.trim().toLowerCase()}`;

// --- Logic ---

const init = () => {
    // Event Listeners
    DOM.startBtn.addEventListener('click', startRace);
    DOM.completeBtn.addEventListener('click', completeRace);
    DOM.closeModalBtn.addEventListener('click', resetApp);
    DOM.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startRace();
    });

    // Auto-focus input
    DOM.input.focus();
};

const startRace = () => {
    const taskName = DOM.input.value.trim();
    if (!taskName) {
        DOM.input.classList.add('animate-pulse');
        setTimeout(() => DOM.input.classList.remove('animate-pulse'), 500);
        return;
    }

    // Set State
    state.status = 'racing';
    state.taskName = taskName;
    state.startTime = performance.now();
    state.elapsed = 0;

    // Load Ghost
    const ghostData = localStorage.getItem(getGhostKey(taskName));
    if (ghostData) {
        state.ghostDuration = parseInt(ghostData, 10);
        DOM.ghostTimeLabel.innerText = formatTime(state.ghostDuration);
        DOM.ghostContainer.classList.remove('opacity-0', 'hidden');
        DOM.ghostContainer.classList.add('opacity-50'); // Visible but dim
    } else {
        state.ghostDuration = null;
        DOM.ghostTimeLabel.innerText = "--:--";
        DOM.ghostContainer.classList.add('opacity-0'); // Hide gracefully
    }

    // UI Transition
    transitionToRace();

    // Start Loop
    loop();
};

const loop = () => {
    if (state.status !== 'racing') return;

    const now = performance.now();
    state.elapsed = now - state.startTime;

    // Update Timer
    DOM.timerDisplay.innerHTML = formatTime(state.elapsed).replace('.', '<span class="text-3xl text-gray-400">.</span>');

    // Update Bars
    updateBars();

    requestAnimationFrame(loop);
};

const updateBars = () => {
    // Scaling base: If ghost exists, use ghost duration. Else default to 60s for visual feedback.
    const scaleDuration = state.ghostDuration || 60000; 
    
    // You Bar
    // If no ghost, we just grow slowly? Or loop? Let's grow to scaleDuration then cap or loop.
    // Spec: "Fills based on current elapsed time vs. the Ghost's total time."
    const youPercent = Math.min((state.elapsed / scaleDuration) * 100, 100);
    DOM.youBar.style.width = `${youPercent}%`;

    // Ghost Bar (Only if ghost exists)
    if (state.ghostDuration) {
        const ghostPercent = Math.min((state.elapsed / state.ghostDuration) * 100, 100);
        DOM.ghostBar.style.width = `${ghostPercent}%`;

        // Lead Indicator
        // We are comparing progress. Actually, since both bars move at the "same time rate", 
        // the visual difference is redundant if they are always equal width percentage-wise relative to themselves?
        // Wait. "Current Time vs Ghost Total Time".
        // Ghost Bar is FIXED LENGTH usually in race UIs? No, "Fills at a constant rate based on best time".
        // If they both fill at constant rate towards 100%, they will look identical until one stops?
        
        // CORRECTION:
        // Ghost Bar fills from 0 to 100% over GhostDuration.
        // You Bar fills from 0 to 100% over GhostDuration too? No.
        // If I am SLOWER, my bar should be SHORTER than Ghost at same real-time?
        // No, `elapsed` is same for both.
        // The visual race is usually: Position = Distance.
        // Distance = Work Done. But we don't measure work % (it's binary: done/not done).
        // So we are racing against TIME.
        // Visual Metaphor: The "Finish Line" is the GhostDuration.
        // Ghost reaches line at T = GhostDuration.
        // You reach line... whenever you click done.
        
        // So:
        // The Scale of the UI track is 0 to GhostDuration (plus maybe some buffer).
        // Ghost Cursor moves at 1px / unit-time.
        // You Cursor moves at 1px / unit-time.
        // They are... always together?
        
        // AH! The only way "Race" works is if "You" are AHEAD (Winning) meaning you FINISHED before the ghost.
        // So visually:
        // The track represents Time.
        // Ghost Bar is filling up to 100%.
        // You Bar is filling up to 100%.
        // They look essentially linked.
        
        // To make it interesting:
        // Maybe the Ghost Bar is FULL immediately (representing the target)? 
        // OR: Lead Indicator text is the key.
        // "Projected Finish"? No.
        
        // Let's stick to the prompt's implied logic:
        // "Lead Indicator: Display... if user is ahead or behind".
        // You are "Ahead" if Elapsed < GhostDuration (implying you *might* beat it).
        // You are "Behind" if Elapsed > GhostDuration (you already failed).
        
        // Visual:
        // Ghost Bar fills 0->100% over GhostDuration.
        // You Bar fills 0->100% over GhostDuration?
        // If Elapsed > GhostDuration: You Bar overflows or color changes?
        // Let's change You Bar color to Red/Orange if Elapsed > GhostDuration.
        
        const timeDiff = state.ghostDuration - state.elapsed;
        const diffSecs = (timeDiff / 1000).toFixed(1);
        
        if (timeDiff > 0) {
            // Ahead (Still have time)
            DOM.leadIndicator.innerHTML = `<span class="text-green-400">-${diffSecs}s</span>`;
            DOM.leadIndicator.classList.remove('opacity-0');
        } else {
            // Behind (Overtime)
            DOM.leadIndicator.innerHTML = `<span class="text-red-400">+${Math.abs(diffSecs)}s</span>`;
            DOM.youBar.classList.remove('from-electric-blue', 'to-neon-cyan');
            DOM.youBar.classList.add('bg-red-500'); // Simple override
        }
    }
};

const completeRace = () => {
    state.status = 'completed';
    const finalTime = state.elapsed;
    
    // Logic: Did we beat the ghost?
    // If no ghost: Yes (Personal Best).
    // If ghost: Is Final < Ghost?
    
    let isNewBest = false;
    let timeSaved = 0;

    if (!state.ghostDuration || finalTime < state.ghostDuration) {
        isNewBest = true;
        if (state.ghostDuration) {
            timeSaved = state.ghostDuration - finalTime;
        }
        // Save new best
        localStorage.setItem(getGhostKey(state.taskName), finalTime);
    } else {
        timeSaved = finalTime - state.ghostDuration;
    }

    showModal(isNewBest, finalTime, timeSaved);
};

const showModal = (isBest, final, diff) => {
    DOM.modal.classList.remove('pointer-events-none', 'opacity-0');
    DOM.modalContent.classList.remove('scale-95');
    DOM.modalContent.classList.add('scale-100');

    DOM.modalTime.innerText = formatTime(final);

    if (isBest) {
        DOM.modalTitle.innerText = "New Personal Best";
        DOM.modalSubtitle.innerText = "You beat your past self.";
        DOM.modalDiff.className = "text-xl font-mono text-neon-cyan";
        DOM.modalDiff.innerText = state.ghostDuration ? `-${(diff/1000).toFixed(2)}s` : "First Run";
    } else {
        DOM.modalTitle.innerText = "Task Complete";
        DOM.modalSubtitle.innerText = "Keep pushing.";
        DOM.modalDiff.className = "text-xl font-mono text-gray-400";
        DOM.modalDiff.innerText = `+${(diff/1000).toFixed(2)}s`;
    }
};

const resetApp = () => {
    // Reset State
    state.status = 'idle';
    state.elapsed = 0;
    
    // UI Reset
    DOM.modal.classList.add('opacity-0', 'pointer-events-none');
    DOM.modalContent.classList.add('scale-95');
    DOM.modalContent.classList.remove('scale-100');
    
    DOM.input.value = '';
    DOM.timerDisplay.innerHTML = "00:00.<span class='text-3xl text-gray-400'>00</span>";
    
    // Bars Reset
    DOM.youBar.style.width = '0%';
    DOM.ghostBar.style.width = '0%';
    DOM.youBar.classList.add('from-electric-blue', 'to-neon-cyan');
    DOM.youBar.classList.remove('bg-red-500');
    DOM.leadIndicator.classList.add('opacity-0');

    transitionToHome();
};

// --- Transitions ---

const transitionToRace = () => {
    // Hide Home
    DOM.homeView.classList.add('opacity-0', 'pointer-events-none');
    
    // Show Timer & Race
    DOM.timerContainer.classList.remove('opacity-0', 'translate-y-[-20px]');
    DOM.raceView.classList.remove('opacity-0', 'pointer-events-none');
    
    // Swap Buttons
    DOM.startBtn.classList.add('hidden');
    DOM.completeBtn.classList.remove('hidden');
    DOM.actionContainer.classList.remove('mt-48'); // Move button up/adjust layout
    DOM.actionContainer.classList.add('mt-24');
};

const transitionToHome = () => {
    // Show Home
    DOM.homeView.classList.remove('opacity-0', 'pointer-events-none');
    
    // Hide Timer & Race
    DOM.timerContainer.classList.add('opacity-0', 'translate-y-[-20px]');
    DOM.raceView.classList.add('opacity-0', 'pointer-events-none');
    
    // Swap Buttons
    DOM.startBtn.classList.remove('hidden');
    DOM.completeBtn.classList.add('hidden');
    DOM.actionContainer.classList.add('mt-48');
    DOM.actionContainer.classList.remove('mt-24');
};

// Init
window.addEventListener('DOMContentLoaded', init);
