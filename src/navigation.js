/**
 * Navigation utilities.
 */

/**
 * Determine if navbar should have the 'scrolled' class based on scroll position.
 * @param {number} scrollY - Current vertical scroll position.
 * @param {number} [threshold=60] - Scroll threshold for applying the class.
 * @returns {boolean}
 */
function shouldNavbarBeScrolled(scrollY, threshold) {
    if (typeof threshold === 'undefined') threshold = 60;
    return scrollY > threshold;
}

/**
 * Find the currently active section based on scroll position.
 * @param {Array<{ id: string, offsetTop: number, offsetHeight: number }>} sections
 * @param {number} scrollY - Current scroll position.
 * @param {number} [offset=100] - Offset from top for determining active section.
 * @returns {string|null} - ID of the active section, or null.
 */
function getActiveSection(sections, scrollY, offset) {
    if (typeof offset === 'undefined') offset = 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (scrollY >= section.offsetTop - offset) {
            return section.id;
        }
    }
    return null;
}

module.exports = { shouldNavbarBeScrolled, getActiveSection };
