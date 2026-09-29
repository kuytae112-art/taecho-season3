const TOTAL = 47;

const slides = [
  '시즌 3 출정 준비','첫 주의 전쟁 일정','관문 공성과 격문 운영 시간','격문 점령과 공성 루트',
  '공성 부대의 투입 순서','중앙 20 레벨 성지의 쟁탈과 보상','직업 스킬 : 6개를 비교해 4개 선택',
  '동맹의 직업별 권장 인원','병참 : 선택 스킬 6개 전체','병참 : 공격 · 수비 스킬 조합',
  '청낭 : 선택 스킬 6개 전체','청낭 : 공격 · 수비 스킬 조합','천공 : 선택 스킬 6개 전체',
  '천공 : 공격 · 수비 스킬 조합','진군 : 선택 스킬 6개 전체','진군 : 공격 · 수비 스킬 조합',
  '기좌 : 선택 스킬 6개 전체','기좌 : 공격 · 수비 스킬 조합','신행 : 선택 스킬 6개 전체',
  '신행 : 공격 · 수비 스킬 조합','동맹 관문 : 동맹 요충지','산길 건설 전후',
  '중립 성채 : 자체 보급을 갖춘 거점','개척 초반 : 체력 절약과 5·6토','7·8토 : 좌채녕과 좌전녕의 조건',
  '9토 이상 : 전설 장비와 병력 준비','연의 시스템 : 사건에서 무장 강화','연의 무장 선택 : 세 조에서 각각 1명',
  '연의 사건 10개와 주요 보상','연의 전용 병법의 조건과 효과','연의 무장별 두 가지 방향 1/2',
  '연의 무장별 두 가지 방향 2/2','연의와 백전 병부를 덱에 적용','연의 전법 보상 : 투영과 반대',
  '백전 병부 : 획득과 병종 추가 조건','공식 추천 전쟁덱 6종','원소 · 손권 · 육손',
  '마운록 · 공손찬 · 마등','강유 · SP 제갈량 · 유비','좌자 · 공손찬 · 관우',
  '조인 · 조조 · 사마의','하후연 · 장료 · 마등','공존 부대의 장수 · 연의 · 전법 확인',
  '초반 4일의 행동과 목표','오곡풍양 · 상점 · 닭다리 관리','시즌 결산 : 목표와 보상 자격',
  '출정 전 최종 확인'
];

const sections = [
  {n:'01', name:'전쟁 타이밍', start:2, end:2},
  {n:'02', name:'관문 타이밍', start:3, end:3},
  {n:'03', name:'공성 루트', start:4, end:6},
  {n:'04', name:'직업 스킬트리', start:7, end:20},
  {n:'05', name:'동맹 관문', start:21, end:21},
  {n:'06', name:'산길', start:22, end:22},
  {n:'07', name:'중립 성채', start:23, end:23},
  {n:'08', name:'개척덱', start:24, end:35},
  {n:'09', name:'전쟁덱', start:36, end:43},
  {n:'10', name:'개척 가이드', start:44, end:47}
];

let page = 1;
let touchX = null;
let zoomScale = 1;
let zoomX = 0, zoomY = 0;
let dragStartX = 0, dragStartY = 0, startZoomX = 0, startZoomY = 0;
let dragging = false;

const img = document.getElementById('slideImage');
const current = document.getElementById('current');
const progress = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const sectionName = document.getElementById('sectionName');
const slideTitle = document.getElementById('slideTitle');
const nav = document.getElementById('nav');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

const zoomModal = document.getElementById('zoomModal');
const zoomImage = document.getElementById('zoomImage');
const zoomCurrent = document.getElementById('zoomCurrent');
const zoomStage = document.getElementById('zoomStage');

function pad(n){ return String(n).padStart(2,'0'); }
function sectionFor(p){ return sections.find(s => p >= s.start && p <= s.end); }

function buildNav(){
  nav.innerHTML = '';

  const all = document.createElement('button');
  all.className = 'nav-item';
  all.dataset.start = '1';
  all.innerHTML = '<span class="nav-num">⌂</span><span>전체 가이드</span><span class="nav-range">1–47</span>';
  all.onclick = () => { go(1); closeMenu(); };
  nav.appendChild(all);

  sections.forEach(s => {
    const b = document.createElement('button');
    b.className = 'nav-item';
    b.dataset.start = s.start;
    b.innerHTML = `<span class="nav-num">${s.n}</span><span>${s.name}</span><span class="nav-range">${s.start}–${s.end}</span>`;
    b.onclick = () => { go(s.start); closeMenu(); };
    nav.appendChild(b);
  });
}

function updateNav(){
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const s = sectionFor(page);
  if(s){
    const active = [...document.querySelectorAll('.nav-item')].find(el => Number(el.dataset.start) === s.start);
    if(active) active.classList.add('active');
  } else if(page === 1){
    const first = document.querySelector('.nav-item');
    if(first) first.classList.add('active');
  }
}

