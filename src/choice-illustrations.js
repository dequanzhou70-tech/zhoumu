import messages from './assets/story/messages.webp?inline';
import coffee from './assets/story/coffee.webp?inline';
import crowd from './assets/story/crowd.webp?inline';
import news from './assets/story/news.webp?inline';
import calendar from './assets/story/calendar.webp?inline';
import activity from './assets/story/activity.webp?inline';
import { choiceScenes, storySheets, sceneCrop } from './choice-scenes.js';

const sheets = { messages, coffee, crowd, news, calendar, activity };
const xml = text => String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' }[c]));

export function choiceArt(key) {
  const scene = choiceScenes[key];
  if (!scene) return '';
  const sheet = storySheets[scene.theme];
  const crop = sceneCrop(key);
  const scale = Math.max(480 / crop.width, 320 / crop.height);
  const x = -crop.x * scale + (480 - crop.width * scale) / 2;
  const y = -crop.y * scale + (320 - crop.height * scale) / 2;
  // Each quarter is its own narrative scene. SVG crops do not modify the source artwork.
  // Inlined assets keep the downloadable HTML independent of image servers and CDNs.
  return `<svg width="480" height="320" viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" data-scene-art="${key}" aria-hidden="true"><title>${xml(scene.description)}</title><defs><clipPath id="scene-window-${key}"><rect width="480" height="320"/></clipPath></defs><g clip-path="url(#scene-window-${key})"><image href="${sheets[scene.theme]}" x="${x}" y="${y}" width="${sheet.width * scale}" height="${sheet.height * scale}"/></g><rect y="252" width="480" height="68" fill="#fff8fc" fill-opacity=".95"/><path d="M16 267v17" stroke="#c185a2" stroke-width="3" stroke-linecap="round"/><text x="28" y="281" fill="#74485d" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="18">${xml(scene.dialogue)}</text><text x="28" y="306" fill="#9c7188" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="14">${xml(scene.caption)}</text></svg>`;
}
