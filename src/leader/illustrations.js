import sheet from './boss-sheet.webp?inline';
import mascotSheet from './mascot-sheet.webp?inline';
import {types} from './data.js';

export function mascotArt() {
  return `<svg class="boss-art" viewBox="0 0 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image href="${mascotSheet}" width="400" height="200" preserveAspectRatio="none"/></svg>`;
}

// One local, self-contained sheet; consistent crops are also used in the PNG export.
export function bossArt(id) {
  const index = Math.max(0, types.findIndex(type => type.id === id));
  const x = index % 4 * 100;
  const y = Math.floor(index / 4) * 100;
  return `<svg class="boss-art" data-boss-art="${id}" viewBox="${x} ${y} 100 100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><image href="${sheet}" width="400" height="200" preserveAspectRatio="none"/></svg>`;
}
let imagePromise;
export async function paintBoss(context, id, x, y, width, height) {
  imagePromise ||= new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => { imagePromise = undefined; reject(new Error('Illustration unavailable')); };
    image.src = sheet;
  });
  const image = await imagePromise;
  const index = Math.max(0, types.findIndex(type => type.id === id));
  const cellWidth = image.naturalWidth / 4;
  const cellHeight = image.naturalHeight / 2;
  context.drawImage(image, index % 4 * cellWidth, Math.floor(index / 4) * cellHeight, cellWidth, cellHeight, x, y, width, height);
}
