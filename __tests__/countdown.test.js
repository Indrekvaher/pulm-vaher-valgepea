const { padTwo, calculateCountdown, formatCountdown } = require('../src/countdown');

describe('padTwo', () => {
    it('pads single digit numbers with leading zero', () => {
        expect(padTwo(0)).toBe('00');
        expect(padTwo(1)).toBe('01');
        expect(padTwo(5)).toBe('05');
        expect(padTwo(9)).toBe('09');
    });

    it('returns two-digit numbers as-is', () => {
        expect(padTwo(10)).toBe('10');
        expect(padTwo(23)).toBe('23');
        expect(padTwo(59)).toBe('59');
        expect(padTwo(99)).toBe('99');
    });

    it('handles three-digit numbers', () => {
        expect(padTwo(100)).toBe('100');
        expect(padTwo(365)).toBe('365');
    });

    it('handles negative numbers', () => {
        expect(padTwo(-1)).toBe('-1');
    });
});

describe('calculateCountdown', () => {
    const weddingDate = new Date('2026-08-08T14:00:00+03:00');

    it('returns correct countdown for a future date', () => {
        const now = new Date('2026-08-07T14:00:00+03:00');
        const result = calculateCountdown(weddingDate, now);

        expect(result.expired).toBe(false);
        expect(result.days).toBe(1);
        expect(result.hours).toBe(0);
        expect(result.mins).toBe(0);
        expect(result.secs).toBe(0);
    });

    it('calculates hours, minutes, and seconds correctly', () => {
        const now = new Date('2026-08-08T10:30:45+03:00');
        const result = calculateCountdown(weddingDate, now);

        expect(result.expired).toBe(false);
        expect(result.days).toBe(0);
        expect(result.hours).toBe(3);
        expect(result.mins).toBe(29);
        expect(result.secs).toBe(15);
    });

    it('returns expired state when target date has passed', () => {
        const now = new Date('2026-08-09T00:00:00+03:00');
        const result = calculateCountdown(weddingDate, now);

        expect(result.expired).toBe(true);
        expect(result.days).toBe(0);
        expect(result.hours).toBe(0);
        expect(result.mins).toBe(0);
        expect(result.secs).toBe(0);
    });

    it('returns expired when now equals target date', () => {
        const result = calculateCountdown(weddingDate, weddingDate);

        expect(result.expired).toBe(true);
        expect(result.days).toBe(0);
    });

    it('handles large time differences (months away)', () => {
        const now = new Date('2026-01-01T00:00:00+03:00');
        const result = calculateCountdown(weddingDate, now);

        expect(result.expired).toBe(false);
        expect(result.days).toBeGreaterThan(200);
    });

    it('handles difference of exactly one second', () => {
        const now = new Date(weddingDate.getTime() - 1000);
        const result = calculateCountdown(weddingDate, now);

        expect(result.expired).toBe(false);
        expect(result.days).toBe(0);
        expect(result.hours).toBe(0);
        expect(result.mins).toBe(0);
        expect(result.secs).toBe(1);
    });

    it('uses current time when now is not provided', () => {
        const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
        const result = calculateCountdown(futureDate);

        expect(result.expired).toBe(false);
        expect(result.days).toBeGreaterThanOrEqual(9);
    });
});

describe('formatCountdown', () => {
    it('formats all values with two-digit padding', () => {
        const result = formatCountdown({ days: 5, hours: 3, mins: 7, secs: 2 });

        expect(result.days).toBe('05');
        expect(result.hours).toBe('03');
        expect(result.mins).toBe('07');
        expect(result.secs).toBe('02');
    });

    it('formats zero values as 00', () => {
        const result = formatCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });

        expect(result.days).toBe('00');
        expect(result.hours).toBe('00');
        expect(result.mins).toBe('00');
        expect(result.secs).toBe('00');
    });

    it('handles large day counts', () => {
        const result = formatCountdown({ days: 365, hours: 12, mins: 30, secs: 45 });

        expect(result.days).toBe('365');
        expect(result.hours).toBe('12');
        expect(result.mins).toBe('30');
        expect(result.secs).toBe('45');
    });
});
