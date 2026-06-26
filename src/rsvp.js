/**
 * RSVP form utilities.
 */

/**
 * Validate RSVP form data.
 * @param {{ name: string, email: string, attend: string }} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateRsvp(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push('Nimi on kohustuslik');
    }

    if (!data.email || data.email.trim().length === 0) {
        errors.push('E-posti aadress on kohustuslik');
    } else if (!isValidEmail(data.email)) {
        errors.push('E-posti aadress ei ole korrektne');
    }

    if (!data.attend || data.attend.trim().length === 0) {
        errors.push('Palun valige osalemine');
    } else if (!['yes', 'yes-plus', 'no'].includes(data.attend)) {
        errors.push('Osalemise valik ei ole korrektne');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Collect RSVP form data from field values.
 * @param {{ name: string, email: string, attend: string, dietary: string, message: string }} fields
 * @returns {object}
 */
function collectRsvpData(fields) {
    return {
        name: fields.name || '',
        email: fields.email || '',
        attend: fields.attend || '',
        dietary: fields.dietary || '',
        message: fields.message || '',
        timestamp: new Date().toISOString(),
    };
}

/**
 * Determine whether to show iframe or fallback form.
 * @param {string} iframeSrc - The iframe src attribute value.
 * @returns {'iframe'|'fallback'}
 */
function determineFormDisplay(iframeSrc) {
    const PLACEHOLDER = 'PLACEHOLDER';
    if (!iframeSrc || iframeSrc.includes(PLACEHOLDER) || iframeSrc === '') {
        return 'fallback';
    }
    return 'iframe';
}

module.exports = { validateRsvp, isValidEmail, collectRsvpData, determineFormDisplay };
