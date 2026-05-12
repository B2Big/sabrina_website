const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Config
const MAX_WIDTH = 800;
const QUALITY = 80;

// Dossiers
const MASSAGE_SRC = 'public/img/sabrina/massage';
const SPORT_SRC = 'public/img/sabrina/sport';
const MASSAGE_OUT = 'public/img/sabrina/massage/webp';
const SPORT_OUT = 'public/img/sabrina/sport/webp';

function getImageFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .map(f => ({
      name: f,
      size: fs.statSync(path.join(dir, f)).size,
      base: path.parse(f).name
    }))
    .sort((a, b) => a.size - b.size);
}

async function convertImage(srcPath, outPath, baseName) {
  const outFile = path.join(outPath, `${baseName}.webp`);
  try {
    await sharp(srcPath)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outFile);
    const originalSize = fs.statSync(srcPath).size;
    const newSize = fs.statSync(outFile).size;
    const ratio = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(`  ✅ ${baseName}.webp (${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB, -${ratio}%)`);
    return { success: true, baseName };
  } catch (err) {
    console.error(`  ❌ ${baseName}: ${err.message}`);
    return { success: false, baseName };
  }
}

async function processCategory(label, srcDir, outDir, count) {
  console.log(`\n🖼️  ${label}`);
  const files = getImageFiles(srcDir);
  console.log(`   ${files.length} images trouvées, ${count} plus légères sélectionnées`);

  const selected = files.slice(0, count);
  const results = [];

  for (const file of selected) {
    const result = await convertImage(
      path.join(srcDir, file.name),
      outDir,
      file.base.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '')
    );
    if (result.success) results.push(result.baseName);
  }

  return results;
}

(async () => {
  console.log('🚀 Optimisation des images pour le carousel...');
  console.log(`   Max width: ${MAX_WIDTH}px | Quality: ${QUALITY}%`);

  const massageImages = await processCategory('Massage', MASSAGE_SRC, MASSAGE_OUT, 10);
  const sportImages = await processCategory('Sport', SPORT_SRC, SPORT_OUT, 10);

  console.log('\n📊 Résumé:');
  console.log(`   Massage: ${massageImages.length} images optimisées`);
  console.log(`   Sport: ${sportImages.length} images optimisées`);

  // Générer le tableau d'images pour le composant
  console.log('\n📋 Code pour photo-marquee.tsx:');
  console.log('const IMAGES = [');
  [...sportImages, ...massageImages].forEach(name => {
    const dir = sportImages.includes(name) ? 'sport' : 'massage';
    console.log(`  { src: '/img/sabrina/${dir}/webp/${name}.webp', alt: 'Sabrina ${dir === "sport" ? "coaching sportif" : "massage bien-être"}' },`);
  });
  console.log('];');

  console.log('\n✅ Terminé !');
})();
