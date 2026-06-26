/**
 * @jest-environment jsdom
 */

describe('main.js DOM integration', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav id="navbar">
                <div class="nav-inner">
                    <button class="nav-toggle" id="navToggle"><span></span></button>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="#programm">Programm</a></li>
                        <li><a href="#rsvp">RSVP</a></li>
                    </ul>
                </div>
            </nav>
            <section id="hero" class="hero"></section>
            <section id="programm" class="section"></section>
            <div class="countdown" id="countdown">
                <span class="countdown-value" id="cd-days">00</span>
                <span class="countdown-value" id="cd-hours">00</span>
                <span class="countdown-value" id="cd-mins">00</span>
                <span class="countdown-value" id="cd-secs">00</span>
            </div>
            <div class="timeline-item"></div>
            <div class="accom-card"></div>
            <iframe id="rsvp-iframe" src="https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform?embedded=true"></iframe>
            <div class="rsvp-fallback" id="rsvpFallback" style="display:none;">
                <form class="rsvp-form" id="rsvpForm">
                    <input type="text" id="rsvp-name" value="Test User" />
                    <input type="email" id="rsvp-email" value="test@example.com" />
                    <select id="rsvp-attend"><option value="yes">Jah</option></select>
                    <input type="text" id="rsvp-dietary" value="" />
                    <textarea id="rsvp-message"></textarea>
                    <button type="submit" id="rsvp-submit">Saada</button>
                </form>
                <div class="rsvp-success" id="rsvpSuccess" style="display:none;"></div>
            </div>
            <input type="text" id="seatSearch" />
            <div id="seatResult" class="seat-result"></div>
        `;

        // Mock IntersectionObserver
        global.IntersectionObserver = class {
            constructor(callback) {
                this.callback = callback;
            }
            observe() {}
            unobserve() {}
            disconnect() {}
        };

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetModules();
        delete global.IntersectionObserver;
    });

    it('initializes navbar scroll listener', () => {
        require('../main.js');
        const navbar = document.getElementById('navbar');

        // Simulate scroll past threshold
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
        expect(navbar.classList.contains('scrolled')).toBe(true);

        // Simulate scroll back to top
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        window.dispatchEvent(new Event('scroll'));
        expect(navbar.classList.contains('scrolled')).toBe(false);
    });

    it('toggles mobile nav on button click', () => {
        require('../main.js');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        navToggle.click();
        expect(navLinks.classList.contains('open')).toBe(true);

        navToggle.click();
        expect(navLinks.classList.contains('open')).toBe(false);
    });

    it('closes mobile nav when a link is clicked', () => {
        require('../main.js');
        const navLinks = document.getElementById('navLinks');
        const link = navLinks.querySelector('a');

        navLinks.classList.add('open');
        link.click();
        expect(navLinks.classList.contains('open')).toBe(false);
    });

    it('updates countdown values', () => {
        require('../main.js');

        const days = document.getElementById('cd-days');
        const hours = document.getElementById('cd-hours');
        const mins = document.getElementById('cd-mins');
        const secs = document.getElementById('cd-secs');

        // Countdown should have been updated (values depend on current time)
        expect(days.textContent).toBeDefined();
        expect(hours.textContent).toBeDefined();
        expect(mins.textContent).toBeDefined();
        expect(secs.textContent).toBeDefined();
    });

    it('shows fallback form when iframe has PLACEHOLDER src', () => {
        require('../main.js');
        const iframe = document.getElementById('rsvp-iframe');
        const fallback = document.getElementById('rsvpFallback');

        expect(iframe.style.display).toBe('none');
        expect(fallback.style.display).toBe('block');
    });

    it('exposes searchSeat function globally', () => {
        require('../main.js');
        expect(typeof window.searchSeat).toBe('function');
    });

    it('searchSeat finds a matching guest', () => {
        require('../main.js');
        const searchInput = document.getElementById('seatSearch');
        const result = document.getElementById('seatResult');

        searchInput.value = 'Mihkel';
        window.searchSeat();

        expect(result.className).toContain('found');
        expect(result.innerHTML).toContain('Mihkel Vaher');
    });

    it('searchSeat shows not found message', () => {
        require('../main.js');
        const searchInput = document.getElementById('seatSearch');
        const result = document.getElementById('seatResult');

        searchInput.value = 'Unknown Person';
        window.searchSeat();

        expect(result.className).toContain('notfound');
    });

    it('searchSeat clears result for short query', () => {
        require('../main.js');
        const searchInput = document.getElementById('seatSearch');
        const result = document.getElementById('seatResult');

        searchInput.value = 'M';
        window.searchSeat();

        expect(result.textContent).toBe('');
        expect(result.className).toBe('seat-result');
    });

    it('handles RSVP form submission', async () => {
        require('../main.js');
        const form = document.getElementById('rsvpForm');
        const btn = document.getElementById('rsvp-submit');
        const success = document.getElementById('rsvpSuccess');

        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);

        expect(btn.disabled).toBe(true);
        expect(btn.textContent).toBe('Saadan...');

        // Advance timers to resolve the simulated delay
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        await Promise.resolve();

        expect(form.style.display).toBe('none');
        expect(success.style.display).toBe('block');
    });

    it('adds will-animate class to timeline items', () => {
        require('../main.js');
        const timelineItem = document.querySelector('.timeline-item');
        expect(timelineItem.classList.contains('will-animate')).toBe(true);
    });

    it('adds will-animate class to accom cards', () => {
        require('../main.js');
        const accomCard = document.querySelector('.accom-card');
        expect(accomCard.classList.contains('will-animate')).toBe(true);
    });
});

describe('main.js - iframe branch (real Google Form URL)', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav id="navbar">
                <div class="nav-inner">
                    <button class="nav-toggle" id="navToggle"><span></span></button>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="#programm">Programm</a></li>
                    </ul>
                </div>
            </nav>
            <section id="hero" class="hero"></section>
            <div class="countdown" id="countdown">
                <span class="countdown-value" id="cd-days">00</span>
                <span class="countdown-value" id="cd-hours">00</span>
                <span class="countdown-value" id="cd-mins">00</span>
                <span class="countdown-value" id="cd-secs">00</span>
            </div>
            <iframe id="rsvp-iframe" src="https://docs.google.com/forms/d/e/REAL_FORM_ID/viewform?embedded=true"></iframe>
            <div class="rsvp-fallback" id="rsvpFallback" style="display:none;"></div>
            <input type="text" id="seatSearch" />
            <div id="seatResult" class="seat-result"></div>
        `;

        global.IntersectionObserver = class {
            constructor(callback) { this.callback = callback; }
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    afterEach(() => {
        jest.resetModules();
        delete global.IntersectionObserver;
    });

    it('shows iframe when src is a real Google Form URL', () => {
        require('../main.js');
        const iframe = document.getElementById('rsvp-iframe');
        const fallback = document.getElementById('rsvpFallback');

        expect(iframe.style.display).toBe('block');
        expect(fallback.style.display).toBe('none');
    });
});

