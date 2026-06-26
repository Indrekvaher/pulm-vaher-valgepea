/**
 * Seating search utilities.
 */

/**
 * Search for a guest by name in the guest data list.
 * @param {string} query - Search query (partial name match).
 * @param {Array<{ name: string, table: number, info: string }>} guestData - List of guests.
 * @returns {{ found: boolean, guest: object|null }}
 */
function searchGuest(query, guestData) {
    if (!query || query.trim().length < 2) {
        return { found: false, guest: null };
    }

    const normalizedQuery = query.trim().toLowerCase();
    const match = guestData.find(g => g.name.toLowerCase().includes(normalizedQuery));

    if (match) {
        return { found: true, guest: match };
    }

    return { found: false, guest: null };
}

/**
 * Default guest data for the wedding.
 */
const defaultGuestData = [
    { name: 'Mihkel Vaher', table: 1, info: 'Laud 1 \u2013 Perepaar (Pruutpaar)' },
    { name: 'Nele Valgepea', table: 1, info: 'Laud 1 \u2013 Perepaar (Pruutpaar)' },
    { name: 'Indrek Vaher', table: 2, info: 'Laud 2 \u2013 Perekond' },
    { name: 'K\u00fclaline N\u00e4ide', table: 3, info: 'Laud 3 \u2013 S\u00f5brad' },
];

module.exports = { searchGuest, defaultGuestData };
