const sharp = require('sharp');
const path = require('path');

const images = [
  // Hero (critical LCP — higher quality)
  { src: '../Panthor Pics/Edited Pics/Hero.png',                       dest: '../Panthor Pics/Edited Pics/Hero.webp',                       quality: 82, width: 1920 },
  // About photo
  { src: '../Panthor Pics/Edited Pics/About Photo.png',                dest: '../Panthor Pics/Edited Pics/About Photo.webp',                quality: 80, width: 900 },
  // Behind the scenes
  { src: '../Panthor Pics/Edited Pics/behind the scenes video shoot.png', dest: '../Panthor Pics/Edited Pics/behind the scenes video shoot.webp', quality: 80, width: 900 },
  // Gallery (lazy-loaded, can be smaller)
  { src: '../Panthor Pics/Edited Pics/1.png', dest: '../Panthor Pics/Edited Pics/1.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/2.png', dest: '../Panthor Pics/Edited Pics/2.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/3.png', dest: '../Panthor Pics/Edited Pics/3.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/4.png', dest: '../Panthor Pics/Edited Pics/4.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/5.png', dest: '../Panthor Pics/Edited Pics/5.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/6.png', dest: '../Panthor Pics/Edited Pics/6.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/7.png', dest: '../Panthor Pics/Edited Pics/7.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/8.png', dest: '../Panthor Pics/Edited Pics/8.webp', quality: 78, width: 1200 },
  { src: '../Panthor Pics/Edited Pics/9.PNG', dest: '../Panthor Pics/Edited Pics/9.webp', quality: 78, width: 1200 },
  // Music video thumbnails
  { src: '../Panthor Pics/Music Video 1.png', dest: '../Panthor Pics/Music Video 1.webp', quality: 80, width: 800 },
  { src: '../Panthor Pics/Music Video 2.png', dest: '../Panthor Pics/Music Video 2.webp', quality: 80, width: 800 },
  { src: '../Panthor Pics/Music Video 3.png', dest: '../Panthor Pics/Music Video 3.webp', quality: 80, width: 800 },
  { src: '../Panthor Pics/Music Video 4.png', dest: '../Panthor Pics/Music Video 4.webp', quality: 80, width: 800 },
  // Studio / BTS
  { src: '../Panthor Pics/studio 1.png', dest: '../Panthor Pics/studio 1.webp', quality: 80, width: 900 },
];

async function run() {
  for (const img of images) {
    const src = path.resolve(__dirname, img.src);
    const dest = path.resolve(__dirname, img.dest);
    try {
      const meta = await sharp(src).metadata();
      const resizeWidth = Math.min(img.width, meta.width || img.width);
      await sharp(src)
        .resize({ width: resizeWidth, withoutEnlargement: true })
        .webp({ quality: img.quality })
        .toFile(dest);
      const { size: srcSize } = require('fs').statSync(src);
      const { size: destSize } = require('fs').statSync(dest);
      console.log(`✓ ${path.basename(img.src).padEnd(45)} ${Math.round(srcSize/1024)}KB → ${Math.round(destSize/1024)}KB`);
    } catch (e) {
      console.error(`✗ ${img.src}: ${e.message}`);
    }
  }
  console.log('\nDone.');
}

run();
