/**
 * Countdown timer utilities for the wedding date.
 */

/**
 * Pad a number to two digits with leading zero.
 * @param {number} n
 * @returns {string}
 */
function padTwo(n) {
    return String(n).padStart(2, '0');
}

/**
 * Calculate the remaining time between now and a target date.
 * @param {Date} targetDate - The target date/time.
 * @param {Date} [now] - The current date/time (defaults to new Date()).
 * @returns {{ days: number, hours: number, mins: number, secs: number, expired: boolean }}
 */
function calculateCountdown(targetDate, now) {
    if (!now) now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, mins, secs, expired: false };
}

/**
 * Format countdown values as two-digit strings.
 * @param {{ days: number, hours: number, mins: number, secs: number }} countdown
 * @returns {{ days: string, hours: string, mins: string, secs: string }}
 */
function formatCountdown(countdown) {
    return {
        days: padTwo(countdown.days),
        hours: padTwo(countdown.hours),
        mins: padTwo(countdown.mins),
        secs: padTwo(countdown.secs),
    };
}

module.exports = { padTwo, calculateCountdown, formatCountdown };
