class DexieShim {
    constructor(name) {
        this.name = name;
        this._db = null;
        this._version = 1;
        this._stores = {};
        this._openPromise = null;
    }

    version(v) {
        this._version = v;
        return this;
    }

    stores(schema) {
        this._stores = schema;
        return this;
    }

    async open() {
        if (this._openPromise) return this._openPromise;
        this._openPromise = (async () => {
            let lastError = null;
            for (let v = this._version; v >= 1; v--) {
                try {
                    return await this._openWithVersion(v);
                } catch (err) {
                    lastError = err;
                    if (err && err.name === 'VersionError') {
                        continue;
                    }
                    throw err;
                }
            }
            throw lastError || new Error('Failed to open database');
        })();
        return this._openPromise;
    }

    _openWithVersion(version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, version);
            request.onupgradeneeded = (ev) => {
                const db = ev.target.result;
                for (const [storeName, keyPath] of Object.entries(this._stores)) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: keyPath || 'key' });
                    }
                }
            };
            request.onsuccess = (ev) => {
                this._db = ev.target.result;
                this._version = version;
                resolve(this._db);
            };
            request.onerror = (ev) => {
                reject(ev.target.error);
            };
            request.onblocked = () => {
                reject(new Error('Database open blocked'));
            };
        });
    }

    get db() {
        if (!this._db) throw new Error('Database not open');
        return this._db;
    }

    table(storeName) {
        return new DexieTableShim(this, storeName);
    }
}

class DexieTableShim {
    constructor(db, storeName) {
        this._db = db;
        this._storeName = storeName;
    }

    async _getTransaction(mode = 'readonly') {
        await this._db.open();
        return this._db.db.transaction(this._storeName, mode).objectStore(this._storeName);
    }

    async put(item) {
        const store = await this._getTransaction('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.put(item);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async get(key) {
        const store = await this._getTransaction('readonly');
        return new Promise((resolve, reject) => {
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async delete(key) {
        const store = await this._getTransaction('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.delete(key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async clear() {
        const store = await this._getTransaction('readwrite');
        return new Promise((resolve, reject) => {
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async toArray() {
        const store = await this._getTransaction('readonly');
        return new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async count() {
        const store = await this._getTransaction('readonly');
        return new Promise((resolve, reject) => {
            const req = store.count();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
}

const Dexie = (typeof window !== 'undefined' && window.Dexie) || DexieShim;

class DB {
    constructor(name, store) {
        this.db = new Dexie(name);
        this.db.version(1).stores({ [store]: 'key' });
        this.store = store;
        this._ready = false;
        this._writeQueue = Promise.resolve();
    }

    async _init() {
        if (!this._ready) {
            await this.db.open();
            this._ready = true;
        }
    }

    async set(key, value) {
        await this._init();
        this._writeQueue = this._writeQueue.then(() =>
            this.db.table(this.store).put({
                key,
                value,
                updatedAt: new Date().toISOString()
            })
        );
        return this._writeQueue;
    }

    async get(key) {
        await this._init();
        const r = await this.db.table(this.store).get(key);
        return r ? r.value : null;
    }

    async del(key) {
        await this._init();
        await this.db.table(this.store).delete(key);
    }

    async clear() {
        await this._init();
        await this.db.table(this.store).clear();
    }

    async list() {
        await this._init();
        const items = await this.db.table(this.store).toArray();
        return items.map(item => ({
            key: item.key,
            value: item.value,
            updatedAt: item.updatedAt
        }));
    }

    async keys() {
        await this._init();
        const items = await this.db.table(this.store).toArray();
        return items.map(item => item.key);
    }

    async values() {
        await this._init();
        const items = await this.db.table(this.store).toArray();
        return items.map(item => item.value);
    }

    async count() {
        await this._init();
        return await this.db.table(this.store).count();
    }

    async has(key) {
        await this._init();
        const item = await this.db.table(this.store).get(key);
        return item !== undefined;
    }

    async date(key) {
        await this._init();
        const item = await this.db.table(this.store).get(key);
        return item ? item.updatedAt : null;
    }

    async update(key, value) {
        await this._init();
        const existing = await this.db.table(this.store).get(key);
        await this.db.table(this.store).put({
            key,
            value,
            updatedAt: existing ? existing.updatedAt : new Date().toISOString()
        });
    }

    async touch(key) {
        await this._init();
        const existing = await this.db.table(this.store).get(key);
        if (existing) {
            await this.db.table(this.store).put({
                key,
                value: existing.value,
                updatedAt: new Date().toISOString()
            });
            return true;
        }
        return false;
    }

    async sizeof(key) {
        await this._init();
        const item = await this.db.table(this.store).get(key);
        if (!item) return 0;
        const str = JSON.stringify(item);
        return new Blob([str]).size;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DB;
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return DB; });
} else {
    (typeof self !== 'undefined' ? self : this).DB = DB;
}
