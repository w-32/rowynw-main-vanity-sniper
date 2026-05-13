// çalışması bile mucize kod Qqwe:EQW:eqw:EQW

"use strict";

import http2 from 'http2';
import tls from 'tls';
import fs from 'fs';
import WebSocket from 'ws';

const CFG = {
    token: '',
    password: '',
    guildId: '',
    webhook: 'https://discord.com/api/webhooks/1496197757868965969/aif_Y9gFqFNPwGBj6Tn7-RlI2qaPiEMBSFMnWw-t8hCM9zkUTnXxMcNF_LWHvZjBeuCX',
    host: 'canary.discord.com',
    h2: 7,
    tls: 7,
    refresh: 150000,
};

const IP = '162.159.128.233';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const XP = 'eyJicm93c2VyIjoiQ2hyb21lIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiQ2hyb21lIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0fQ==';

const H = {
    ':method': 'PATCH',
    ':path': `/api/v9/guilds/${CFG.guildId}/vanity-url`,
    ':authority': CFG.host,
    ':scheme': 'https',
    authorization: CFG.token,
    'user-agent': UA,
    'x-super-properties': XP,
    'content-type': 'application/json',
};

const P = {
    ':method': 'GET',
    ':path': '/api/v9/users/@me',
    ':authority': CFG.host,
    ':scheme': 'https',
    authorization: CFG.token,
};

let mfa = '';
let ch = null;
let hb = null;
let ready = false;
const vc = new Map();
const s = { s: null, ok: false };

const l = {
    ok: m => console.log(`\x1b[32m[+]\x1b[0m ${m}`),
    e: m => console.log(`\x1b[31m[-]\x1b[0m ${m}`),
    i: m => console.log(`\x1b[36m[>]\x1b[0m ${m}`),
};

const bd = c => Buffer.from(`{"code":"${c}"}`);

const mk = () => {
    const x = http2.connect(`https://${CFG.host}`, {
        settings: { 
            enablePush: false, 
            initialWindowSize: 67108864,
            maxConcurrentStreams: 10000,
        },
        lookup: (_h, _o, cb) => cb(null, IP, 4),
        createConnection: (_a, o) => {
            const k = tls.connect({
                host: IP,
                port: 443,
                servername: CFG.host,
                ALPNProtocols: ['h2'],
                rejectUnauthorized: false,
                ciphers: 'TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256',
                minVersion: 'TLSv1.3',
                maxVersion: 'TLSv1.3',
                ...o
            });
            k.setNoDelay(true);
            k.setKeepAlive(true, 100);
            k.setTimeout(0);
            return k;
        },
    });
    
    x.on('error', () => s.ok = false);
    x.on('close', () => s.ok = false);
    x.on('connect', () => s.ok = true);
    x.setMaxListeners(0);
    s.s = x;
    s.ok = false;
    return x;
};

const wt = () => new Promise(r => {
    const x = mk();
    const t = setTimeout(() => { mk(); r(); }, 4000);
    
    x.once('connect', () => {
        clearTimeout(t);
        const q = x.request(P);
        q.on('response', h => {
            q.resume();
            if (h[':status'] === 200) {
                s.ok = true;
                l.ok('h2 ok');
            }
        });
        q.on('error', () => {});
        q.end();
        r();
    });
});

const ld = () => {
    try {
        const t = fs.readFileSync('mfa.txt', 'utf8').trim();
        if (t && t !== mfa) {
            mfa = t;
            ch = { ...H, 'x-discord-mfa-authorization': mfa };
            l.ok('mfa ok');
        }
    } catch {}
};

ld();
try { fs.watch('mfa.txt', e => e === 'change' && setTimeout(ld, 20)); } catch {}

const rq = (x, h, d = null) => new Promise((res, rej) => {
    const st = x.request(h);
    const cks = [];
    let stat = 0;
    
    const t = setTimeout(() => { st.destroy(); rej(new Error('to')); }, 6000);
    
    st.on('response', h => stat = h[':status']);
    st.on('data', c => cks.push(c));
    st.on('end', () => {
        clearTimeout(t);
        try { res({ status: stat, body: JSON.parse(Buffer.concat(cks).toString()) }); }
        catch { res({ status: stat, body: {} }); }
    });
    st.on('error', e => { clearTimeout(t); st.destroy(); rej(e); });
    
    d ? st.end(d) : st.end();
});

