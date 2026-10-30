/** Native motion choreography, with no scroll polling or animation dependency. */
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const mobile = matchMedia('(max-width: 760px)');
const curve = 'cubic-bezier(0.22, 1, 0.36, 1)';
const finite = new Set<Animation>();
const enabled = () => !reduced.matches;
function animate(el: Element, frames: Keyframe[], duration = 700, delay = 0) {
  if (!enabled()) return;
  const animation = el.animate(frames, {duration, delay, easing: curve, fill: 'both'});
  finite.add(animation);
  animation.finished.then(() => { animation.cancel(); finite.delete(animation); }).catch(() => finite.delete(animation));
  return animation;
}
function enter(el: Element, delay = 0, direction: 'up' | 'left' | 'right' = 'up', duration = 700) {
  const offset = mobile.matches ? 16 : 32;
  const from = direction === 'up' ? `translateY(${offset}px)` : `translateX(${direction === 'left' ? -offset : offset}px)`;
  return animate(el, [{opacity: 0, transform: from}, {opacity: 1, transform: 'translate(0,0)'}], duration, delay);
}
const entrances = new WeakMap<Element, () => void>();
const entranceObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entranceObserver.unobserve(entry.target);
    entrances.get(entry.target)?.(); entrances.delete(entry.target);
  });
}, {threshold: .12, rootMargin: '0px 0px -6% 0px'});
function once(el: Element | null, run: () => void) {
  if (!el) return;
  entrances.set(el, run); entranceObserver.observe(el);
}
const heroPresent = (document.querySelector('#home')?.getBoundingClientRect().bottom ?? 0) > 100;
if (heroPresent) {
  const beat = mobile.matches ? 60 : 90;
  document.querySelectorAll('.name-line>span').forEach((el,i) => {
    animate(el, [{transform:'translateY(108%) rotate(3deg)', opacity:0}, {transform:'translateY(0) rotate(0)', opacity:1}], 1150, 100 + i * 120);
  });
  document.querySelectorAll('.hero-copy>.intro,.hero-copy>.name-note,.hero-copy>h2,.interest-lead,.interest-fields>span,.hero-description,.hero-domains>span,.hero-copy>.button').forEach((el,i) => enter(el, 100 + i * beat, 'up', 850));
  animate(document.querySelector('.spatial-scene')!, [{opacity:0}, {opacity:1}], 1500, 100);
  enter(document.querySelector('.site-header')!, 350, 'up', 900);
}
function splitHeading(heading: Element) {
  const label = Array.from(heading.childNodes).map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('').replace(/\s+/g,' ').trim();
  heading.setAttribute('aria-label', label);
  for (const node of Array.from(heading.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const fragment = document.createDocumentFragment();
    (node.textContent ?? '').split(/(\s+)/).forEach(word => {
      if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
      const clip = document.createElement('span'); clip.className = 'word-clip'; clip.setAttribute('aria-hidden','true');
      const inner = document.createElement('span'); inner.textContent = word; clip.append(inner); fragment.append(clip);
    });
    node.replaceWith(fragment);
  }
}
document.querySelectorAll('.section-heading h2,.contact-section h2').forEach(heading => {
  splitHeading(heading);
  once(heading, () => heading.querySelectorAll('.word-clip>span').forEach((word,i) => {
    animate(word, [{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}], 850, i * (mobile.matches ? 35 : 55));
  }));
});
document.querySelectorAll('.section-heading .eyebrow,.section-description,.contact-section>.eyebrow').forEach(el => once(el, () => enter(el, 0, 'up', 800)));
document.querySelectorAll<HTMLDetailsElement>('.experience').forEach(details => {
  once(details, () => {
    details.classList.add('motion-entered');
    const summary = details.querySelector('summary'); if (summary) enter(summary, 0, 'left');
    animate(details.querySelector('.org-mark')!, [{opacity:0,transform:'scale(.6) rotate(-18deg)'},{opacity:1,transform:'scale(1) rotate(0)'}], 900, 80);
  });
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    details.querySelectorAll('.experience-body>.work-category,.experience-body>h3,.supervisor,.experience-body li,.experience-story p,.experience-body .tags').forEach((el,i) => enter(el, i * 45, 'up', 550));
  });
});
const statement = document.querySelector('.statement');
statement?.querySelectorAll('.reveal-word').forEach(word => word.classList.add('motion-word'));
once(statement, () => {
  statement?.querySelectorAll('.reveal-word').forEach((word,i) => {
    animate(word,[{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], 800, i * 75);
    word.classList.add('is-visible');
  });
});
document.querySelectorAll('.exploration-card').forEach((card,i) => once(card, () => {
  const visual = card.querySelector('.work-visual');
  if (visual) animate(visual,[{opacity:0,transform:`translateY(48px) rotate(${i ? 2 : -2}deg) scale(.96)`},{opacity:1,transform:'translateY(0) rotate(0) scale(1)'}],1000);
  card.querySelectorAll('.work-copy>*').forEach((el,j) => enter(el, 150+j*70,'up',800));
}));
once(document.querySelector('.education'), () => enter(document.querySelector('.education')!,0,'left',950));
document.querySelectorAll('.award').forEach((award,i) => once(award, () => enter(award,(i%3)*60,'right',700)));
document.querySelectorAll('.skill-group').forEach(group => once(group, () => {
  group.classList.add('motion-entered'); group.querySelectorAll('h4,span,.skill-note').forEach((el,i) => enter(el,i*50,'left',650));
}));
document.querySelectorAll('.life-card').forEach((card,i) => once(card, () => {
  card.querySelectorAll('h3,p,.tags').forEach((el,j) => enter(el,j*90,i?'right':'left',850));
}));
once(document.querySelector('.email-link'), () => enter(document.querySelector('.email-link')!,100,'up',850));

type LoopGroup = {animations: Animation[]; visible: boolean};
const groups = new Map<Element,LoopGroup>();
const loopObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const group = groups.get(entry.target); if (group) {group.visible=entry.isIntersecting; syncLoops();}
}),{threshold:.05});
function loop(groupEl: Element, el: Element, frames: Keyframe[], duration: number, delay=0, easing=curve) {
  const animation=el.animate(frames,{duration,delay,iterations:Infinity,easing}); animation.pause();
  let group=groups.get(groupEl);
  if(!group){group={animations:[],visible:false};groups.set(groupEl,group);loopObserver.observe(groupEl);}
  group.animations.push(animation);
}
function syncLoops() {
  for(const group of groups.values()) for(const animation of group.animations) {
    if(enabled() && group.visible && !document.hidden) animation.play();
    else {animation.pause();if(reduced.matches)animation.currentTime=0;}
  }
}
const room = document.querySelector('.room');
if(room) {
  loop(room,room,[{transform:'rotateX(58deg) rotateZ(-35deg) translateZ(0px)'},{transform:'rotateX(58deg) rotateZ(-32deg) translateZ(10px)'},{transform:'rotateX(58deg) rotateZ(-35deg) translateZ(0px)'}],7500);
  const ring=room.querySelector('.room-sensor span'); if(ring)loop(room,ring,[{opacity:.65,transform:'scale(.6)'},{opacity:0,transform:'scale(1.8)'}],2800);
}
const airflow=document.querySelector('.airflow-visual');
airflow?.querySelectorAll<SVGPathElement>('.air-paths path').forEach((path,i)=>{
  path.style.strokeDasharray='18 12'; loop(airflow,path,[{strokeDashoffset:'0'},{strokeDashoffset:'-120'}],5000,i*160,'linear');
});
const music=document.querySelector('.music-art');
music?.querySelectorAll('span').forEach((bar,i)=>{
  const low=.3+(i%4)*.09; loop(music,bar,[{transform:`scaleY(${low})`,opacity:.45},{transform:'scaleY(1)',opacity:.95},{transform:`scaleY(${low})`,opacity:.45}],1100+(i%7)*160,i*45);
});
const track=document.querySelector('.sport-art');
const route=track?.querySelector<SVGPathElement>('.runner-route');
const runner=track?.querySelector('.runner-dot');
if(track && route && runner){
  const length=route.getTotalLength();
  const frames=Array.from({length:97},(_,i)=>{const point=route.getPointAtLength(length*i/96);return {transform:`translate(${point.x}px,${point.y}px)`,offset:i/96};});
  loop(track,runner,frames,8500,0,'linear');
}
const pointerResets: (()=>void)[]=[];
document.querySelectorAll<HTMLElement>('.work-visual,.hero-copy>.button').forEach(el=>{
  let rect:DOMRect|undefined, frame=0, x=0, y=0;
  const magnetic=el.matches('.button');
  const reset=()=>{cancelAnimationFrame(frame);frame=0;el.style.transform='';}; pointerResets.push(reset);
  el.addEventListener('pointerenter',()=>{if(enabled()&&fine.matches)rect=el.getBoundingClientRect();});
  el.addEventListener('pointermove',event=>{
    if(!enabled()||!fine.matches||!rect)return;
    x=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5)); y=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));
    if(frame)return;
    frame=requestAnimationFrame(()=>{frame=0;el.style.transform=magnetic?`translate(${x*10}px,${y*8}px)`:`perspective(1000px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-4px)`;});
  });
  el.addEventListener('pointerleave',reset); el.addEventListener('focusout',reset);
});
const nav=document.querySelector<HTMLElement>('#nav-links');
const indicator=document.createElement('span'); indicator.className='nav-indicator';indicator.setAttribute('aria-hidden','true');nav?.prepend(indicator);
let navFrame=0;
function updateIndicator(){
  if(!nav || mobile.matches)return;
  const active=nav.querySelector<HTMLAnchorElement>('a.active'); if(!active){indicator.style.opacity='0';return;}
  const rect=active.getBoundingClientRect(),parent=nav.getBoundingClientRect(),old=indicator.getBoundingClientRect();
  const x=rect.left-parent.left-12,w=rect.width+24;
  indicator.style.width=`${w}px`;indicator.style.left=`${x}px`;indicator.style.opacity='1';
  if(old.width && enabled())animate(indicator,[{transform:`translateX(${old.left-(parent.left+x)}px) scaleX(${old.width/w})`},{transform:'translateX(0) scaleX(1)'}],450);
}
document.addEventListener('navigation-active',()=>{cancelAnimationFrame(navFrame);navFrame=requestAnimationFrame(updateIndicator);});
if(nav)new ResizeObserver(()=>{cancelAnimationFrame(navFrame);navFrame=requestAnimationFrame(updateIndicator);}).observe(nav);
function syncState(){
  root.dataset.motion=enabled()?'running':'paused';
  if(!enabled()){for(const animation of finite)animation.cancel();finite.clear();pointerResets.forEach(reset=>reset());}
  airflow?.querySelectorAll<SVGPathElement>('.air-paths path').forEach(path=>path.style.strokeDasharray=reduced.matches?'none':'18 12');
  syncLoops();document.dispatchEvent(new CustomEvent('motion-preference',{detail:{paused:!enabled()}}));
}
reduced.addEventListener('change',syncState);
fine.addEventListener('change',()=>pointerResets.forEach(reset=>reset()));
document.addEventListener('visibilitychange',syncLoops);
syncState();
