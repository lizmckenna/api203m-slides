/* ===========================================
   API-203M Slide Deck — Shared JavaScript
   Progressive Reveal Controller + Utilities
   =========================================== */

class SlidePresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.currentStep = 0;
        this.totalSlides = this.slides.length;

        this.init();
        this.bindEvents();
    }

    init() {
        this.revealStep(this.slides[0], 0);
        this.updateStepIndicator(this.slides[0]);
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKey(e));
        document.addEventListener('click', (e) => {
            // Ignore clicks on links (nav, etc.)
            if (e.target.closest('a, .section-nav')) return;
            this.nextStep();
        });

        // Section nav: jump to the target slide
        document.querySelectorAll('.section-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetId = link.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const idx = Array.from(this.slides).indexOf(targetEl);
                    if (idx >= 0) {
                        this.currentSlide = idx;
                        this.currentStep = 0;
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => this.revealStep(targetEl, 0), 300);
                    }
                }
            });
        });

        // Touch support
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', (e) => {
            const diff = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextStep() : this.prevStep();
            }
        });
    }

    handleKey(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':  // Wireless clickers send PageDown
                e.preventDefault();
                this.nextStep();
                break;
            case 'ArrowLeft':
            case 'PageUp':    // Wireless clickers send PageUp
                e.preventDefault();
                this.prevStep();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.prevSlide();
                break;
        }
    }

    getSlideSteps(slide) {
        const items = slide.querySelectorAll('.reveal-item');
        // Check if any items have data-group attribute
        const hasGroups = Array.from(items).some(item => item.dataset.group);

        if (hasGroups) {
            // Collect ungrouped items first (in DOM order)
            const ungroupedSteps = [];
            const groupedItems = new Map();

            items.forEach(item => {
                const group = item.dataset.group;
                if (group) {
                    if (!groupedItems.has(group)) {
                        groupedItems.set(group, []);
                    }
                    groupedItems.get(group).push(item);
                } else {
                    // Ungrouped item = its own step
                    ungroupedSteps.push([item]);
                }
            });

            // Sort groups numerically and add after ungrouped
            const sortedGroups = Array.from(groupedItems.keys()).sort((a, b) => {
                const numA = parseInt(a) || 0;
                const numB = parseInt(b) || 0;
                return numA - numB;
            });

            const groupedSteps = sortedGroups.map(group => groupedItems.get(group));
            return [...ungroupedSteps, ...groupedSteps];
        }

        // No groups, return items as single-element arrays
        return Array.from(items).map(item => [item]);
    }

    revealStep(slide, stepIndex) {
        const steps = this.getSlideSteps(slide);
        steps.forEach((stepItems, i) => {
            stepItems.forEach(item => {
                item.classList.toggle('visible', i <= stepIndex);
            });
        });
        this.updateStepIndicator(slide, stepIndex);
    }

    updateStepIndicator(slide, currentStep = 0) {
        const dots = slide.querySelectorAll('.step-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'complete');
            if (i < currentStep) dot.classList.add('complete');
            else if (i === currentStep) dot.classList.add('active');
        });
    }

    getStepCount(slide) {
        return this.getSlideSteps(slide).length;
    }

    nextStep() {
        const slide = this.slides[this.currentSlide];
        const totalSteps = this.getStepCount(slide);

        if (this.currentStep < totalSteps - 1) {
            this.currentStep++;
            this.revealStep(slide, this.currentStep);
        } else {
            this.nextSlide();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.revealStep(this.slides[this.currentSlide], this.currentStep);
        } else if (this.currentSlide > 0) {
            this.prevSlide();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            // Reveal all on current slide first
            const currentSlideEl = this.slides[this.currentSlide];
            const totalSteps = this.getStepCount(currentSlideEl);
            this.revealStep(currentSlideEl, totalSteps - 1);

            this.currentSlide++;
            this.currentStep = 0;
            this.slides[this.currentSlide].scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                this.revealStep(this.slides[this.currentSlide], 0);
            }, 300);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            const slide = this.slides[this.currentSlide];
            const totalSteps = this.getStepCount(slide);
            this.currentStep = totalSteps - 1;
            this.revealStep(slide, this.currentStep);
            slide.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize presentation
const presentation = new SlidePresentation();

// Prevent address bar from reappearing in fullscreen
document.addEventListener('scroll', (e) => {
    if (document.fullscreenElement) {
        e.preventDefault();
    }
}, { passive: false });

// Smooth scroll override to prevent browser UI triggers
document.querySelectorAll('.slide').forEach(slide => {
    slide.style.scrollBehavior = 'auto';
});

// Print preparation - reveal all content before printing
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal-item').forEach(item => {
        item.classList.add('visible');
    });
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// Keyboard shortcut: Cmd+Shift+P to prepare for print
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        document.querySelectorAll('.reveal-item').forEach(item => {
            item.classList.add('visible');
        });
        alert('All slides revealed. Now use Cmd+P to print/save as PDF.\n\nTip: Enable "Background graphics" in print settings.');
    }
});

/* ===========================================
   COUNTDOWN TIMER (optional — include on
   slides with id="timer-slide")
   =========================================== */
class CountdownTimer {
    constructor() {
        this.display = document.getElementById('countdown-display');
        this.hint = document.getElementById('timer-hint');
        this.timerSlide = document.getElementById('timer-slide');
        // Parse duration from display text (e.g. "05:00" → 300s, "10:00" → 600s)
        if (this.display) {
            const match = this.display.textContent.trim().match(/(\d+):(\d+)/);
            this.duration = match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 5 * 60;
        } else {
            this.duration = 5 * 60;
        }
        this.remaining = this.duration;
        this.interval = null;
        this.running = false;
        this.audioContext = null;

        if (this.display) {
            this.display.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent slide advance
                this.toggle();
            });
        }
    }

    toggle() {
        if (this.running) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (this.remaining <= 0) {
            this.reset();
        }
        this.running = true;
        this.hint.textContent = 'Click to pause';
        this.display.style.transform = 'scale(1.02)';
        setTimeout(() => this.display.style.transform = '', 100);

        this.interval = setInterval(() => {
            this.remaining--;
            this.updateDisplay();

            if (this.remaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.running = false;
        clearInterval(this.interval);
        this.hint.textContent = 'Click to resume';
    }

    reset() {
        this.remaining = this.duration;
        this.updateDisplay();
        this.hint.textContent = 'Click timer to start';
    }

    complete() {
        clearInterval(this.interval);
        this.running = false;
        this.display.textContent = "Time's up!";
        this.display.style.color = '#ff3300';
        this.display.style.animation = 'pulse 1s ease-in-out 3';
        this.hint.textContent = 'Click to reset';
        this.playChime();
    }

    updateDisplay() {
        const mins = Math.floor(this.remaining / 60);
        const secs = this.remaining % 60;
        this.display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Color change in last 30 seconds
        if (this.remaining <= 30 && this.remaining > 0) {
            this.display.style.color = '#ff3300';
        } else if (this.remaining > 30) {
            this.display.style.color = '';
        }
    }

    playChime() {
        // Gentle chime using Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            const playTone = (freq, startTime, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                // Gentle envelope
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            const now = this.audioContext.currentTime;
            // Gentle ascending chime (C5 - E5 - G5)
            playTone(523.25, now, 0.5);        // C5
            playTone(659.25, now + 0.3, 0.5);  // E5
            playTone(783.99, now + 0.6, 0.8);  // G5
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

const timer = new CountdownTimer();