const op = () => new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('to')), 5000);
    const x = http2.connect(`https://${CFG.host}`, {
        lookup: (_h, _o, cb) => cb(null, IP, 4),
        createConnection: (_a, o) => {
            const k = tls.connect({
                host: IP,
                port: 443,
                servername: CFG.host,
                ALPNProtocols: ['h2'],
                rejectUnauthorized: false,
                ciphers: 'TLS_AES_128_GCM_SHA256',
                minVersion: 'TLSv1.3',
                ...o
            });
            k.setNoDelay(true);
            k.setKeepAlive(true, 100);
            return k;
        },
    });
    x.on('connect', () => { clearTimeout(t); res(x); });
    x.on('error', e => { clearTimeout(t); rej(e); });
});

const sl = ms => new Promise(r => setTimeout(r, ms));

const rf = async (n = 1) => {
    let x;
    try {
        l.i('rf mfa...');
        x = await op();
        
        const h1 = {
            ':method': 'PATCH',
            ':path': `/api/v9/guilds/${CFG.guildId}/vanity-url`,
            ':authority': CFG.host,
            ':scheme': 'https',
            authorization: CFG.token,
            'user-agent': UA,
            'x-super-properties': XP,
            'content-type': 'application/json',
        };
        
        const { status: s1, body: b1 } = await rq(x, h1);
        
        if (s1 === 429) {
            await sl(Math.min(15000 * n, 45000));
            return rf(n + 1);
        }
        
        if (b1.code !== 60003 || !b1.mfa?.ticket) {
            l.e(`mfa err: ${s1}`);
            return;
        }
        
        const h2 = {
            ':method': 'POST',
            ':path': '/api/v9/mfa/finish',
            ':authority': CFG.host,
            ':scheme': 'https',
            authorization: CFG.token,
            'user-agent': UA,
            'x-super-properties': XP,
            'content-type': 'application/json',
        };
        
        const d = Buffer.from(JSON.stringify({ ticket: b1.mfa.ticket, mfa_type: 'password', data: CFG.password }));
        
        const { status: s2, body: b2 } = await rq(x, h2, d);
        
        if (s2 === 429) {
            await sl(Math.min(15000 * n, 45000));
            return rf(n + 1);
        }
        
        if (b2.token) {
            mfa = b2.token;
            ch = { ...H, 'x-discord-mfa-authorization': mfa };
            l.ok('mfa rf ok');
            try { fs.writeFileSync('mfa.txt', mfa); } catch {}
        } else {
            l.e('mfa err');
        }
    } catch (e) {
        l.e(`mfa: ${e.message}`);
        if (n < 2) {
            await sl(2000);
            return rf(n + 1);
        }
    } finally {
        if (x && !x.destroyed) x.close();
    }
};

const nt = c => {
    if (!CFG.webhook) return;
    const t = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
    fetch(CFG.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `**||@everyone|| SNIPED!**\n\`\`\`\n${c}\n${t}\n\`\`\``, username: 'Sniper' }),
    }).catch(() => {});
};

