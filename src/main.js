import './style.css';
import { heroArt, heart, arrow, sparkle } from './art.js';
import { scenes, getResult, resultTypes } from './story.js';

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const STORAGE_KEY = 'crush-cinema:v1';
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
  return `<header class="site-header"><button class="brand" data-action="home" aria-label="心动放映室首页"><span class="brand-icon">${heart}</span><span>心动放映室<small>CRUSH CINEMA</small></span></button><nav aria-label="网站导航"><button class="nav-link" data-action="endings">结局图鉴 <span>↗</span></button><span class="nav-divider"></span><button class="sound-button" data-action="sound" aria-pressed="${sound}" aria-label="${sound ? '关闭' : '开启'}选择音效"><span class="sound-bars ${sound ? 'playing' : ''}"><i></i><i></i><i></i><i></i></span><span>音效${sound ? '开' : '关'}</span></button></nav></header>`;
}
function footer() {
  return `<footer class="site-footer"><span>为每一个偷偷心动的你，留一张票。</span><div><button data-action="about">关于这场放映</button><span>·</span><button data-action="privacy">隐私说明</button><span class="footer-en">MADE WITH A LITTLE CRUSH ${heart}</span></div></footer>`;
}
function render({ focus = false } = {}) {
  const views = { home: homeView, setup: setupView, quiz: quizView, result: resultView };
  app.innerHTML = header() + `<main id="main" class="view-${state.screen}">${views[state.screen]()}</main>` + footer();
  document.title = state.screen === 'quiz' ? `${state.current + 1}/10 · 心动放映室` : '心动放映室 — 你的暧昧，放映到哪一幕？';
  if (focus) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = app.querySelector('h1');
    if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
  }
}
function homeView() {
  const saved = loadProgress();
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> 今日放映 · 一部关于你们的电影</div><h1>TA 的心里，<br>有没有你的<br><span class="title-highlight">特别出演<span class="title-star">✳</span></span>？</h1><p class="hero-description">有些喜欢，藏在“顺便”里。<br>把那些反复回想的小事，放进一部暧昧电影。<br>看看你们的故事，走到哪一幕了。</p><div class="hero-actions"><button class="button primary" data-action="start">领取我的电影票 ${arrow}</button>${saved ? `<button class="resume" data-action="resume">继续上次放映 ↗</button>` : ''}</div><div class="hero-meta"><span>◷ 约 3 分钟</span><span>10 个故事片段</span><span>5 种专属结局</span></div></div><div class="hero-visual"><div class="visual-caption"><span>NOW SHOWING</span><span>VOL. 001</span></div><div class="ticket-scene"><div class="scene-top"><span>心动，是一件有迹可循的小事。</span><span class="tiny-star">✦</span></div>${heroArt}<div class="scene-bottom"><span>两位主角，一点点靠近。</span><span>YOU & TA</span></div></div><div class="floating-note note-top"><span>偷偷观察中</span><span>♡</span></div><div class="floating-note note-bottom"><span class="note-heart">${heart}</span><div>这次，你是主角。<small>EVERY LITTLE THING COUNTS</small></div></div><div class="ticket-stub"><span class="stub-side">ADMIT ONE</span><div><span class="stub-label">你的专属心动入场券</span><strong>A STORY ABOUT US</strong></div><div class="barcode" aria-hidden="true"></div><span class="stub-number">NO. 0520</span></div></div></section><section class="preview-strip" aria-label="测试玩法"><div class="strip-heading">接下来的<br><span>心动预告</span>${sparkle}</div><div class="preview-item"><span class="step-number">01</span><div><h2>进入你们的日常</h2><p>聊天、偶遇，还有那句“下次见”</p></div></div><div class="preview-item"><span class="step-number">02</span><div><h2>捕捉那些小信号</h2><p>按真实经历，选择最像的那一幕</p></div></div><div class="preview-item"><span class="step-number">03</span><div><h2>领取专属结局</h2><p>一张剧情卡，一点往前走的勇气</p></div></div></section><p class="gentle-note">${heart} 一场轻松的互动体验。我们解读相处的线索，不替 TA 定义喜欢。</p>`;
}
function setupView() {
  return `<section class="setup-layout"><div class="setup-intro"><div class="eyebrow">PROLOGUE / 序章</div><h1>开场之前，<br>给故事一点背景。</h1><p>不用姓名，也不用聊天记录。<br>只需要带上一个你正在想的人。</p><div class="mini-ticket"><span>本场放映主演</span><strong>你 <i>&</i> TA</strong><span>故事尚未完结 · 请放心入座</span></div></div><div class="setup-card"><div class="section-counter">TAKE 01 <span>导演，请就位。</span></div><h2>你们现在是什么关系？</h2><div class="pill-grid" role="group" aria-label="你们的关系">${relations.map(r => `<button class="context-pill ${state.context.relation === r ? 'selected' : ''}" data-relation="${r}" aria-pressed="${state.context.relation === r}">${r}</button>`).join('')}</div><h2>平时的 TA，更接近哪一种？</h2><div class="style-options" role="group" aria-label="TA平时的风格">${styles.map((s, i) => `<button class="style-choice ${state.context.style === s ? 'selected' : ''}" data-style="${s}" aria-pressed="${state.context.style === s}"><span>${['☀', '☽', '✧'][i]}</span><strong>${s}</strong><small>${['通常会主动打开话题', '需要熟悉后才慢慢靠近', '还在收集关于 TA 的线索'][i]}</small><i>${state.context.style === s ? '✓' : ''}</i></button>`).join('')}</div><p class="setup-tip">小提示：接下来请选真实发生过的情况。<br>还没发生过的，放心选“不确定”。</p><button class="button primary full-width" data-action="begin">灯光暗下，故事开始 ${arrow}</button></div></section>`;
}
function quizView() {
  const scene = scenes[state.current];
  const selected = state.answers[state.current];
  const option = scene.options[selected];
  return `<section class="quiz-layout"><aside class="film-sidebar"><button class="back-link" data-action="back">← ${state.current === 0 ? '返回序章' : '上一幕'}</button><div class="eyebrow">NOW PLAYING</div><h2>你们的故事，<br>正在发生。</h2><div class="chapter-list">${[...new Set(scenes.map(s => s.chapterTitle))].map((c, i) => `<div class="chapter ${Number(scene.chapter) === i + 1 ? 'active' : ''} ${Number(scene.chapter) > i + 1 ? 'complete' : ''}"><span>${Number(scene.chapter) > i + 1 ? '✓' : `0${i + 1}`}</span><div><small>CHAPTER 0${i + 1}</small><strong>${c}</strong></div></div>`).join('')}</div><div class="sidebar-note">${sparkle}<p>别替 TA 加戏，<br>也别忽略真实的温柔。</p></div></aside><div class="story-card"><div class="story-progress"><span>片段 <b>${String(state.current + 1).padStart(2, '0')}</b> / ${scenes.length}</span><span>${escape(scene.chapterTitle)}</span></div><div class="progress-track" role="progressbar" aria-label="故事进度" aria-valuenow="${state.current + 1}" aria-valuemin="0" aria-valuemax="${scenes.length}"><span style="width:${(state.current + 1) * 10}%"></span></div><div class="scene-location"><span class="live-dot"></span>${escape(scene.time)} <span>·</span> ${escape(scene.location)}</div><h1>${escape(scene.title)}</h1><p class="narrative">${escape(scene.narrative)}</p>${scene.message ? `<div class="message-scene"><div class="chat-avatar">TA</div><div><span class="message-author">${escape(scene.message.from)}</span><div class="chat-bubble">${escape(scene.message.text)}</div></div><span class="message-star">✳</span></div>` : ''}<h2 class="question">${escape(scene.prompt)}</h2><div class="answer-list" role="group" aria-label="选择最像你们真实经历的情况">${scene.options.map((o, i) => `<button class="answer ${selected === i ? 'selected' : ''} ${o.signal === null ? 'unknown-answer' : ''}" data-answer="${i}" aria-pressed="${selected === i}"><span class="answer-key">${String.fromCharCode(65 + i)}</span><span class="answer-copy"><strong>${escape(o.label)}</strong>${o.detail ? `<small>${escape(o.detail)}</small>` : ''}</span><span class="answer-check">${selected === i ? '✓' : ''}</span></button>`).join('')}</div><div class="scene-controls"><p class="selection-reaction" role="status">${option ? `${sparkle}<span>${escape(option.reaction || '这一幕，已放进你的电影。')}</span>` : '<span>选择最接近真实情况的一项</span>'}</p><button class="button primary next-button" data-action="next" ${option ? '' : 'disabled'}>${state.current === scenes.length - 1 ? '揭晓我的结局' : '下一幕'} ${arrow}</button></div></div></section>`;
}
function resultView() {
  const result = getResult(state.answers, state.context);
  return `<section class="result-layout"><div class="result-top"><div class="eyebrow">THE END? / 你们的电影，仍在继续</div><h1>故事暂时停在了这一幕。</h1><p>有些答案藏在细节里，有些需要下一次见面。</p></div><div class="result-columns"><div class="result-poster" id="result-poster"><div class="poster-top"><span>心动放映室</span><span>YOUR STORY · 001</span></div><div class="poster-spark">${sparkle}</div><span class="result-kicker">${escape(result.kicker)}</span><h2>${escape(result.title)}</h2><p class="result-subtitle">${escape(result.subtitle)}</p><div class="poster-mini-scene">${heroArt}</div><blockquote>“${escape(result.quote)}”</blockquote><div class="poster-score"><div><small>剧情升温值</small><strong>${result.score === null ? '待续' : `${result.score}<i>/ 100</i>`}</strong></div><span>${escape(result.confidence)}<small>互动信号 ≠ 喜欢的概率</small></span></div><div class="poster-bottom"><span>A LITTLE CRUSH, A LITTLE COURAGE.</span>${heart}</div></div><div class="result-detail"><div class="analysis-block"><span class="block-label">01 / 这一幕，意味着什么</span><h2>${escape(result.description)}</h2><p class="context-note">${escape(result.caution)}</p></div><div class="analysis-block"><span class="block-label">02 / 你的心动线索</span><div class="dimension-list">${result.dimensions.map(d => `<div class="dimension"><div><span>${escape(d.label)}</span><span>${d.value === null ? '待观察' : `${d.value} / 100`}</span></div><div class="dimension-track"><i style="width:${d.value ?? 0}%"></i></div></div>`).join('')}</div><ul class="evidence-list">${result.evidence.map(e => `<li>${escape(e)}</li>`).join('')}</ul></div><div class="next-scene"><span>${sparkle} 写给下一幕的你</span><p>${escape(result.nextStep)}</p></div><div class="result-actions"><button class="button primary" data-action="download">保存结局海报 ↓</button><button class="button secondary" data-action="share">邀请朋友测一测 ↗</button></div><button class="restart-link" data-action="restart">换一位主角，重新放映 ↺</button><p class="result-disclaimer">娱乐性互动体验，非心理测评。尊重对方的表达，也照顾自己的感受。</p></div></div></section>`;
}
function openModal(content, className = '') {
  modal.className = className;
  modal.innerHTML = `<button class="modal-close" data-action="close-modal" aria-label="关闭弹窗">×</button>${content}`;
  modal.showModal();
}
function endings() {
  const cards = Object.values(resultTypes).map((r, i) => [String(i + 1).padStart(2, '0'), r.title, r.subtitle]);
  openModal(`<div class="eyebrow">THE ENDING COLLECTION</div><h2 id="modal-title">每一种结局，都有后续。</h2><p class="modal-intro">你们会拿到哪一张电影票？<br>完成 10 个片段，解锁属于你们的那一幕。</p><div class="ending-grid">${cards.map(c => `<div class="ending-card"><span>ENDING ${c[0]} ${sparkle}</span><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join('')}</div><p class="modal-note">结局是互动线索的整理，不是对 TA 心意的判定。</p>`, 'endings-modal');
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
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1560;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f4f0e5'; ctx.fillRect(0, 0, 1080, 1560);
  ctx.strokeStyle = '#70806b'; ctx.lineWidth = 2; ctx.strokeRect(50, 50, 980, 1460);
  ctx.fillStyle = '#334c3b'; ctx.font = '26px sans-serif'; ctx.fillText('心动放映室 / CRUSH CINEMA', 100, 116);
  ctx.textAlign = 'right'; ctx.font = '20px sans-serif'; ctx.fillText('YOUR STORY · 001', 980, 116); ctx.textAlign = 'left';
  ctx.fillStyle = '#bd6749'; ctx.font = '24px sans-serif'; ctx.fillText(result.kicker, 100, 215);
  ctx.fillStyle = '#294939'; ctx.font = 'bold 64px serif';
  let y = wrapText(ctx, result.title, 100, 302, 880, 86);
  ctx.fillStyle = '#68715e'; ctx.font = '28px sans-serif'; wrapText(ctx, result.subtitle, 100, y + 20, 880, 42);
  const svg = heroArt.replace('class="hero-art"', '').replace('<svg ', '<svg width="520" height="460" ');
  const blobUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image(); img.src = blobUrl; await img.decode();
    ctx.drawImage(img, 205, 450, 670, 593);
  } catch { ctx.fillStyle = '#e4b391'; ctx.beginPath(); ctx.arc(540, 720, 130, 0, Math.PI * 2); ctx.fill(); }
  finally { URL.revokeObjectURL(blobUrl); }
  ctx.textAlign = 'center'; ctx.fillStyle = '#3e5341'; ctx.font = '30px serif';
  wrapText(ctx, `“${result.quote}”`, 540, 1100, 820, 46);
  ctx.textAlign = 'left'; ctx.strokeStyle = '#c5c9b6'; ctx.beginPath(); ctx.moveTo(100, 1220); ctx.lineTo(980, 1220); ctx.stroke();
  ctx.font = '24px sans-serif'; ctx.fillStyle = '#68715e'; ctx.fillText('剧情升温值', 100, 1280);
  ctx.font = 'bold 66px serif'; ctx.fillStyle = '#294939'; ctx.fillText(result.score === null ? '待续' : `${result.score} / 100`, 100, 1365);
  ctx.font = '24px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(result.confidence, 980, 1310);
  ctx.font = '20px sans-serif'; ctx.fillStyle = '#747969'; ctx.fillText('互动信号 ≠ 喜欢的概率', 980, 1355);
  ctx.textAlign = 'center'; ctx.font = '20px sans-serif'; ctx.fillText('一场轻松的互动体验 · 故事的下一幕，留给真实相处', 540, 1455);
  canvas.toBlob(blob => {
    if (!blob) { toast('海报生成失败，请重试'); return; }
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `心动放映室-${result.title}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast('海报已生成；手机浏览器可在下载中保存图片');
  }, 'image/png');
}
function go(screen) { state.screen = screen; save(); render({ focus: true }); }
function handleClick(event) {
  const target = event.target.closest('button'); if (!target) return;
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
    case 'about': openModal(`<div class="eyebrow">ABOUT THIS LITTLE MOVIE</div><h2 id="modal-title">每一份心动，都值得温柔对待。</h2><p class="modal-intro">心动放映室是一场以日常互动为线索的故事测试。10 个片段，会从主动联系、特别关注、时间投入和互动稳定性四个角度，整理你观察到的相处细节。</p><p class="modal-intro">“剧情升温值”是已知互动信号的汇总，不是 TA 喜欢你的概率；关系背景用于提供提醒，不会凭空加分。这不是经过验证的心理量表，也不能代替坦诚的沟通。</p><p class="modal-note">没有标准答案，只有正在发生的故事。</p>`); break;
    case 'privacy': openModal(`<div class="eyebrow">JUST BETWEEN YOU & YOU</div><h2 id="modal-title">你的小心事，留在你这里。</h2><p class="modal-intro">网站不要求登录、姓名或聊天记录，不设置答题数据收集接口，也不使用统计追踪。作答进度仅保存在当前浏览器标签页的会话存储中，关闭标签页后通常会清除；浏览器恢复会话时可能保留。</p><p class="modal-intro">保存海报在你的设备上生成。邀请链接不包含答案。托管服务可能记录常规访问日志，请以其隐私政策为准。</p><button class="button secondary" data-action="clear-progress">清除这次作答并回到首页</button>`); break;
    case 'clear-progress': try { sessionStorage.removeItem(STORAGE_KEY); } catch {} modal.close(); state = defaults(); render({ focus: true }); toast('本次作答已清除'); break;
  }
}
app.addEventListener('click', handleClick);
modal.addEventListener('click', event => {
  if (event.target === modal) {
    const rect = modal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
  } else handleClick(event);
});
// Show the landing page first; resuming a personal session is always explicit.
render();
