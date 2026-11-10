/**
 * Encodeur PNG minimal (RGBA 8 bits) et vignettes en pixel art du blog,
 * rendues en `data:` pour être incorporées dans les SVG.
 */
import zlib from 'node:zlib'
import { ICON_H, ICON_W, iconPixels } from './icons.mjs'

const CRC = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()
function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const head = Buffer.alloc(4)
  head.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const tail = Buffer.alloc(4)
  tail.writeUInt32BE(crc32(body))
  return Buffer.concat([head, body, tail])
}

export function encodePng(w, h, rgba) {
  const stride = w * 4 + 1
  const raw = Buffer.alloc(stride * h) // un octet de filtre (0) en tête de chaque ligne
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * stride + 1)
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bits par canal
  ihdr[9] = 6 // RGBA
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

/**
 * Vignette du blog (computer, satellite, globe, gear, chip, mic, factory, phone,
 * network, rocket) en PNG, agrandie `scale` fois sans lissage.
 */
export function iconDataUri(name, scale = 2) {
  const cells = iconPixels(name) // Uint32Array, octets R G B A (petit-boutiste)
  const w = ICON_W * scale
  const h = ICON_H * scale
  const out = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = cells[Math.floor(y / scale) * ICON_W + Math.floor(x / scale)]
      const i = (y * w + x) * 4
      out[i] = c & 0xff
      out[i + 1] = (c >>> 8) & 0xff
      out[i + 2] = (c >>> 16) & 0xff
      out[i + 3] = (c >>> 24) & 0xff
    }
  }
  return `data:image/png;base64,${encodePng(w, h, out).toString('base64')}`
}