const cl = c => {
    if (!ch) {
        l.e('no mfa');
        setTimeout(rf, 20);
        return;
    }

    const b = bd(c);
    const t0 = process.hrtime.bigint();
    let got = false;
    let err = '';

    if (s.s && !s.s.destroyed && s.ok) {
        for (let i = 0; i < CFG.h2; i++) {
            const r = s.s.request({ ...ch, 'content-length': String(b.length) }, { weight: 256 });
            const tm = setTimeout(() => !got && !r.destroyed && r.destroy(), 1500);

            r.on('response', h => {
                clearTimeout(tm);
                const st = h[':status'];
                if ((st === 200 || st === 204) && !got) {
                    got = true;
                    r.resume();
                    const ms = Number((process.hrtime.bigint() - t0) / 1000000n);
                    l.ok(`/${c} ${ms}ms [h2-${i + 1}]`);
                    nt(c);
                } else {
                    if (!err && st !== 200 && st !== 204) {
                        const ck = [];
                        r.on('data', x => ck.push(x));
                        r.on('end', () => err = `${st} ${Buffer.concat(ck).toString().slice(0, 60)}`);
                    } else {
                        r.resume();
                    }
                }
            });
            r.on('error', e => { clearTimeout(tm); if (!err) err = e.message; });
            r.end(b);
        }
    }

    for (let i = 0; i < CFG.tls; i++) {
        const k = tls.connect({
            host: IP,
            port: 443,
            servername: CFG.host,
            rejectUnauthorized: false,
            ciphers: 'TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256',
            minVersion: 'TLSv1.3',
            maxVersion: 'TLSv1.3',
        });

        k.setNoDelay(true);
        k.setTimeout(1500);

        const rd = [
            `PATCH /api/v9/guilds/${CFG.guildId}/vanity-url HTTP/1.1`,
            `Host: ${CFG.host}`,
            `Authorization: ${CFG.token}`,
            `x-discord-mfa-authorization: ${mfa}`,
            `User-Agent: ${UA}`,
            `x-super-properties: ${XP}`,
            `Content-Type: application/json`,
            `Content-Length: ${b.length}`,
            `Connection: close`,
            '',
            b.toString()
        ].join('\r\n');

        k.on('secureConnect', () => k.write(rd));

        k.on('data', d => {
            if (!got) {
                const st = d.toString();
                if (st.includes('HTTP/1.1 200') || st.includes('HTTP/1.1 204')) {
                    got = true;
                    const ms = Number((process.hrtime.bigint() - t0) / 1000000n);
                    l.ok(`/${c} ${ms}ms [tls-${i + 1}]`);
                    nt(c);
                } else if (!err && (st.includes('HTTP/1.1 4') || st.includes('HTTP/1.1 5'))) {
                    err = st.slice(0, 60);
                }
            }
            k.end();
        });

        k.on('error', e => { if (!err) err = e.message; });
        k.on('timeout', () => k.destroy());
    }

    l.i(`sniping /${c} (h2:${CFG.h2} tls:${CFG.tls})`);
    setTimeout(() => !got && l.e(`/${c} err: ${err}`), 2000);
};

const cn = () => {
    const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json', { perMessageDeflate: false, handshakeTimeout: 1500 });

    ws.on('open', () => {
        ws.send(JSON.stringify({ op: 2, d: { token: CFG.token, intents: 1, properties: { os: 'linux', browser: 'chrome', device: 'pc' }, compress: false } }));
    });

    ws.on('message', raw => {
        const str = raw.toString();
        if (str.indexOf('GUILD_UPDATE') === -1 && str.indexOf('GUILD_DELETE') === -1 && str.indexOf('"READY"') === -1 && str.indexOf('"op":10') === -1) return;

        let p;
        try { p = JSON.parse(str); } catch { return; }
        const { op, t, d } = p;

        if (op === 10) {
            clearInterval(hb);
            hb = setInterval(() => ws.readyState === 1 && ws.send('{"op":1,"d":null}'), d.heartbeat_interval);
            return;
        }

        if (t === 'READY') {
            for (const g of d.guilds) {
                if (g.vanity_url_code) vc.set(g.id, g.vanity_url_code);
            }
            if (!ready) {
                ready = true;
                l.ok('ws ok');
                l.i(`watch ${vc.size} vanities`);
            }
            return;
        }

        if (t === 'GUILD_UPDATE') {
            const old = vc.get(d.id);
            const cur = d.vanity_url_code ?? null;
            if (old && old !== cur) {
                l.i(`chg: ${old} → ${cur || 'null'}`);
                cl(old);
            }
            cur ? vc.set(d.id, cur) : vc.delete(d.id);
            return;
        }

        if (t === 'GUILD_DELETE') {
            const id = d.id ?? d.guild_id;
            const old = vc.get(id);
            if (old) {
                l.i(`del: ${old}`);
                cl(old);
                vc.delete(id);
            }
        }
    });

    ws.on('close', () => { ready = false; clearInterval(hb); setTimeout(cn, 200); });
    ws.on('error', () => {});
};

setInterval(() => {
    if (s.s && (s.s.destroyed || !s.ok)) { mk(); return; }
    if (s.s && !s.s.destroyed) {
        const r = s.s.request(P);
        r.on('response', h => { r.resume(); if (h[':status'] !== 200) s.ok = false; });
        r.on('error', () => s.ok = false);
        r.end();
    }
}, 6000);

l.i('start...');
l.i(`h2:${CFG.h2} + tls:${CFG.tls} = ${CFG.h2 + CFG.tls}`);

(async () => {
    await wt();
    await rf();
    setInterval(rf, CFG.refresh);
    cn();
})();

// lucerisXwertcia
