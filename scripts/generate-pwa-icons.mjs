import sharp from 'sharp';
import { mkdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const iconsDir = join(publicDir, 'icons');

// PWA icon sizes
const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];
const faviconSizes = [16, 32, 48];
const appleTouchSize = 180;
const maskableSizes = [192, 512];

// SVG with background for regular icons
const logoSvg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="#0E1A2B"/>
  <g stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#FBF9F6" stroke-width="18"/>
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#0E1A2B" stroke-width="10"/>
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#FBF9F6" stroke-width="2"/>
  </g>
  <circle cx="30" cy="75" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
  <circle cx="30" cy="50" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
  <circle cx="30" cy="25" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
  <circle cx="75" cy="25" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
  <circle cx="65" cy="50" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
</svg>`;

// Maskable icon (with safe zone padding - logo centered in 80% of canvas)
const maskableSvg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0E1A2B"/>
  <g transform="translate(10, 10) scale(0.8)" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#FBF9F6" stroke-width="18"/>
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#0E1A2B" stroke-width="10"/>
    <path d="M30 75 V25 H75 M30 50 H65" stroke="#FBF9F6" stroke-width="2"/>
    <circle cx="30" cy="75" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
    <circle cx="30" cy="50" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
    <circle cx="30" cy="25" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
    <circle cx="75" cy="25" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
    <circle cx="65" cy="50" r="4" fill="#0E1A2B" stroke="#FBF9F6" stroke-width="2"/>
  </g>
</svg>`;

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  // Create icons directory
  await mkdir(iconsDir, { recursive: true });

  const svgBuffer = Buffer.from(logoSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // Generate standard PWA icons
  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, filename));
    console.log(`  ✓ ${filename}`);
  }

  // Generate maskable icons
  for (const size of maskableSizes) {
    const filename = `icon-maskable-${size}x${size}.png`;
    await sharp(maskableBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, filename));
    console.log(`  ✓ ${filename} (maskable)`);
  }

  // Generate favicons
  for (const size of faviconSizes) {
    const filename = `favicon-${size}x${size}.png`;
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, filename));
    console.log(`  ✓ ${filename}`);
  }

  // Generate Apple Touch Icon
  const appleFilename = 'apple-touch-icon.png';
  await sharp(svgBuffer)
    .resize(appleTouchSize, appleTouchSize)
    .png()
    .toFile(join(publicDir, appleFilename));
  console.log(`  ✓ ${appleFilename}`);

  // Generate favicon.ico (use 32x32 as base)
  // Note: sharp doesn't support .ico directly, we'll use 32x32 png as favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.png'));
  console.log(`  ✓ favicon.png`);

  // Update the SVG favicon
  await sharp(svgBuffer)
    .resize(64, 64)
    .toFile(join(publicDir, 'favicon.svg'));
  console.log(`  ✓ favicon.svg (updated)`);

  console.log('\n✅ All PWA icons generated successfully!');
  console.log(`\n📁 Icons saved to:`);
  console.log(`   - ${iconsDir}/`);
  console.log(`   - ${publicDir}/`);

  console.log('\n📝 Add to your manifest.json:');
  console.log(JSON.stringify({
    icons: [
      ...sizes.map(size => ({
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png'
      })),
      ...maskableSizes.map(size => ({
        src: `/icons/icon-maskable-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'maskable'
      }))
    ]
  }, null, 2));
}

generateIcons().catch(console.error);
