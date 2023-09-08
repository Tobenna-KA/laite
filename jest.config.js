module.exports = {
    roots: ['./test'], // Set the root directory for tests
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$', // Match test file names
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions for modules
};