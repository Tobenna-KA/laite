// Import the Laite class or include it in your test file
import Laite from '../index';

const objToWatch = {
    testKey: 0,
    nested: { key: 0 },
};

describe('Laite Class', () => {
    let laite: Laite;

    beforeEach(() => {
        // Create a new Laite instance for each test
        laite = new Laite(objToWatch); // Initialize with an empty object
    });

    it('should be initialized correctly', () => {
        expect(laite.getState()).toEqual(objToWatch);
        expect(laite.getSubscribers().size).toBe(0);
    });

    it('should watch a simple key', () => {
        let testValue = 0;
        laite.$watch('testKey', (value: any) => {
            testValue = value;
        });

        laite.getState().testKey = 42;

        expect(testValue).toBe(42);
    });

    it('should throw an error if trying to watch a non-function callback', () => {
        expect(() => {
            laite.$watch('testKey', 'invalidCallback' as any);
        }).toThrow(TypeError);
    });

    it('should deep watch a nested key', () => {
        let nestedValue = 0;
        laite.$deepWatch('nested.key', (value: any) => {
            nestedValue = value;
        });

        // Modify the nested key
        laite.getState().nested.key = 456;
        expect(nestedValue).toBe(456);
    });

    it('should throw an error if trying to deep watch a non-function callback', () => {
        expect(() => {
            laite.$deepWatch('nested.key', 'invalidCallback' as any);
        }).toThrow(TypeError);
    });

    it('should handle deep watch of non-existent keys', () => {
        expect(() => {
            laite.$deepWatch('nonExistent.key', () => {});
        }).toThrow(ReferenceError);
    });
});
