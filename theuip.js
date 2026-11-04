import { zlibSync, unzlibSync, strToU8, strFromU8 } from 'fflate.js';

function filter_css(obj) {
  const allow = [
    "--bg-main", "--bg-panel", "--bg-chat", "--bg-msg-in", "--bg-msg-out",
    "--bg-input", "--bg-btn", "--bg-btn-hover", "--bg-btn-active", "--bg-hover",
    "--bg-active", "--bg-overlay", "--bg-card", "--bg-dropdown", "--bg-code",
    "--bg-highlight", "--bg-sys-msg", "--text-main", "--text-sub", "--text-msg-in",
    "--text-msg-out", "--text-error", "--text-success", "--text-warning", "--text-link",
    "--text-highlight", "--text-code", "--text-placeholder", "--text-time", "--text-online",
    "--text-offline", "--text-sys-msg", "--border", "--border-focus", "--border-divider",
    "--shadow-light", "--shadow-heavy", "--accent", "--accent-hover", "--accent-active",
    "--icon-main", "--icon-hover", "--icon-active", "--status-online", "--status-offline",
    "--status-away", "--status-busy", "--badge-bg", "--badge-text", "--scrollbar-thumb"
  ];

  const isColor = (val) => {
    if (typeof val !== 'string' || !val.trim()) return false;
    if (val.startsWith('var(')) return true;
    if (typeof CSS !== 'undefined' && CSS.supports) {
      return CSS.supports('color', val);
    }
    return /^(#[0-9a-f]{3,8}|rgba?\(.+\)|hsla?\(.+\)|[a-z]+)$/i.test(val.trim());
  };

  const isImage = (val) => {
    if (typeof val !== 'string') return false;
    return /^(url\(.*\)|(linear|radial)-gradient\(.*\))/i.test(val.trim());
  };

  const result = {};

  for (const key in obj) {
    if (allow.includes(key)) {
      const value = obj[key];

      if (key === '--bg-main' || key === '--bg-chat') {
        if (isColor(value) || isImage(value)) {
          result[key] = value;
        }
      } else {
        if (isColor(value)) {
          result[key] = value;
        }
      }
    }
  }

  return result;
}

function dctj(css) {
  if (!css || typeof css !== 'string') return {};
  
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  const json = {};
  const blockRegex = /{([^}]+)}/g;
  let match;
  
  while ((match = blockRegex.exec(css)) !== null) {
    const declarations = match[1].split(';');
    
    for (let decl of declarations) {
      if (!decl.trim()) continue;
      
      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = decl.slice(0, colonIndex).trim();
      const value = decl.slice(colonIndex + 1).trim();
      
      if (key && value) {
        json[key] = value;
      }
    }
  }
  
  return json;
}

async function decode(the, blob) {
  if (!blob) return null;
  if (!(blob instanceof Blob)) return null;
  if (blob.size < 24) return null;
  if (blob.size > (5 * 1024 * 1024)) return null;

  const THEUIP_MAGIC = new Uint8Array([0x89, 0x54, 0x48, 0x45, 0x55, 0x49, 0x50, 0x0A]);
  
  const magicBuffer = await blob.slice(0, THEUIP_MAGIC.length).arrayBuffer();
  const magicBytes = new Uint8Array(magicBuffer);
  
  for (let i = 0; i < THEUIP_MAGIC.length; i++) {
    if (magicBytes[i] !== THEUIP_MAGIC[i]) return null;
  }

  const sizeBuffer = await blob.slice(8, 12).arrayBuffer();
  const size = new DataView(sizeBuffer).getUint32(0, false);
  
  if ( size > (5 * 1024 * 1024) ) return null;

  let cs = the.css, strs = the.strs;
  
  try {
    const dataBuffer = await blob.slice(12, blob.size).arrayBuffer();
    const compressedData = new Uint8Array(dataBuffer);
    const decompressed = unzlibSync(compressedData, { out: new Uint8Array(size) });
    const jsonString = strFromU8(decompressed);
    const json = JSON.parse(jsonString);

    if(json.style && json.style instanceof Object) {
      const c = filter_css({ ...dctj(the.css), ...json.style});
      const o = Object.keys(c);
      cs = '';
      
      for(let d = 0; d < o.length; d++) {
        cs += `\n  ${o[d]}: ${c[o[d]]};`;
      }
      cs = ':root {' + cs + '}';
    }
    
    if(json.strs && json.strs instanceof Object && ((new Blob([JSON.stringify(json.strs)], { type: "application/json" })).size < (2 * 1024 * 1024) )) {
      strs = { ...the.strs, ...json.strs };
    }
    
    return {
      ...the,
      css: cs,
      strs: strs
    };
  } catch (e) { 
    return null; 
  }
}

function encode(theme) {
  if (!theme || typeof theme !== 'object') return null;
  
  const data = {};
  
  if (theme.style && theme.style instanceof Object) {
    data.style = theme.style;
  }
  
  if (theme.strs && theme.strs instanceof Object) {
    const strsSize = new Blob([JSON.stringify(theme.strs)], { type: "application/json" }).size;
    if (strsSize < (2 * 1024 * 1024)) {
      data.strs = theme.strs;
    }
  }

  try {
    const jsonString = JSON.stringify(data);
    const rawData = strToU8(jsonString);
    
    if (rawData.length > (5 * 1024 * 1024)) return null;

    const compressed = zlibSync(rawData);
    
    const THEUIP_MAGIC = new Uint8Array([0x89, 0x54, 0x48, 0x45, 0x55, 0x49, 0x50, 0x0A]);
    
    const sizeBuffer = new ArrayBuffer(4);
    const sizeView = new DataView(sizeBuffer);
    sizeView.setUint32(0, rawData.length, false);
    const sizeBytes = new Uint8Array(sizeBuffer);
    
    const result = new Uint8Array(THEUIP_MAGIC.length + sizeBytes.length + compressed.length);
    
    result.set(THEUIP_MAGIC, 0);
    result.set(sizeBytes, THEUIP_MAGIC.length);
    result.set(compressed, THEUIP_MAGIC.length + sizeBytes.length);
    
    return new Blob([result], { type: 'application/vnd.penguin-pn.theuip' });
  } catch (e) {
    return null;
  }
}

export { filter_css, dctj, decode, encode };
