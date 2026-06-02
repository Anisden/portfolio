const fs = require('fs');
const path = require('path');

const uploadDir = 'e:\\CV Anis BOUDEN\\Site CV portfolio\\portfolio-app\\public\\uploads';

function copyFile(src, name) {
  const ts = Date.now();
  const dest = path.join(uploadDir, `${ts}_${name}`);
  try {
    fs.copyFileSync(src, dest);
    console.log(`OK: ${name} -> ${ts}`);
    return `/uploads/${ts}_${name}`;
  } catch (e) {
    console.error(`MISSING: ${src}`);
    return '';
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const results = {};

  // ---- 684 - Salle multi ----
  const b684sm = "D:\\Projets Anis LDA\\Projets 2023\\LDA-2023-684 VAL Construction d'un nouveau centre communautaire\\04-Dossier de Travail\\01-Modélisation\\03-Rendus\\20240920 Salle multi";
  await sleep(3);
  results['684_v3'] = copyFile(path.join(b684sm, 'Proposition1 (Concept).jpg'), '684_v3.jpg');
  await sleep(3);
  results['684_v4'] = copyFile(path.join(b684sm, 'Proposition2 Plafond pâle.jpg'), '684_v4.jpg');
  await sleep(3);
  results['684_v5'] = copyFile(path.join(b684sm, 'Proposition2 Plafond pâle lattage visible.jpg'), '684_v5.jpg');
  await sleep(3);
  results['684_v6'] = copyFile(path.join(b684sm, 'Proposition3 poutre, plafond et plancher pâles.jpg'), '684_v6.jpg');

  // ---- 689 - Arena de Levis rendus ----
  const b689 = "D:\\Projets Anis LDA\\Projets 2023\\LDA-2023-689 VL Mise à jour du PFT ajout d'une glace à l'aréna de Lévis\\04-Dossier de Travail\\01-Modélisation\\03-Rendus";
  await sleep(3);
  results['689_main'] = copyFile(path.join(b689, 'Vue façade principale.jpg'), '689_main.jpg');
  await sleep(3);
  results['689_v5']   = copyFile(path.join(b689, 'Vue façade Est.jpg'), '689_v5.jpg');
  await sleep(3);
  results['689_v6']   = copyFile(path.join(b689, 'Vue façade Ouest.jpg'), '689_v6.jpg');

  // ---- 661 - Chalet Marechal-Joffre Lumion ----
  const b661lum = "D:\\Projets Anis LDA\\Projets 2022\\LD-2022-661 VL Reconstruction du chalet du parc Maréchal-Joffre\\04-Dossier de Travail\\01-Modélisation\\04-Lumion\\Rendu 15-11-2022";
  const b661rnd = "D:\\Projets Anis LDA\\Projets 2022\\LD-2022-661 VL Reconstruction du chalet du parc Maréchal-Joffre\\04-Dossier de Travail\\01-Modélisation\\03-Rendus\\27-10-2022";
  await sleep(3);
  results['661_main'] = copyFile(path.join(b661lum, 'Arrivée1_Modifiée.jpg'), '661_main.jpg');
  await sleep(3);
  results['661_v2']   = copyFile(path.join(b661lum, 'Vue générale.jpg'), '661_v2.jpg');
  await sleep(3);
  results['661_v6']   = copyFile(path.join(b661rnd, 'Chalet Maréchal-Joffre_1.png'), '661_v6.png');
  await sleep(3);
  results['661_v7']   = copyFile(path.join(b661rnd, 'Chalet Maréchal-Joffre_2.png'), '661_v7.png');

  // ---- 629A - Piscine Sainte-Genevieve ----
  const b629A = "D:\\Projets Anis LDA\\Projets 2021\\LD-2021-629A VQ  Réfection de la piscine Sainte-Geneviève\\04-Dossier de Travail\\01-Modélisation\\03-Rendus";
  for (let i = 2; i <= 11; i++) {
    await sleep(3);
    results[`629A_v${i}`] = copyFile(path.join(b629A, `Ste-Geneviève rendu ${i}.png`), `629A_v${i}.png`);
  }
  await sleep(3);
  results['629A_bleu'] = copyFile(path.join(b629A, 'Ste-Geneviève Bleu+douches.png'), '629A_bleu.png');

  // Output results
  console.log('\n=== RESULTS ===');
  Object.entries(results).forEach(([k, v]) => console.log(`${k} = ${v}`));
}

main().catch(console.error);