function go(p, smooth=true){
  page = Math.max(1, Math.min(TOTAL, p));
  img.src = `slides/slide-${pad(page)}.jpg`;
  img.alt = `${page} / ${TOTAL} ${slides[page-1]}`;
  current.textContent = page;
  progressLabel.textContent = `${page} / ${TOTAL}`;
  progress.style.width = `${page / TOTAL * 100}%`;

  const s = sectionFor(page);
  sectionName.textContent = s ? `${s.n} ${s.name}` : '전체 가이드';
  slideTitle.textContent = slides[page-1] || '';
  document.title = `${slides[page-1] || '태초 시즌 3'} · 태초 시즌 3`;

  document.getElementById('prevBtn').disabled = page === 1;
  document.getElementById('nextBtn').disabled = page === TOTAL;
  updateNav();

  if(smooth) window.scrollTo({top:0, behavior:'smooth'});
}

function next(){ go(page + 1); }
function prev(){ go(page - 1); }

function openMenu(){
  sidebar.classList.add('open');
  scrim.classList.add('open');
}
function closeMenu(){
  sidebar.classList.remove('open');
  scrim.classList.remove('open');
}

function openZoom(){
  zoomModal.classList.add('open');
  zoomModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  syncZoomImage();
}
function closeZoom(){
  zoomModal.classList.remove('open');
  zoomModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function syncZoomImage(){
  zoomImage.src = `slides/slide-${pad(page)}.jpg`;
  zoomImage.alt = `${page} / ${TOTAL} ${slides[page-1]}`;
  zoomCurrent.textContent = page;
  resetZoom();
}
function resetZoom(){
  zoomScale = 1;
  zoomX = 0; zoomY = 0;
  applyZoom();
}
function applyZoom(){
  zoomImage.style.transform = `translate(${zoomX}px, ${zoomY}px) scale(${zoomScale})`;
}
function zoomBy(delta){
  zoomScale = Math.max(1, Math.min(4, zoomScale + delta));
  if(zoomScale === 1){ zoomX = 0; zoomY = 0; }
  applyZoom();
}

document.getElementById('prevBtn').onclick = prev;
document.getElementById('nextBtn').onclick = next;
document.getElementById('prevBottom').onclick = prev;
document.getElementById('nextBottom').onclick = next;
document.getElementById('mobilePrev').onclick = prev;
document.getElementById('mobileNext').onclick = next;
document.getElementById('mobileContents').onclick = openMenu;
document.getElementById('menuBtn').onclick = openMenu;
scrim.onclick = closeMenu;

document.getElementById('firstBtn').onclick = () => { go(1); closeMenu(); };
document.getElementById('fullscreenBtn').onclick = () => document.documentElement.requestFullscreen?.();
document.getElementById('mobileZoomBtn').onclick = openZoom;

document.getElementById('slideWrap').onclick = (e) => {
  if(window.innerWidth <= 900 || e.target === img) openZoom();
};

document.getElementById('zoomClose').onclick = closeZoom;
document.getElementById('zoomFit').onclick = resetZoom;
document.getElementById('zoomPrev').onclick = () => { prev(); syncZoomImage(); };
document.getElementById('zoomNext').onclick = () => { next(); syncZoomImage(); };

document.addEventListener('keydown', e => {
  if(zoomModal.classList.contains('open')){
    if(e.key === 'Escape') closeZoom();
    if(e.key === 'ArrowRight'){ next(); syncZoomImage(); }
    if(e.key === 'ArrowLeft'){ prev(); syncZoomImage(); }
    if(e.key === '+' || e.key === '='){ e.preventDefault(); zoomBy(.25); }
    if(e.key === '-'){ e.preventDefault(); zoomBy(-.25); }
    return;
  }
  if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); next(); }
  if(['ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); prev(); }
  if(e.key === 'Home'){ e.preventDefault(); go(1); }
  if(e.key === 'End'){ e.preventDefault(); go(TOTAL); }
  if(e.key === 'Escape') closeMenu();
});

document.addEventListener('touchstart', e => {
  touchX = e.changedTouches[0].clientX;
}, {passive:true});

document.addEventListener('touchend', e => {
  if(touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if(Math.abs(dx) > 55 && !zoomModal.classList.contains('open')){
    dx < 0 ? next() : prev();
  }
  touchX = null;
}, {passive:true});

/* 확대 화면: 핀치 줌 + 드래그 */
let lastDistance = null;
zoomStage.addEventListener('touchmove', e => {
  if(e.touches.length === 2){
    e.preventDefault();
    const a = e.touches[0], b = e.touches[1];
    const dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    if(lastDistance !== null){
      zoomScale = Math.max(1, Math.min(4, zoomScale * (dist / lastDistance)));
      applyZoom();
    }
    lastDistance = dist;
  }
}, {passive:false});

zoomStage.addEventListener('touchend', () => { lastDistance = null; }, {passive:true});

zoomImage.addEventListener('wheel', e => {
  e.preventDefault();
  zoomBy(e.deltaY > 0 ? -.2 : .2);
}, {passive:false});

zoomImage.addEventListener('pointerdown', e => {
  if(zoomScale <= 1) return;
  dragging = true;
  zoomImage.classList.add('dragging');
  dragStartX = e.clientX; dragStartY = e.clientY;
  startZoomX = zoomX; startZoomY = zoomY;
  zoomImage.setPointerCapture(e.pointerId);
});
zoomImage.addEventListener('pointermove', e => {
  if(!dragging) return;
  zoomX = startZoomX + (e.clientX - dragStartX);
  zoomY = startZoomY + (e.clientY - dragStartY);
  applyZoom();
});
zoomImage.addEventListener('pointerup', () => {
  dragging = false;
  zoomImage.classList.remove('dragging');
});

buildNav();
go(1, false);
