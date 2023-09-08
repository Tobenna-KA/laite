/**
 * Author Tobenna K. O. Abanofor
 * Very lightweight mini library bringing simple
 * reactivity to any website
 * @ref https://github.com/d-levin/vue-advanced-workshop
 */


module.exports = class Laite {
    $obj
    subscribers
    _toString = Object.prototype.toString
    
    constructor (obj) {
        if (!this.isObject(obj)) {
            throw new TypeError()
        }
        
        this.$obj = new Object(obj)
        this.subscribers = new Map()
    }
    
    isObject (obj) {
        return this._toString.call(obj) === '[object Object]'
    }
    
    // Updated isKeyExist to support deep keys
    isKeyExist(key, obj = this.$obj) {
        const keys = key.split('.')
        let currentObj = obj
        
        for (const k of keys) {
            if (!currentObj || currentObj[k] === undefined) {
                return false
            }
            currentObj = currentObj[k]
        }
        
        return true
    }
    
    isSubscribed (key) {
        return this.subscribers.has(key)
    }
    
    isFunction (fn) {
        return typeof fn === 'function'
    }
    
    /**
     * Function that initializes a watcher
     * $ notation in homage to the vue library $watch which is the inspiration
     * for this class
     * @param key
     * @param cb callback function that is triggered after a change in value
     */
    $watch (key, cb) {
        if (!this.isFunction(cb)) {
            throw new TypeError()
        }
        
        if (this.isSubscribed(key)) {
            console.warn(`[OVERWRITE WARNING] key (${key}) is already being watched, previous definition is being overwritten`)
        }
        
        this.observe(key)
        // register the key to be observed under watch
        this.subscribers.set(key, cb)
    }
    
    /**
     * Function that initializes a deep watcher for nested properties
     * @param key
     * @param cb callback function that is triggered after a change in value
     */
    $deepWatch(key, cb) {
        if (!this.isFunction(cb)) {
            throw new TypeError()
        }
        
        if (this.isSubscribed(key)) {
            console.warn(`[OVERWRITE WARNING] key (${key}) is already being watched, previous definition is being overwritten`)
        }
        
        const keys = key.split('.')
        if (keys.length < 2) {
            throw 'Deep watch requires at least two nested keys'
        }
        
        this.deepObserve(this.$obj, keys, cb)
        // register the key to be observed under watch
        this.subscribers.set(key, cb)
    }
    
    /**
     * Creates an observer for a given deep key within the initialized object
     * @param obj
     * @param keys Array of keys representing the deep path
     * @param cb callback function that is triggered after a change in value
     */
    deepObserve(obj, keys, cb) {
        let currentObj = obj
        let internalValue = currentObj
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            
            if (!this.isKeyExist(key, currentObj)) {
                throw new ReferenceError()
            }
            
            if (i === keys.length - 1) {
                // Last key in the path, define the observer
                Object.defineProperty(currentObj, key, {
                    get() {
                        return internalValue
                    },
                    set(newValue) {
                        const isChanged = internalValue !== newValue
                        if (isChanged) {
                            internalValue = newValue
                            cb(newValue)
                        }
                    }
                })
            } else {
                // Not the last key, traverse deeper
                currentObj = currentObj[key]
                internalValue = currentObj
            }
        }
    }
    
    /**
     * Creates an observer for a given key within the initialized object
     * @param key
     * @returns {*}
     */
    observe(key) {
        if (!this.isKeyExist(key)) {
            throw new ReferenceError();
        }
        
        let internalValue = this.$obj[key];
        const subscribers = this.subscribers; // Avoid creating a new variable inside the getter
        
        Object.defineProperty(this.$obj, key, {
            get() {
                return internalValue;
            },
            set(newValue) {
                if (internalValue !== newValue) {
                    internalValue = newValue;
                    subscribers.get(key)(newValue); // notify of change
                }
            },
        });
    }
}