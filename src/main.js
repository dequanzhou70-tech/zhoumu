import './style.css';
import { heroArt, heart, arrow, sparkle } from './art.js';
import { scenes, getResult, resultTypes } from './story.js';
import { profileArt, profilePalettes } from './visuals.js';
import { choiceArt } from './choice-illustrations.js';
import { researchSources, researchShortNote, evidenceNote } from './research.js';

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const STORAGE_KEY = 'crush-cinema:v2';
const defaults = () => ({ screen: 'home', context: { relation: '朋友', style: '还不确定' }, answers: [], current: 0 });
const relations = ['同学 / 同事', '朋友', '刚刚认识', '主要在线上'];
const styles = ['比较主动', '比较慢热', '还不确定'];
let state = defaults();
let sound = false;
let audio;
let toastTimer;
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function loadProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved || !['setup', 'quiz', 'result'].includes(saved.screen)) return null;
    if (!relations.includes(saved.context?.relation) || !styles.includes(saved.context?.style)) return null;
    if (!Array.isArray(saved.answers) || saved.answers.length > scenes.length || !saved.answers.every((a, i) => Number.isInteger(a) && scenes[i].options[a])) return null;
    if (!Number.isInteger(saved.current) || saved.current < 0 || saved.current >= scenes.length) return null;
    if (saved.screen === 'result' && saved.answers.length !== scenes.length) return null;
    if (saved.screen === 'quiz' && saved.current > saved.answers.length) return null;
    return saved;
  } catch { return null; }
}
function save() {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Session storage may be disabled. */ }
}
function toast(message) {
  clearTimeout(toastTimer);
  document.querySelector('#toast').textContent = message;
  document.querySelector('#toast').classList.add('visible');
  toastTimer = setTimeout(() => document.querySelector('#toast').classList.remove('visible'), 3000);
}
function chime() {
  if (!sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(659.25, audio.currentTime);
    gain.gain.setValueAtTime(0.07, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.3);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + 0.3);
  } catch { sound = false; toast('当前浏览器暂不支持音效'); }
}
function header() {
  return `<header class="site-header"><button class="brand" data-action="home" aria-label="心动放映室首页"><span class="brand-icon">${heart}</span><span>心动放映室<small>CRUSH CINEMA</small></span></button><nav aria-label="网站导航"><button class="nav-link" data-action="endings">关系图鉴 <span>↗</span></button><span class="nav-divider"></span><button class="sound-button" data-action="sound" aria-pressed="${sound}" aria-label="${sound ? '关闭' : '开启'}选择音效"><span class="sound-bars ${sound ? 'playing' : ''}"><i></i><i></i><i></i><i></i></span><span>音效${sound ? '开' : '关'}</span></button></nav></header>`;
}
function footer() {
  return `<footer class="site-footer"><span>为每一个偷偷心动的你，留一张票。</span><div><button data-action="about">关于这场放映</button><span>·</span><button data-action="privacy">隐私说明</button><span class="footer-en">MADE WITH A LITTLE CRUSH ${heart}</span></div></footer>`;
}
function render({ focus = false } = {}) {
  const views = { home: homeView, setup: setupView, quiz: quizView, result: resultView };
  app.innerHTML = header() + `<main id="main" class="view-${state.screen}">${views[state.screen]()}</main>` + footer();
  document.title = state.screen === 'quiz' ? `${state.current + 1}/${scenes.length} · 心动放映室` : '心动放映室 — 你的暧昧，放映到哪一幕？';
  if (focus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = app.querySelector('h1');
    if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
  }
}
function homeView() {
  const saved = loadProgress();
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> 今日放映 · 一部关于你们的电影</div><h1>TA 的心里，<br>有没有你的<br><span class="title-highlight">特别出演<span class="title-star">✳</span></span>？</h1><p class="hero-description">有些喜欢，藏在“顺便”里。<br>把那些反复回想的小事，放进一部暧昧电影。<br>解锁你们的关系画像，找到舒服靠近的方式。</p><div class="hero-actions"><button class="button primary" data-action="start">领取我的电影票 ${arrow}</button>${saved ? `<button class="resume" data-action="resume">继续上次放映 ↗</button>` : ''}</div><div class="hero-meta"><span>◷ 约 4 分钟</span><span>${scenes.length} 个故事片段</span><span>${Object.keys(resultTypes).length} 种关系画像</span></div></div><div class="hero-visual"><div class="visual-caption"><span>NOW SHOWING</span><span>LOVE EDITION · 02</span></div><div class="ticket-scene"><div class="scene-top"><span>心动，是一件有迹可循的小事。</span><span class="tiny-star">✦</span></div>${heroArt}<div class="scene-bottom"><span>两位主角，一点点靠近。</span><span>YOU & TA</span></div></div><div class="floating-note note-top"><span>偷偷观察中</span><span>♡</span></div><div class="floating-note note-bottom"><span class="note-heart">${heart}</span><div>这次，你是主角。<small>EVERY LITTLE THING COUNTS</small></div></div><div class="ticket-stub"><span class="stub-side">ADMIT ONE</span><div><span class="stub-label">你的专属心动入场券</span><strong>A STORY ABOUT US</strong></div><div class="barcode" aria-hidden="true"></div><span class="stub-number">NO. 0520</span></div></div></section><section class="preview-strip" aria-label="测试玩法"><div class="strip-heading">接下来的<br><span>心动预告</span>${sparkle}</div><div class="preview-item"><span class="step-number">01</span><div><h2>进入你们的日常</h2><p>聊天、偶遇，还有那句“下次见”</p></div></div><div class="preview-item"><span class="step-number">02</span><div><h2>捕捉那些小信号</h2><p>按真实经历，选择最像的那一幕</p></div></div><div class="preview-item"><span class="step-number">03</span><div><h2>解锁关系属性</h2><p>专属插画、六维解读与相处小方案</p></div></div></section><p class="gentle-note">${heart} 一场轻松的互动体验。我们解读相处的线索，不替 TA 定义喜欢。</p>`;
}
function setupView() {
  return `<section class="setup-layout"><div class="setup-intro"><div class="eyebrow">PROLOGUE / 序章</div><h1>开场之前，<br>给故事一点背景。</h1><p>不用姓名，也不用聊天记录。<br>只需要带上一个你正在想的人。</p><div class="mini-ticket"><span>本场放映主演</span><strong>你 <i>&</i> TA</strong><span>故事尚未完结 · 请放心入座</span></div></div><div class="setup-card"><div class="section-counter">TAKE 01 <span>导演，请就位。</span></div><h2>你们现在是什么关系？</h2><div class="pill-grid" role="group" aria-label="你们的关系">${relations.map(r => `<button class="context-pill ${state.context.relation === r ? 'selected' : ''}" data-relation="${r}" aria-pressed="${state.context.relation === r}">${r}</button>`).join('')}</div><h2>平时的 TA，更接近哪一种？</h2><div class="style-options" role="group" aria-label="TA平时的风格">${styles.map((s, i) => `<button class="style-choice ${state.context.style === s ? 'selected' : ''}" data-style="${s}" aria-pressed="${state.context.style === s}"><span>${['☀', '☽', '✧'][i]}</span><strong>${s}</strong><small>${['通常会主动打开话题', '需要熟悉后才慢慢靠近', '还在收集关于 TA 的线索'][i]}</small><i>${state.context.style === s ? '✓' : ''}</i></button>`).join('')}</div><p class="setup-tip">小提示：接下来请选真实发生过的情况。<br>还没发生过的，放心选“不确定”。</p><button class="button primary full-width" data-action="begin">灯光暗下，故事开始 ${arrow}</button></div></section>`;
}
function quizView() {
  const scene = scenes[state.current];
  const selected = state.answers[state.current];
  const option = scene.options[selected];
  return `<section class="quiz-layout"><aside class="film-sidebar"><button class="back-link" data-action="back">← ${state.current === 0 ? '返回序章' : '上一幕'}</button><div class="eyebrow">NOW PLAYING</div><h2>你们的故事，<br>正在发生。</h2><div class="chapter-list">${[...new Set(scenes.map(s => s.chapterTitle))].map((c, i) => `<div class="chapter ${Number(scene.chapter) === i + 1 ? 'active' : ''} ${Number(scene.chapter) > i + 1 ? 'complete' : ''}"><span>${Number(scene.chapter) > i + 1 ? '✓' : `0${i + 1}`}</span><div><small>CHAPTER 0${i + 1}</small><strong>${c}</strong></div></div>`).join('')}</div><div class="sidebar-note">${sparkle}<p>别替 TA 加戏，<br>也别忽略真实的温柔。</p></div></aside><div class="story-card"><div class="story-progress"><span>片段 <b>${String(state.current + 1).padStart(2, '0')}</b> / ${scenes.length}</span><span>${escape(scene.chapterTitle)}</span></div><div class="progress-track" role="progressbar" aria-label="故事进度" aria-valuenow="${state.current + 1}" aria-valuemin="0" aria-valuemax="${scenes.length}"><span style="width:${(state.current + 1) / scenes.length * 100}%"></span></div><div class="scene-location"><span class="live-dot"></span>${escape(scene.time)} <span>·</span> ${escape(scene.location)}</div><h1>${escape(scene.title)}</h1><p class="narrative">${escape(scene.narrative)}</p>${scene.message ? `<div class="message-scene"><div class="chat-avatar">TA</div><div><span class="message-author">${escape(scene.message.from)}</span><div class="chat-bubble">${escape(scene.message.text)}</div></div><span class="message-star">✳</span></div>` : ''}<h2 class="question">${escape(scene.prompt)}</h2>${scene.visual ? '<p class="visual-prompt">选一幕最像你们的真实相处 ♡</p><p class="visual-casting-note">图中人物仅演绎情境，请代入你和 TA；按发生过的事选择。</p>' : ''}<div class="answer-list ${scene.visual ? 'visual-answers' : ''}" role="group" aria-label="选择最像你们真实经历的情况">${scene.options.map((o, i) => {
    const visual = scene.visual && o.signal !== null;
    const caption = `<span class="answer-key">${String.fromCharCode(65 + i)}</span><span class="answer-copy"><strong>${escape(o.label)}</strong>${o.detail ? `<small>${escape(o.detail)}</small>` : ''}</span><span class="answer-check">${selected === i ? '✓' : ''}</span>`;
    return `<button class="answer ${visual ? 'image-answer' : ''} ${selected === i ? 'selected' : ''} ${o.signal === null ? 'unknown-answer' : ''}" data-answer="${i}" aria-pressed="${selected === i}">${visual ? `<span class="option-art">${choiceArt(o.imageKey)}</span><span class="answer-bottom">${caption}</span>` : caption}</button>`;
  }).join('')}</div><div class="scene-controls"><p class="selection-reaction" role="status">${option ? `${sparkle}<span>${escape(option.reaction || '这一幕，已放进你的电影。')}</span>` : '<span>选择最接近真实情况的一项</span>'}</p><button class="button primary next-button" data-action="next" ${option ? '' : 'disabled'}>${state.current === scenes.length - 1 ? '揭晓我的结局' : '下一幕'} ${arrow}</button></div></div></section>`;
}
function tagsMarkup(tags = []) { return `<div class="profile-tags">${tags.map(t => `<span># ${escape(t)}</span>`).join('')}</div>`; }
function citations(ids = []) {
  return `<div class="source-links"><span>研究参考</span>${ids.map(id => {
    const source = researchSources.find(s => s.id === id);
    return source ? `<a href="#source-${source.id}" data-source="${source.id}">${escape(source.authors.split(',')[0])} 等 · ${source.year} ↗</a>` : '';
  }).join('')}</div>`;
}
function guidanceView(result) {
  return `<section class="guidance-section"><div class="eyebrow">YOUR RELATIONSHIP FIELD GUIDE</div><h2>心动之外，怎么相处更舒服？</h2><p>把你选过的片段，变成可以试试的小行动。以下解读只针对这段互动，不是对你或 TA 的人格判断。</p><div class="guidance-grid">${result.guidance.map((g, i) => `<article class="guidance-card" data-dimension="${g.key}"><div class="guidance-heading"><h3>${String(i+1).padStart(2,'0')} / ${escape(g.label)}</h3><span class="guidance-level">${g.value === null ? '线索待补充' : `${g.value} / 100`} · ${g.knownCount} 条线索</span></div><p class="guidance-observation">${escape(g.observation)}</p><p class="guidance-interpretation">${escape(g.interpretation)}</p><dl><dt>可以试试</dt><dd>${escape(g.tryThis)}</dd><dt>相处时留意</dt><dd>${escape(g.avoid)}</dd></dl><blockquote class="say-box"><span>一句能直接说出口的话</span>“${escape(g.say)}”</blockquote>${citations(g.sourceIds)}</article>`).join('')}</div></section><section class="action-plan"><div class="eyebrow">A LITTLE COURAGE, IN YOUR OWN PACE</div><h2>给下一次相处，一点具体方向。</h2><p>不用制造试探，也不需要按时打卡。按你自己的节奏，挑一件适合的事。</p><div class="plan-grid">${result.actionPlan.map((p,i) => `<article class="plan-step"><span>0${i+1}</span><h3>${escape(p.label)}</h3><p>${escape(p.action)}</p><small>观察点：${escape(p.observe)}</small></article>`).join('')}</div></section><section class="research-section"><details class="research-details"><summary>这些建议从哪里来？研究依据与适用范围</summary><p class="research-intro">${escape(evidenceNote)}</p>${researchSources.map((r,i) => `<article class="research-source" id="source-${r.id}"><h3 tabindex="-1">[${i+1}] ${escape(r.authors)} (${r.year})</h3><a href="${r.url}" target="_blank" rel="noopener noreferrer">${escape(r.title)} ↗</a><small>${escape(r.journal)}</small><p>研究启发：${escape(r.finding)}</p><p>适用边界：${escape(r.limits)}</p></article>`).join('')}<p class="research-note">本产品的画像名称、分型和阈值为原创体验设计，未经心理量表验证。建议参考上述文献，不承诺促成恋爱，也不把任何人诊断为某种依恋类型。</p></details></section>`;
}
function resultView() {
  const result = getResult(state.answers, state.context);
  return `<section class="result-layout"><div class="result-top"><div class="eyebrow">LOVE PROFILE / 你们此刻的关系画像</div><h1>你的关系属性，出片了。</h1><p>不只看心动浓度，也看看怎样靠近适合你们。</p></div><div class="result-columns"><div class="result-poster" id="result-poster"><div class="poster-top"><span>心动放映室</span><span>RELATIONSHIP PORTRAIT</span></div><span class="profile-code">${escape(result.profileCode)}</span><span class="result-kicker">${escape(result.kicker)}</span><h2>${escape(result.title)}</h2><p class="profile-attribute">${escape(result.relationshipAttribute)}</p>${tagsMarkup(result.tags)}<div class="result-art">${profileArt(result.id)}</div><p class="result-subtitle">${escape(result.subtitle)}</p><blockquote>“${escape(result.quote)}”</blockquote><div class="poster-score"><div><small>剧情升温值</small><strong>${result.score === null ? '待续' : `${result.score}<i>/ 100</i>`}</strong></div><span>${escape(result.confidence)}<small>互动信号 ≠ 喜欢的概率</small></span></div><div class="poster-bottom"><span>YOUR RELATIONSHIP, YOUR OWN PACE.</span>${heart}</div></div><div class="result-detail"><div class="analysis-block"><span class="block-label">01 / 你的属性关键词</span><h2>${escape(result.description)}</h2><p class="context-note">${escape(result.caution)}</p></div><div class="analysis-block"><span class="block-label">02 / 六维互动地图</span><div class="dimension-list">${result.dimensions.map(d => `<div class="dimension"><div><span>${escape(d.label)}</span><span>${d.value === null ? '待观察' : `${d.value} / 100`}</span></div><div class="dimension-track"><i style="width:${d.value ?? 0}%"></i></div></div>`).join('')}</div><ul class="evidence-list">${result.evidence.map(e => `<li>${escape(e)}</li>`).join('')}</ul></div><div class="next-scene"><span>${sparkle} 适合你们的下一幕</span><p>${escape(result.nextStep)}</p></div><div class="result-actions"><button class="button primary" data-action="download">保存关系属性海报 ↓</button><button class="button secondary" data-action="share">邀请朋友测一测 ↗</button></div><button class="restart-link" data-action="restart">换一位主角，重新放映 ↺</button><p class="result-disclaimer">${escape(researchShortNote)}<br>向下查看六维相处建议与参考文献。</p></div></div>${guidanceView(result)}</section>`;
}
let modalReturnFocus;
function openModal(content, className = '') {
  if (!modal.open) modalReturnFocus = document.activeElement;
  modal.className = className;
  modal.innerHTML = `<button class="modal-close" data-action="close-modal" aria-label="关闭弹窗">×</button>${content}`;
  if (!modal.open) modal.showModal();
  modal.querySelector('.modal-close').focus();
}
function endings() {
  openModal(`<div class="eyebrow">THE RELATIONSHIP COLLECTION</div><h2 id="modal-title">12 种关系属性，没有标准剧本。</h2><p class="modal-intro">小火箭、茶壶、云端来信……你们的相处像哪一种？<br>点开看看画像预告，再用 ${scenes.length} 个片段找到属于你们的那一张。</p><div class="ending-grid">${Object.entries(resultTypes).map(([id,r]) => `<button class="ending-card" data-profile="${id}" aria-label="查看${escape(r.title)}画像预告"><span>${escape(r.code)} ${sparkle}</span><span class="ending-art">${profileArt(id)}</span><h3>${escape(r.title)}</h3><p>${escape(r.attribute)}</p>${tagsMarkup(r.tags)}</button>`).join('')}</div><p class="modal-note">这些是关系互动的当下画像，没有好坏排名，也不是人格或依恋诊断。</p>`, 'endings-modal');
}
function profilePreview(id) {
  const r = resultTypes[id]; if (!r) return;
  openModal(`<div class="profile-preview"><div class="eyebrow">画像预告 / ${escape(r.code)}</div><h2 id="modal-title">${escape(r.title)}</h2><p class="profile-attribute">${escape(r.attribute)}</p><div class="result-art">${profileArt(id)}</div>${tagsMarkup(r.tags)}<p class="modal-intro">${escape(r.description)}</p><p class="modal-note">这是图鉴预告，不是你的测试结果。完成答题后，会按你提供的互动线索生成画像与相处建议。</p><button class="button secondary" data-action="endings">← 返回关系图鉴</button></div>`, 'profile-modal');
}
async function share() {
  const url = new URL(location.href); url.hash = ''; url.search = '';
  if (!['https:', 'http:'].includes(url.protocol) || ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(url.hostname)) {
    toast('当前是本地预览，正式上线后即可分享网站链接'); return;
  }
  const data = { title: '心动放映室', text: '你和 TA 的暧昧，放映到哪一幕了？来领一张专属电影票。', url: url.href };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url.href);
    toast('链接已复制，发给朋友一起看');
  } catch (error) {
    if (error.name === 'AbortError') return;
    openModal(`<h2 id="modal-title">把这张电影票递给朋友</h2><p class="modal-intro">复制下面的网站地址，即可邀请朋友测试。链接不包含你的答案。</p><input class="share-url" aria-label="网站地址" readonly value="${escape(url.href)}">`);
    modal.querySelector('input').select();
  }
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const char of text) {
    if (ctx.measureText(line + char).width > maxWidth && line) { ctx.fillText(line, x, y); line = char; y += lineHeight; }
    else line += char;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}
async function downloadPoster() {
  const result = getResult(state.answers, state.context);
  const [bg,accent,soft] = profilePalettes[result.id];
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1560;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff5f8'; ctx.fillRect(0, 0, 1080, 1560);
  ctx.fillStyle = bg; ctx.fillRect(46, 46, 988, 1468);
  ctx.strokeStyle = soft; ctx.lineWidth = 2; ctx.strokeRect(65, 65, 950, 1430);
  ctx.fillStyle = '#815169'; ctx.font = '24px sans-serif'; ctx.fillText('心动放映室 / CRUSH CINEMA', 105, 124);
  ctx.textAlign = 'right'; ctx.font = '22px Georgia,serif'; ctx.fillText(result.profileCode, 974, 124);
  ctx.textAlign = 'center'; ctx.fillStyle = accent; ctx.font = '23px sans-serif'; ctx.fillText(result.kicker, 540, 202);
  ctx.fillStyle = '#70445c'; ctx.font = 'bold 59px serif';
  let y = wrapText(ctx, result.title, 540, 285, 880, 76);
  ctx.font = '27px sans-serif'; ctx.fillStyle = '#9b7088';
  y = wrapText(ctx, result.relationshipAttribute, 540, y + 4, 880, 38);
  ctx.font = '22px sans-serif'; ctx.fillStyle = accent; ctx.fillText(result.tags.map(t => `#${t}`).join('    '), 540, y + 15);
  const blobUrl = URL.createObjectURL(new Blob([profileArt(result.id)], { type: 'image/svg+xml' }));
  try {
    const img = new Image(); img.src = blobUrl; await img.decode();
    ctx.drawImage(img, 180, 425, 720, 626);
  } finally { URL.revokeObjectURL(blobUrl); }
  ctx.fillStyle = '#875d75'; ctx.font = '28px serif'; wrapText(ctx, `“${result.quote}”`, 540, 1070, 850, 41);
  ctx.textAlign = 'left'; ctx.strokeStyle = soft; ctx.beginPath(); ctx.moveTo(105, 1150); ctx.lineTo(975, 1150); ctx.stroke();
  result.dimensions.forEach((d,i) => {
    const x = 112 + (i%3)*300, top = 1190 + Math.floor(i/3)*80;
    ctx.fillStyle = '#926c83'; ctx.font = '21px sans-serif'; ctx.fillText(d.label, x, top);
    ctx.fillStyle = accent; ctx.textAlign = 'right'; ctx.font = '20px sans-serif'; ctx.fillText(d.value === null ? '待观察' : String(d.value), x+242, top);ctx.textAlign='left';
    ctx.fillStyle = soft; ctx.fillRect(x,top+16,242,5); ctx.fillStyle=accent;ctx.fillRect(x,top+16,242*(d.value??0)/100,5);
  });
  ctx.textAlign='center'; ctx.font='22px sans-serif';ctx.fillStyle='#926c83';
  ctx.fillText(`剧情升温值 ${result.score===null?'待续':`${result.score}/100`}  ·  ${result.confidence}`,540,1370);
  ctx.font='19px sans-serif';ctx.fillText('关系的此刻画像，不是喜欢的概率。相处指南见测试结果页。',540,1421);
  ctx.font='18px Georgia,serif';ctx.fillStyle=accent;ctx.fillText('LOVE, AT YOUR OWN PACE.',540,1470);
  canvas.toBlob(blob => {
    if (!blob) { toast('海报生成失败，请重试'); return; }
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `心动放映室-${result.title}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast('专属属性海报已生成，可在下载中保存图片');
  }, 'image/png');
}
function go(screen) { state.screen = screen; save(); render({ focus: true }); }
function handleClick(event) {
  const sourceLink = event.target.closest('[data-source]');
  if (sourceLink) { event.preventDefault(); const details = app.querySelector('.research-details'); details.open = true; const source = document.getElementById(`source-${sourceLink.dataset.source}`); source?.scrollIntoView({ block: 'start', behavior: 'instant' }); source?.querySelector('h3').focus({ preventScroll: true }); return; }
  const target = event.target.closest('button'); if (!target) return;
  if (target.dataset.profile) { profilePreview(target.dataset.profile); return; }
  if (target.dataset.relation) { state.context.relation = target.dataset.relation; save(); render(); [...app.querySelectorAll('[data-relation]')].find(b => b.dataset.relation === state.context.relation)?.focus({ preventScroll: true }); return; }
  if (target.dataset.style) { state.context.style = target.dataset.style; save(); render(); [...app.querySelectorAll('[data-style]')].find(b => b.dataset.style === state.context.style)?.focus({ preventScroll: true }); return; }
  if (target.dataset.answer !== undefined) {
    const index = Number(target.dataset.answer);
    state.answers[state.current] = index; save(); chime();
    // Keep keyboard focus on the selected answer after updating its visual state.
    render(); app.querySelector(`[data-answer="${index}"]`)?.focus({ preventScroll: true }); return;
  }
  switch (target.dataset.action) {
    case 'home': state.screen = 'home'; render({ focus: true }); break;
    case 'start':
      if (loadProgress()) {
        openModal(`<h2 id="modal-title">要开启一场新的放映吗？</h2><p class="modal-intro">重新开始会清除本次浏览器中已保存的作答。</p><div class="modal-buttons"><button class="button secondary" data-action="resume">继续上次</button><button class="button primary" data-action="fresh">重新开始</button></div>`);
      } else { state = defaults(); go('setup'); } break;
    case 'fresh': modal.close(); state = defaults(); go('setup'); break;
    case 'resume': modal.close(); state = loadProgress() || { ...defaults(), screen: 'setup' }; render({ focus: true }); break;
    case 'begin': state.answers = []; state.current = 0; go('quiz'); break;
    case 'back': if (state.current > 0) { state.current -= 1; go('quiz'); } else go('setup'); break;
    case 'next':
      if (!scenes[state.current].options[state.answers[state.current]]) return;
      if (state.current < scenes.length - 1) { state.current += 1; go('quiz'); } else { chime(); go('result'); } break;
    case 'restart': openModal(`<h2 id="modal-title">重新开始一场故事？</h2><p class="modal-intro">建议先保存结局海报。重新放映会清除这次作答。</p><div class="modal-buttons"><button class="button secondary" data-action="close-modal">再看看结局</button><button class="button primary" data-action="fresh">重新放映</button></div>`); break;
    case 'endings': endings(); break;
    case 'sound': sound = !sound; chime(); render(); app.querySelector('[data-action="sound"]')?.focus({ preventScroll: true }); break;
    case 'close-modal': modal.close(); break;
    case 'share': share(); break;
    case 'download': downloadPoster().catch(() => toast('海报生成失败，请稍后重试')); break;
    case 'about': openModal(`<div class="eyebrow">ABOUT THIS LITTLE MOVIE</div><h2 id="modal-title">每一份心动，都值得温柔对待。</h2><p class="modal-intro">心动放映室是一场以日常互动为线索的故事测试。${scenes.length} 个片段，会从主动靠近、特别关注、情绪回应、行动投入、相处稳定和边界尊重六个角度，整理你观察到的相处细节，生成 ${Object.keys(resultTypes).length} 种关系属性画像之一。</p><p class="modal-intro">“剧情升温值”是已知互动信号的汇总，不是 TA 喜欢你的概率；关系背景用于提供情境提醒，不会凭空加分。部分画像会结合线上相处背景作区分；分型是产品规则，不是研究量表。这不是经过验证的心理量表，也不能代替坦诚的沟通。</p><p class="modal-note">没有标准答案，只有正在发生的故事。</p>`); break;
    case 'privacy': openModal(`<div class="eyebrow">JUST BETWEEN YOU & YOU</div><h2 id="modal-title">你的小心事，留在你这里。</h2><p class="modal-intro">网站不要求登录、姓名或聊天记录，不设置答题数据收集接口，也不使用统计追踪。作答进度仅保存在当前浏览器标签页的会话存储中，关闭标签页后通常会清除；浏览器恢复会话时可能保留。</p><p class="modal-intro">保存海报在你的设备上生成。邀请链接不包含答案。托管服务可能记录常规访问日志，请以其隐私政策为准。</p><button class="button secondary" data-action="clear-progress">清除这次作答并回到首页</button>`); break;
    case 'clear-progress': try { sessionStorage.removeItem(STORAGE_KEY); } catch {} modal.close(); state = defaults(); render({ focus: true }); toast('本次作答已清除'); break;
  }
}
app.addEventListener('click', handleClick);
modal.addEventListener('close', () => { if (modalReturnFocus?.isConnected) modalReturnFocus.focus({ preventScroll: true }); });
modal.addEventListener('click', event => {
  if (event.target === modal) {
    const rect = modal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
  } else handleClick(event);
});
// Show the landing page first; resuming a personal session is always explicit.
render();
