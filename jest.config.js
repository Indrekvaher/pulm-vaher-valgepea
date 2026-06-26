module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
        'src/**/*.js',
        'main.js',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'text-summary', 'lcov'],
};
