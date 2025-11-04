module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        '*.js',
        '!test/**',
        '!public/**',
        '!node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
};