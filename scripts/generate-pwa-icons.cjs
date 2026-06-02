// Generates solid-color PNG icons for PWA (no external dependencies)
// Brand color: #863bff (R:134, G:59, B:255)

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const tb = Buffer.from(type, 'ascii');
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  tb.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([tb, data])), 8 + data.length);
  return out;
}

function makePNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

  // Build scanlines with filter byte 0 (None)
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0;
    for (let x = 0; x < size; x++) {
      row[1 + x * 3] = r;
      row[2 + x * 3] = g;
      row[3 + x * 3] = b;
    }
    rows.push(row);
  }
  const compressed = zlib.deflateSync(Buffer.concat(rows), { level: 9 });

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

const publicDir = path.join(__dirname, '..', 'public');

const icons = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-maskable-512x512.png', size: 512 },
];

// Brand purple: #863bff
const [R, G, B] = [134, 59, 255];

for (const { name, size } of icons) {
  const buf = makePNG(size, R, G, B);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Created ${name} (${size}x${size})`);
}

console.log('Done!');
