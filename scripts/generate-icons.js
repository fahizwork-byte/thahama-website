#!/usr/bin/env node
/**
 * Generate favicon and app icons from SVG logo
 * Creates: icon.svg, apple-icon.png, and manifest icons
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Use icon-only version for favicons
const inputSvg = path.join(__dirname, '../public/logos/thahama-icon-only.svg');
const appIconSvg = path.join(__dirname, '../app/icon.svg');
const appDir = path.join(__dirname, '../app');
const publicDir = path.join(__dirname, '../public');

const sizes = {
  'apple-icon': 180, // iOS Safari
  'icon-192': 192,   // Android Chrome, PWA
  'icon-512': 512,   // PWA splash screen
  'favicon-16': 16,  // Legacy browser tab
  'favicon-32': 32,  // Legacy browser tab
};

async function generateIcons() {
  console.log('🎨 Generating icons from SVG...\n');

  // Ensure app directory exists
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  // Ensure public/icons directory exists
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Check if input SVG exists
  if (!fs.existsSync(inputSvg)) {
    console.error(`❌ Error: ${inputSvg} not found!`);
    console.log('💡 Tip: Make sure public/logos/thahama-icon-only.svg exists first.');
    process.exit(1);
  }

  // Copy icon-only SVG to app directory for Next.js to serve
  console.log('📋 Copying icon-only SVG to app/icon.svg...');
  fs.copyFileSync(inputSvg, appIconSvg);

  // Generate Apple Touch Icon (iOS)
  console.log('📱 Generating Apple Touch Icon (180x180)...');
  await sharp(inputSvg)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'))
    .catch(err => {
      console.error('Error generating apple-icon.png:', err);
    });

  // Generate PWA icons
  console.log('📱 Generating PWA icon (192x192)...');
  await sharp(inputSvg)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'icons', 'icon-192x192.png'))
    .catch(err => {
      console.error('Error generating icon-192x192.png:', err);
    });

  console.log('📱 Generating PWA icon (512x512)...');
  await sharp(inputSvg)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'icons', 'icon-512x512.png'))
    .catch(err => {
      console.error('Error generating icon-512x512.png', err);
    });

  // Generate legacy favicons (optional, SVG is preferred)
  console.log('🌐 Generating legacy favicons (16x16, 32x32)...');
  await sharp(inputSvg)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'))
    .catch(err => {
      console.error('Error generating favicon-32x32.png:', err);
    });

  await sharp(inputSvg)
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'))
    .catch(err => {
      console.error('Error generating favicon-16x16.png:', err);
    });

  console.log('\n✅ Icon generation complete!');
  console.log('\n📋 Generated files:');
  console.log('  - app/icon.svg (SVG favicon - modern browsers)');
  console.log('  - app/apple-icon.png (iOS Safari)');
  console.log('  - public/icons/icon-192x192.png (PWA/Android)');
  console.log('  - public/icons/icon-512x512.png (PWA splash)');
  console.log('  - public/favicon-16x16.png (legacy)');
  console.log('  - public/favicon-32x32.png (legacy)');
  console.log('\n💡 Next.js will automatically serve app/icon.svg and app/apple-icon.png');
}

generateIcons().catch(console.error);

