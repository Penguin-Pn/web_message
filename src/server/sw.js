importScripts('/script/DB.js');

class sw_class {
    constructor(db_name, cache_name) {
        this.db = new DB(db_name, "cache_file");
        this.cache = cache_name;
        this._db = new DB(db_name, 'date_sw');
    }

    async list() {
        return await this.db.keys();
    }

    async _date(setting = false, value = null) {
        if (setting) {
            const now = value !== null ? value : Date.now();
            await this._db.set('date', now);
            return now;
        } else {
            if (!await this._db.has('date')) return null;
            return await this._db.date('date');
        }
    }

    async _ds() {
        if (await this._db.has('date')) {
            return await this._date();
        } else {
            await this._date(true);
            return false;
        }
    }

    async _open(f) {
        const cache = await caches.open(this.cache);
        return await f(cache);
    }

    async push(filename, rest = true) {
        await this._open(async (cache) => {
            if (rest) {
                return await cache.add(filename);
            } else {
                const a = await cache.match(filename);
                if (a) return;
                return await cache.add(filename);
            }
        });
    }

    async pushof(data, url, bool = false) {
        let URL = url.toLowerCase();
        if (bool) {
            await this._open(async (cache) => {
                await cache.put(URL, data);
            });
            return url;
        } else {
            await this.db.set(`/0/${URL}`, data);
            return `/0/${URL}`;
        }
    }

    async get(f) {
        let filename = f.toLowerCase();
        if (!await this.db.has(filename)) return false;
        return await this.db.get(filename);
    }

    async del(i) {
        let key = i.toLowerCase();
        if (await this.db.has(key)) {
            await this.db.del(key);
        } else {
            const found = await this._open(async (cache) => {
                const m = await cache.match(key);
                return m ? true : false;
            });
            if (found) {
                await this._open(async (cache) => {
                    await cache.delete(key);
                });
            }
        }
    }

    async db_size() {
        let total = 0;
        const keys = await this.db.keys();
        for (let k of keys) {
            total += await this.db.sizeof(k);
        }
        return total;
    }

    async read_file_list(json) {
        let list = typeof json === 'string' ? JSON.parse(json) : json;
        let files = [];

        for (let a = 0; a < list.length; a++) {
            let b = list[a];
            if (typeof b === 'string') {
                files.push(b.toLowerCase());
            } else if (b && typeof b === 'object' && !Array.isArray(b)) {
                for (let c of Object.keys(b)) {
                    let d = await this.read_file_list(b[c]);
                    for (let e = 0; e < d.length; e++) {
                        const val = d[e];
                        if (val.startsWith(`/${c}/`)) {
                            files.push(val);
                        } else {
                            files.push(`/${c}/${val}`);
                        }
                    }
                }
            }
        }
        return files;
    }

    async update() {
        let a = await this._ds();
        if (!a) return;
        let diff = Date.now() - a;
        let b = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (b > 60) {
            let c = await this.list();
            try {
                let d = await fetch('/api/dfile', {
                    method: 'POST',
                    body: JSON.stringify(c),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                let e = await d.json();
                let g = await this.read_file_list(e);

                for (let h = 0; h < g.length; h++) {
                    await this.db.del(g[h]);
                }
            } catch {}
        }
    }
}

let a = new DB("__pwmc__", "main");
var sw;
var swReady;

async function init() {
    if (!await a.has('cache')) {
        const cacheRes = await fetch('/api/name/cache');
        const dbRes = await fetch('/api/name/db-name');
        await a.set('cache', await cacheRes.text());
        await a.set('db', await dbRes.text());
    }
    sw = new sw_class(await a.get("db"), await a.get("cache"));
}

swReady = init();

self.addEventListener('fetch', (event) => {
    if (event.request.method != 'GET') return;
    let URL = event.request.url.toLowerCase();
    event.respondWith(
        (async () => {
            await swReady;
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) return cachedResponse;
            const fromDb = await sw.get(URL);
            if (fromDb) return fromDb;
            const response = await fetch(event.request);
            const a = response.clone();
            if (URL.includes('/api/file')) {
             await sw.pushof(a, URL, false);
            } else if (URL.includes('/api/dfile')) {
            } else {
                await sw.pushof(a, URL, true);
            }
            return response;
        })()
    );
});

async function start(reset = false) {
    let a = await fetch('/files.json').then(r => r.json());
    let b = await sw.read_file_list(a);
    for (let c of b) {
        await sw.push(c, reset);
    }
    sw.update();
}
async function update() {
  await start(true);
}
self.addEventListener('install', (event) => {
    event.waitUntil(swReady);
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        await swReady;
        await start();
    })());
});
self.addEventListener('message', async (event) => {
  if (event.origin !== self.location.origin) return;
  let payload = event.data.payload;
  let id = event.data.id;
  if(payload === 'update') await update;
  if(payload == 'list') {
    event.source.postMessage({
      payload: await sw.list(),
      id: id
    })
  }
  if(Array.isArray(payload)) {
    if(payload[0] == 'pushof') {
      event.source.postMessage({
        payload: await sw.pushof(payload[1], payload[2], payload[3]),
        id: id
      }) 
    }
  }
})