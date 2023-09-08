export default class Laite {
    private readonly $obj: Record<string, any>;
    private subscribers: Map<string, (value: any) => void> = new Map();
    private _toString = Object.prototype.toString;

    constructor(obj: Record<string, any>) {
        if (!this.isObject(obj)) {
            throw new TypeError();
        }

        this.$obj = { ...obj };
    }

    private isObject(obj: any): boolean {
        return this._toString.call(obj) === '[object Object]';
    }

    getState(): Record<string, any> {
        return this.$obj;
    }


    getSubscribers(): Map<string, (value: any) => void> {
        return this.subscribers;
    }

    private isKeyExist(key: string, obj: Record<string, any> = this.$obj): boolean {
        const keys = key.split('.');
        let currentObj = obj;

        for (const k of keys) {
            if (!currentObj || currentObj[k] === undefined) {
                return false;
            }
            currentObj = currentObj[k];
        }

        return true;
    }

    private isSubscribed(key: string): boolean {
        return this.subscribers.has(key);
    }

    private isFunction(fn: any): boolean {
        return typeof fn === 'function';
    }

    private deepObserve(obj: Record<string, any>, keys: string[], cb: (value: any) => void) {
        let currentObj = obj;
        let internalValue = currentObj;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (!this.isKeyExist(key, currentObj)) {
                throw new ReferenceError();
            }

            if (i === keys.length - 1) {
                // Last key in the path, define the observer
                Object.defineProperty(currentObj, key, {
                    get() {
                        return internalValue;
                    },
                    set(newValue) {
                        const isChanged = internalValue !== newValue;
                        if (isChanged) {
                            internalValue = newValue;
                            cb(newValue);
                        }
                    },
                });
            } else {
                // Not the last key, traverse deeper
                currentObj = currentObj[key];
                internalValue = currentObj;
            }
        }
    }

    private observe(key: string) {
        if (!this.isKeyExist(key)) {
            throw new ReferenceError();
        }

        let internalValue = this.$obj[key];
        const subscribers = this.subscribers;

        Object.defineProperty(this.$obj, key, {
            get() {
                return internalValue;
            },
            set(newValue) {
                if (internalValue !== newValue) {
                    internalValue = newValue;
                    subscribers.get(key)?.(newValue);
                }
            },
        });
    }

    public $watch(key: string, cb: (value: any) => void) {
        if (!this.isFunction(cb)) {
            throw new TypeError();
        }

        if (this.isSubscribed(key)) {
            console.warn(`[OVERWRITE WARNING] key (${key}) is already being watched, previous definition is being overwritten`);
        }

        this.observe(key);
        this.subscribers.set(key, cb);
    }

    public $deepWatch(key: string, cb: (value: any) => void) {
        if (!this.isFunction(cb)) {
            throw new TypeError();
        }

        if (this.isSubscribed(key)) {
            console.warn(`[OVERWRITE WARNING] key (${key}) is already being watched, previous definition is being overwritten`);
        }

        const keys = key.split('.');
        if (keys.length < 2) {
            throw 'Deep watch requires at least two nested keys';
        }

        this.deepObserve(this.$obj, keys, cb);
        this.subscribers.set(key, cb);
    }
}
