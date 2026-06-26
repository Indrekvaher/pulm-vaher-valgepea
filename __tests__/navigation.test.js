const { shouldNavbarBeScrolled, getActiveSection } = require('../src/navigation');

describe('shouldNavbarBeScrolled', () => {
    it('returns false when scroll is at top (0)', () => {
        expect(shouldNavbarBeScrolled(0)).toBe(false);
    });

    it('returns false when scroll is below threshold', () => {
        expect(shouldNavbarBeScrolled(30)).toBe(false);
        expect(shouldNavbarBeScrolled(59)).toBe(false);
    });

    it('returns false when scroll equals threshold', () => {
        expect(shouldNavbarBeScrolled(60)).toBe(false);
    });

    it('returns true when scroll exceeds threshold', () => {
        expect(shouldNavbarBeScrolled(61)).toBe(true);
        expect(shouldNavbarBeScrolled(100)).toBe(true);
        expect(shouldNavbarBeScrolled(500)).toBe(true);
    });

    it('supports custom threshold', () => {
        expect(shouldNavbarBeScrolled(50, 100)).toBe(false);
        expect(shouldNavbarBeScrolled(101, 100)).toBe(true);
    });

    it('works with threshold of 0', () => {
        expect(shouldNavbarBeScrolled(0, 0)).toBe(false);
        expect(shouldNavbarBeScrolled(1, 0)).toBe(true);
    });
});

describe('getActiveSection', () => {
    const sections = [
        { id: 'hero', offsetTop: 0, offsetHeight: 600 },
        { id: 'programm', offsetTop: 600, offsetHeight: 800 },
        { id: 'rsvp', offsetTop: 1400, offsetHeight: 600 },
        { id: 'istekohad', offsetTop: 2000, offsetHeight: 500 },
        { id: 'asukoht', offsetTop: 2500, offsetHeight: 400 },
    ];

    it('returns first section when at top', () => {
        expect(getActiveSection(sections, 0)).toBe('hero');
    });

    it('returns the section currently scrolled into view', () => {
        expect(getActiveSection(sections, 600)).toBe('programm');
    });

    it('applies offset for determining active section', () => {
        expect(getActiveSection(sections, 550, 100)).toBe('programm');
    });

    it('returns the last section that starts before scroll position', () => {
        expect(getActiveSection(sections, 2500)).toBe('asukoht');
    });

    it('returns null for empty sections array', () => {
        expect(getActiveSection([], 100)).toBeNull();
    });

    it('returns section when exactly at its offsetTop minus offset', () => {
        expect(getActiveSection(sections, 500, 100)).toBe('programm');
    });

    it('handles custom offset values', () => {
        expect(getActiveSection(sections, 1350, 50)).toBe('rsvp');
    });

    it('returns correct section for very large scroll values', () => {
        expect(getActiveSection(sections, 10000)).toBe('asukoht');
    });
});
