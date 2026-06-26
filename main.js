/* =========================================================
   Mihkel & Nele — Pulmaveebisait | main.js
   ========================================================= */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

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

if (iframe.src.includes(PLACEHOLDER_SRC) || iframe.src === '') {
    iframe.style.display = 'none';
    fallback.style.display = 'block';
} else {
    iframe.style.display = 'block';
    fallback.style.display = 'none';
}

// Local fallback form submission
const rsvpForm = $('rsvpForm');
const rsvpSuccess = $('rsvpSuccess');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('rsvp-submit');
        btn.disabled = true;
        btn.textContent = 'Saadan...';

        const data = {
            name: $('rsvp-name').value,
            email: $('rsvp-email').value,
            attend: $('rsvp-attend').value,
            dietary: $('rsvp-dietary').value,
            message: $('rsvp-message').value,
            timestamp: new Date().toISOString()
        };

        // ── Google Forms auto-submit option ──────────────────
        // If you want to use Google Forms without iframe,
        // find your form's action URL and field names, then:
        // const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
        // const formData = new FormData();
        // formData.append('entry.XXXXXXX', data.name);   // replace with real entry IDs
        // formData.append('entry.YYYYYYY', data.email);
        // fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: formData });

        // Simulate success (replace above with real integration)
        await new Promise(r => setTimeout(r, 900));

        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
        rsvpSuccess.style.animation = 'fadeInUp 0.6s ease both';


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
    const query = $('seatSearch').value.trim().toLowerCase();
    const result = $('seatResult');

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
document.getElementById('seatSearch').addEventListener('input', searchSeat);

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