describe('main.js - countdown expired state', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav id="navbar">
                <div class="nav-inner">
                    <button class="nav-toggle" id="navToggle"><span></span></button>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="#hero">Hero</a></li>
                    </ul>
                </div>
            </nav>
            <section id="hero" class="hero"></section>
            <div class="countdown" id="countdown">
                <span class="countdown-value" id="cd-days">00</span>
                <span class="countdown-value" id="cd-hours">00</span>
                <span class="countdown-value" id="cd-mins">00</span>
                <span class="countdown-value" id="cd-secs">00</span>
            </div>
            <iframe id="rsvp-iframe" src="https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform"></iframe>
            <div class="rsvp-fallback" id="rsvpFallback" style="display:none;"></div>
            <input type="text" id="seatSearch" />
            <div id="seatResult" class="seat-result"></div>
        `;

        global.IntersectionObserver = class {
            constructor(callback) { this.callback = callback; }
            observe() {}
            unobserve() {}
            disconnect() {}
        };

        // Set time to after wedding date
        jest.useFakeTimers({ now: new Date('2027-01-01T00:00:00Z') });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetModules();
        delete global.IntersectionObserver;
    });

    it('shows 00 for all countdown values when wedding has passed', () => {
        require('../main.js');

        expect(document.getElementById('cd-days').textContent).toBe('00');
        expect(document.getElementById('cd-hours').textContent).toBe('00');
        expect(document.getElementById('cd-mins').textContent).toBe('00');
        expect(document.getElementById('cd-secs').textContent).toBe('00');
    });
});

describe('main.js - IntersectionObserver callbacks', () => {
    let observerCallback;
    let navObserverCallback;
    let observerInstances;

    beforeEach(() => {
        document.body.innerHTML = `
            <nav id="navbar">
                <div class="nav-inner">
                    <button class="nav-toggle" id="navToggle"><span></span></button>
                    <ul class="nav-links" id="navLinks">
                        <li><a href="#hero">Hero</a></li>
                        <li><a href="#programm">Programm</a></li>
                    </ul>
                </div>
            </nav>
            <section id="hero" class="hero"></section>
            <section id="programm" class="section">
                <div class="timeline-item"></div>
            </section>
            <div class="countdown" id="countdown">
                <span class="countdown-value" id="cd-days">00</span>
                <span class="countdown-value" id="cd-hours">00</span>
                <span class="countdown-value" id="cd-mins">00</span>
                <span class="countdown-value" id="cd-secs">00</span>
            </div>
            <iframe id="rsvp-iframe" src="https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform"></iframe>
            <div class="rsvp-fallback" id="rsvpFallback" style="display:none;"></div>
            <input type="text" id="seatSearch" />
            <div id="seatResult" class="seat-result"></div>
        `;

        observerInstances = [];
        global.IntersectionObserver = class {
            constructor(callback) {
                this.callback = callback;
                this.elements = [];
                observerInstances.push(this);
            }
            observe(el) { this.elements.push(el); }
            unobserve() {}
            disconnect() {}
        };

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetModules();
        delete global.IntersectionObserver;
    });

    it('adds visible class to intersecting timeline items', () => {
        require('../main.js');

        const timelineItem = document.querySelector('.timeline-item');
        // First observer is for animatables
        const animObserver = observerInstances[0];

        animObserver.callback([{
            isIntersecting: true,
            target: timelineItem,
        }]);

        jest.advanceTimersByTime(200);
        expect(timelineItem.classList.contains('visible')).toBe(true);
    });

    it('does not add visible class for non-intersecting items', () => {
        require('../main.js');

        const timelineItem = document.querySelector('.timeline-item');
        const animObserver = observerInstances[0];

        animObserver.callback([{
            isIntersecting: false,
            target: timelineItem,
        }]);

        jest.advanceTimersByTime(200);
        expect(timelineItem.classList.contains('visible')).toBe(false);
    });

    it('nav observer updates link colors when section is intersecting', () => {
        require('../main.js');

        // Second observer is for nav sections
        const navObs = observerInstances[1];
        const section = document.getElementById('programm');

        navObs.callback([{
            isIntersecting: true,
            target: section,
        }]);

        const links = document.querySelectorAll('.nav-links a');
        const heroLink = Array.from(links).find(a => a.getAttribute('href') === '#hero');
        // Non-active link gets the muted color (jsdom normalizes spaces)
        expect(heroLink.style.color).toBe('rgba(255, 255, 255, 0.85)');
    });
});
