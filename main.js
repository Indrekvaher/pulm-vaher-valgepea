/* =========================================================
   Mihkel & Nele — Pulmaveebisait | main.js
   ========================================================= */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ── Shared Utilities ─────────────────────────────────────
function padTwo(n) {
    return String(n).padStart(2, '0');
}

function $(id) {
    return document.getElementById(id);
}

function createScrollObserver(selector, { threshold = 0.12, staggerDelay = 0 } = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.classList.add('will-animate'));

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold });

    elements.forEach((el, i) => {
        if (staggerDelay) el.dataset.delay = i * staggerDelay;
        obs.observe(el);
    });

    return obs;
}

// ── Countdown Timer ───────────────────────────────────────
const weddingDate = new Date('2026-08-08T14:00:00+03:00');
const cdEls = {
    days: $('cd-days'),
    hours: $('cd-hours'),
    mins: $('cd-mins'),
    secs: $('cd-secs'),
};

function updateCountdown() {
    if (!cdEls.days || !cdEls.hours || !cdEls.mins || !cdEls.secs) return;

    const diff = weddingDate - new Date();

    if (diff <= 0) {
        cdEls.days.textContent = '00';
        cdEls.hours.textContent = '00';
        cdEls.mins.textContent = '00';
        cdEls.secs.textContent = '00';
        return;
    }

    const MS_HOUR = 1000 * 60 * 60;
    const MS_DAY = MS_HOUR * 24;

    cdEls.days.textContent = padTwo(Math.floor(diff / MS_DAY));
    cdEls.hours.textContent = padTwo(Math.floor((diff % MS_DAY) / MS_HOUR));
    cdEls.mins.textContent = padTwo(Math.floor((diff % MS_HOUR) / (1000 * 60)));
    cdEls.secs.textContent = padTwo(Math.floor((diff % (1000 * 60)) / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Scroll Animation (IntersectionObserver) ───────────────
createScrollObserver('.timeline-item, .accom-card', { staggerDelay: 80 });

// ── RSVP Form handling ────────────────────────────────────
// Check if Google Form iframe loads (has real URL) or fall back to local form
const iframe = $('rsvp-iframe');
const fallback = $('rsvpFallback');
const PLACEHOLDER_SRC = 'PLACEHOLDER';

if (iframe && fallback) {
    if (iframe.src.includes(PLACEHOLDER_SRC) || iframe.src === '') {
        // No real Google Form URL — show fallback form
        iframe.style.display = 'none';
        fallback.style.display = 'block';
    } else {
        // Real Google Form URL set — show iframe
        iframe.style.display = 'block';
        fallback.style.display = 'none';
    }
} else if (iframe) {
    iframe.style.display = 'none';
}

// Local fallback form submission
const rsvpForm = $('rsvpForm');
const rsvpSuccess = $('rsvpSuccess');
const rsvpError = $('rsvpError');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('rsvp-submit');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = 'Saadan...';

        // Hide any previous error message
        if (rsvpError) rsvpError.style.display = 'none';

        try {
            const nameEl = $('rsvp-name');
            const emailEl = $('rsvp-email');
            const attendEl = $('rsvp-attend');
            const dietaryEl = $('rsvp-dietary');
            const messageEl = $('rsvp-message');

            if (!nameEl || !emailEl || !attendEl) {
                throw new Error('Vormi väljad puuduvad. Palun laadige leht uuesti.');
            }

            const data = {
                name: nameEl.value,
                email: emailEl.value,
                attend: attendEl.value,
                dietary: dietaryEl ? dietaryEl.value : '',
                message: messageEl ? messageEl.value : '',
                timestamp: new Date().toISOString()
            };

            rsvpForm.style.display = 'none';
            if (rsvpSuccess) {
                rsvpSuccess.style.display = 'block';
                rsvpSuccess.style.animation = 'fadeInUp 0.6s ease both';
            }

            // Log data to console (for testing / Netlify Forms etc.)
            console.log('RSVP kinnitus:', data);
        } catch (error) {
            console.error('RSVP vormi viga:', error);
            btn.disabled = false;
            btn.textContent = 'Saada kinnitus ✦';
            if (rsvpError) {
                rsvpError.textContent = error.message || 'Midagi läks valesti. Palun proovige uuesti.';
                rsvpError.style.display = 'block';
            }
        }
    });
}

// ── Seating Search ────────────────────────────────────────
// Replace / extend this list with real guest data after RSVPs are confirmed
const guestData = [
    // Format: { name: 'Eesnimi Perekonnanimi', table: 1, seat: 'Laud 1 – Istekoht 3' }
    // Näidis andmed (kustutage ja lisage päris külalised):
    { name: 'Mihkel Vaher', table: 1, info: 'Laud 1 – Perepaar (Pruutpaar)' },
    { name: 'Nele Valgepea', table: 1, info: 'Laud 1 – Perepaar (Pruutpaar)' },
    { name: 'Indrek Vaher', table: 2, info: 'Laud 2 – Perekond' },
    { name: 'Külaline Näide', table: 3, info: 'Laud 3 – Sõbrad' },
];

function searchSeat() {
    const searchEl = $('seatSearch');
    const result = $('seatResult');

    if (!searchEl || !result) return;

    const query = searchEl.value.trim().toLowerCase();

    if (query.length < 2) {
        result.textContent = '';
        result.className = 'seat-result';
        return;
    }

    const match = guestData.find(g => g.name.toLowerCase().includes(query));

    if (match) {
        result.textContent = '';
        const symbol = document.createTextNode('✦ ');
        const strong = document.createElement('strong');
        strong.textContent = match.name;
        const info = document.createTextNode(' — ' + match.info);
        result.appendChild(symbol);
        result.appendChild(strong);
        result.appendChild(info);
        result.className = 'seat-result found';
    } else {
        result.textContent = 'Nime ei leitud. Kontrollige kirjaviisi või võtke meiega ühendust.';
        result.className = 'seat-result notfound';
    }
}

// Attach event listener programmatically (CSP-compatible, no inline handler)
const seatSearchInput = $('seatSearch');
if (seatSearchInput) {
    seatSearchInput.addEventListener('input', searchSeat);
}

// ── Smooth active nav link highlighting ──────────────────
const navHighlightLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navHighlightLinks.forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}`
                    ? 'var(--gold)'
                    : 'rgba(255,255,255,0.85)';
            });
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));
