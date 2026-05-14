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

// ── Countdown Timer ───────────────────────────────────────
// Wedding date: 8 August 2026 at 14:00 EET (UTC+3)
const weddingDate = new Date('2026-08-08T14:00:00+03:00');

function padTwo(n) {
    return String(n).padStart(2, '0');
}

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent = '00';
        document.getElementById('cd-secs').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = padTwo(days);
    document.getElementById('cd-hours').textContent = padTwo(hours);
    document.getElementById('cd-mins').textContent = padTwo(mins);
    document.getElementById('cd-secs').textContent = padTwo(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Scroll Animation (IntersectionObserver) ───────────────
const animatables = document.querySelectorAll('.timeline-item, .accom-card');

// Add will-animate so CSS hides them only when JS is active
animatables.forEach(el => el.classList.add('will-animate'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

animatables.forEach((el, i) => {
    el.dataset.delay = i * 80;
    observer.observe(el);
});

// ── RSVP Form handling ────────────────────────────────────
// Check if Google Form iframe loads (has real URL) or fall back to local form
const iframe = document.getElementById('rsvp-iframe');
const fallback = document.getElementById('rsvpFallback');
const PLACEHOLDER_SRC = 'PLACEHOLDER';

if (iframe.src.includes(PLACEHOLDER_SRC) || iframe.src === '') {
    // No real Google Form URL — show fallback form
    iframe.style.display = 'none';
    fallback.style.display = 'block';
} else {
    // Real Google Form URL set — show iframe
    iframe.style.display = 'block';
    fallback.style.display = 'none';
}

// Local fallback form submission
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('rsvp-submit');
        btn.disabled = true;
        btn.textContent = 'Saadan...';

        const data = {
            name: document.getElementById('rsvp-name').value,
            email: document.getElementById('rsvp-email').value,
            attend: document.getElementById('rsvp-attend').value,
            dietary: document.getElementById('rsvp-dietary').value,
            message: document.getElementById('rsvp-message').value,
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

        // Log data to console (for testing / Netlify Forms etc.)
        console.log('RSVP kinnitus:', data);
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
    const query = document.getElementById('seatSearch').value.trim().toLowerCase();
    const result = document.getElementById('seatResult');

    if (query.length < 2) {
        result.textContent = '';
        result.className = 'seat-result';
        return;
    }

    const match = guestData.find(g => g.name.toLowerCase().includes(query));

    if (match) {
        result.innerHTML = `✦ <strong>${match.name}</strong> — ${match.info}`;
        result.className = 'seat-result found';
    } else {
        result.textContent = 'Nime ei leitud. Kontrollige kirjaviisi või võtke meiega ühendust.';
        result.className = 'seat-result notfound';
    }
}

// Expose to global for inline oninput handler
window.searchSeat = searchSeat;

// ── Smooth active nav link highlighting ──────────────────
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}`
                    ? 'var(--gold)'
                    : 'rgba(255,255,255,0.85)';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
