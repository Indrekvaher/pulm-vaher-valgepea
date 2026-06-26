const { validateRsvp, isValidEmail, collectRsvpData, determineFormDisplay } = require('../src/rsvp');

describe('isValidEmail', () => {
    it('accepts valid email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.ee')).toBe(true);
        expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
        expect(isValidEmail('firstname@subdomain.domain.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail('not-an-email')).toBe(false);
        expect(isValidEmail('@domain.com')).toBe(false);
        expect(isValidEmail('user@')).toBe(false);
        expect(isValidEmail('user@.com')).toBe(false);
        expect(isValidEmail('user name@domain.com')).toBe(false);
    });
});

describe('validateRsvp', () => {
    const validData = {
        name: 'Mihkel Vaher',
        email: 'mihkel@example.com',
        attend: 'yes',
    };

    it('validates correct RSVP data', () => {
        const result = validateRsvp(validData);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('requires name field', () => {
        const result = validateRsvp({ ...validData, name: '' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Nimi on kohustuslik');
    });

    it('requires name to not be only whitespace', () => {
        const result = validateRsvp({ ...validData, name: '   ' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Nimi on kohustuslik');
    });

    it('requires email field', () => {
        const result = validateRsvp({ ...validData, email: '' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('E-posti aadress on kohustuslik');
    });

    it('validates email format', () => {
        const result = validateRsvp({ ...validData, email: 'not-valid' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('E-posti aadress ei ole korrektne');
    });

    it('requires attend field', () => {
        const result = validateRsvp({ ...validData, attend: '' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Palun valige osalemine');
    });

    it('validates attend value', () => {
        const result = validateRsvp({ ...validData, attend: 'maybe' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Osalemise valik ei ole korrektne');
    });

    it('accepts "yes" attend value', () => {
        const result = validateRsvp({ ...validData, attend: 'yes' });
        expect(result.valid).toBe(true);
    });

    it('accepts "yes-plus" attend value', () => {
        const result = validateRsvp({ ...validData, attend: 'yes-plus' });
        expect(result.valid).toBe(true);
    });

    it('accepts "no" attend value', () => {
        const result = validateRsvp({ ...validData, attend: 'no' });
        expect(result.valid).toBe(true);
    });

    it('returns multiple errors for multiple invalid fields', () => {
        const result = validateRsvp({ name: '', email: '', attend: '' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });

    it('handles missing fields gracefully', () => {
        const result = validateRsvp({});
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('handles null/undefined fields', () => {
        const result = validateRsvp({ name: null, email: undefined, attend: null });
        expect(result.valid).toBe(false);
    });
});

describe('collectRsvpData', () => {
    it('collects all fields into a data object', () => {
        const fields = {
            name: 'Nele Valgepea',
            email: 'nele@example.com',
            attend: 'yes',
            dietary: 'Taimetoiduline',
            message: 'Palju \u00f5nne!',
        };

        const result = collectRsvpData(fields);

        expect(result.name).toBe('Nele Valgepea');
        expect(result.email).toBe('nele@example.com');
        expect(result.attend).toBe('yes');
        expect(result.dietary).toBe('Taimetoiduline');
        expect(result.message).toBe('Palju \u00f5nne!');
        expect(result.timestamp).toBeDefined();
    });

    it('includes a valid ISO timestamp', () => {
        const result = collectRsvpData({ name: 'Test', email: '', attend: '', dietary: '', message: '' });
        expect(() => new Date(result.timestamp)).not.toThrow();
        expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('defaults empty fields to empty strings', () => {
        const result = collectRsvpData({});
        expect(result.name).toBe('');
        expect(result.email).toBe('');
        expect(result.attend).toBe('');
        expect(result.dietary).toBe('');
        expect(result.message).toBe('');
    });

    it('handles undefined fields', () => {
        const result = collectRsvpData({ name: undefined, email: undefined });
        expect(result.name).toBe('');
        expect(result.email).toBe('');
    });
});

describe('determineFormDisplay', () => {
    it('returns "fallback" when src contains PLACEHOLDER', () => {
        const src = 'https://docs.google.com/forms/d/e/1FAIpQLSe_PLACEHOLDER/viewform?embedded=true';
        expect(determineFormDisplay(src)).toBe('fallback');
    });

    it('returns "fallback" when src is empty string', () => {
        expect(determineFormDisplay('')).toBe('fallback');
    });

    it('returns "fallback" when src is null', () => {
        expect(determineFormDisplay(null)).toBe('fallback');
    });

    it('returns "fallback" when src is undefined', () => {
        expect(determineFormDisplay(undefined)).toBe('fallback');
    });

    it('returns "iframe" when src is a valid Google Forms URL', () => {
        const src = 'https://docs.google.com/forms/d/e/1FAIpQLSe_REAL_ID/viewform?embedded=true';
        expect(determineFormDisplay(src)).toBe('iframe');
    });

    it('returns "iframe" for any non-placeholder URL', () => {
        expect(determineFormDisplay('https://example.com/form')).toBe('iframe');
    });
});
