const { searchGuest, defaultGuestData } = require('../src/seating');

describe('searchGuest', () => {
    const guestData = [
        { name: 'Mihkel Vaher', table: 1, info: 'Laud 1 \u2013 Perepaar (Pruutpaar)' },
        { name: 'Nele Valgepea', table: 1, info: 'Laud 1 \u2013 Perepaar (Pruutpaar)' },
        { name: 'Indrek Vaher', table: 2, info: 'Laud 2 \u2013 Perekond' },
        { name: 'K\u00fclaline N\u00e4ide', table: 3, info: 'Laud 3 \u2013 S\u00f5brad' },
    ];

    it('finds a guest by full name', () => {
        const result = searchGuest('Mihkel Vaher', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Mihkel Vaher');
        expect(result.guest.table).toBe(1);
    });

    it('finds a guest by partial first name', () => {
        const result = searchGuest('Mihk', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Mihkel Vaher');
    });

    it('finds a guest by partial last name', () => {
        const result = searchGuest('Valgepea', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Nele Valgepea');
    });

    it('search is case-insensitive', () => {
        const result = searchGuest('INDREK', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Indrek Vaher');
    });

    it('search is case-insensitive with mixed case', () => {
        const result = searchGuest('nElE', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Nele Valgepea');
    });

    it('returns not found for non-existent guest', () => {
        const result = searchGuest('Maria Tamm', guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('returns not found for empty query', () => {
        const result = searchGuest('', guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('returns not found for query shorter than 2 characters', () => {
        const result = searchGuest('M', guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('returns not found for null query', () => {
        const result = searchGuest(null, guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('returns not found for undefined query', () => {
        const result = searchGuest(undefined, guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('trims whitespace from query', () => {
        const result = searchGuest('  Nele  ', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Nele Valgepea');
    });

    it('handles query with only spaces (less than 2 after trim)', () => {
        const result = searchGuest('   ', guestData);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });

    it('returns the first match when multiple guests share a surname', () => {
        const result = searchGuest('Vaher', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('Mihkel Vaher');
    });

    it('works with Estonian special characters', () => {
        const result = searchGuest('K\u00fclaline', guestData);
        expect(result.found).toBe(true);
        expect(result.guest.name).toBe('K\u00fclaline N\u00e4ide');
    });

    it('handles empty guest data array', () => {
        const result = searchGuest('Mihkel', []);
        expect(result.found).toBe(false);
        expect(result.guest).toBeNull();
    });
});

describe('defaultGuestData', () => {
    it('contains expected default guests', () => {
        expect(defaultGuestData).toHaveLength(4);
        expect(defaultGuestData[0].name).toBe('Mihkel Vaher');
        expect(defaultGuestData[1].name).toBe('Nele Valgepea');
    });

    it('each guest has required fields', () => {
        defaultGuestData.forEach(guest => {
            expect(guest).toHaveProperty('name');
            expect(guest).toHaveProperty('table');
            expect(guest).toHaveProperty('info');
            expect(typeof guest.name).toBe('string');
            expect(typeof guest.table).toBe('number');
            expect(typeof guest.info).toBe('string');
        });
    });
});
