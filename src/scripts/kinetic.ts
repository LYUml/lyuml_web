export {};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const requestedReduction=new URLSearchParams(location.search).get('motion')==='reduce';
const motionReduced=()=>reduced.matches||requestedReduction;
const applyMotionPreference=()=>{document.body.classList.toggle('is-reduced-motion',motionReduced());document.documentElement.dataset.kineticMotion=motionReduced()?'reduce':'full';};
applyMotionPreference();reduced.addEventListener('change',applyMotionPreference);
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const curve='cubic-bezier(.22,1,.36,1)';
const animations=new Set<Animation>();
function finite(el:Element,frames:Keyframe[],duration=700,delay=0){
 if(motionReduced())return;
 const a=el.animate(frames,{duration,delay,easing:curve,fill:'both'});animations.add(a);
 a.finished.then(()=>{a.cancel();animations.delete(a);}).catch(()=>animations.delete(a));return a;
}
const heading=document.querySelector<HTMLElement>('.hero h1');
if(heading){
 const band=heading.parentElement!;const measuring=document.createElement('canvas').getContext('2d')!;
 const fit=()=>{measuring.font='400 100px Anton';const text=heading.textContent!.toUpperCase();const units=(measuring.measureText(text).width-(text.length-1)*2.5)/100;heading.style.fontSize=`${Math.min(340,(band.clientWidth-32)/units)}px`;};
 const sizing=new ResizeObserver(fit);sizing.observe(band);document.fonts.load('100px Anton').then(fit);fit();
 if(!location.hash||location.hash==='#home'){
  finite(heading,[{transform:'translateY(110%) skewY(3deg)'},{transform:'translateY(0) skewY(0)'}],1050,80);
  document.querySelectorAll('.hero-introduction>div,.hero-bottom,.field-caption,.hero-domains').forEach((el,i)=>finite(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],750,200+i*75));
 }
}
const stage=document.querySelector<HTMLElement>('.line-field');
if(stage){
 const canvas=stage.querySelector<HTMLCanvasElement>('canvas')!,context=canvas.getContext('2d');
 if(context){
  let width=0,height=0,visible=true,frame=0,last=0,time=0,px=0,py=0,targetX=0,targetY=0,strength=0,targetStrength=0;
  let bounds:DOMRect;
  const draw=()=>{
   context.clearRect(0,0,width,height);context.strokeStyle='#f1eedc';context.lineWidth=.8;context.globalAlpha=.86;
   const lines=width<600?43:89,steps=height<300?66:90;
   for(let i=0;i<lines;i++){
    const nx=(i+.5)/lines,x=nx*width;
    context.beginPath();
    for(let j=0;j<=steps;j++){
     const ny=j/steps,y=ny*height;
     const envelope=Math.pow(Math.sin(ny*Math.PI),2)*Math.sin(nx*Math.PI);
     const bend=Math.sin(ny*Math.PI*2+nx*5.2+time*.16)*Math.min(width*.085,125)*envelope;
     const dx=x-px,dy=y-py,r=Math.min(width*.2,220);
     const pull=Math.exp(-(dx*dx+dy*dy)/(r*r))*strength*(dx>=0?1:-1)*Math.sin(ny*Math.PI)*54;
     const xx=x+bend+pull;
     if(j===0)context.moveTo(xx,y);else context.lineTo(xx,y);
    }
    context.stroke();
   }
   canvas.dataset.frameTime=time.toFixed(2);
  };
  const active=()=>visible&&!document.hidden&&!motionReduced();
  const tick=(now:number)=>{frame=0;if(!active())return;if(now-last>=(width<600?60:32)){time+=Math.min((now-last)/1000,.1);last=now;px+=(targetX-px)*.12;py+=(targetY-py)*.12;strength+=(targetStrength-strength)*.08;draw();}frame=requestAnimationFrame(tick);};
  const sync=()=>{cancelAnimationFrame(frame);frame=0;if(active()){last=performance.now();frame=requestAnimationFrame(tick);canvas.dataset.state='running';}else{canvas.dataset.state='paused';if(width)draw();}};
  const size=()=>{const box=stage.getBoundingClientRect();bounds=box;width=box.width;height=box.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);draw();stage.classList.add('is-ready');sync();};
  new ResizeObserver(size).observe(stage);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0}).observe(stage);
  stage.addEventListener('pointerenter',()=>{bounds=stage.getBoundingClientRect();});
  stage.addEventListener('pointermove',event=>{if(motionReduced()||!fine.matches)return;targetX=event.clientX-bounds.left;targetY=event.clientY-bounds.top;targetStrength=1;canvas.dataset.pointerActive='true';});
  stage.addEventListener('pointerleave',()=>{targetStrength=0;canvas.dataset.pointerActive='false';});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
 }
}
// Word-level clipping is limited to large display headings, never paragraph text.
const entrances=new WeakMap<Element,()=>void>();
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);entrances.get(entry.target)?.();entrances.delete(entry.target);}},{threshold:.14,rootMargin:'0px 0px -4% 0px'});
function once(el:Element,run:()=>void){entrances.set(el,run);observer.observe(el);}
document.querySelectorAll('.section-heading h2,.skills-heading h3,.contact-section h2').forEach(title=>{
 const name=Array.from(title.childNodes).map(node=>node.nodeName==='BR'?' ':node.textContent).join('').replace(/\s+/g,' ').trim();title.setAttribute('aria-label',name);
 for(const node of Array.from(title.childNodes)){
  if(node.nodeType!==Node.TEXT_NODE)continue;
  const fragment=document.createDocumentFragment();
  (node.textContent??'').split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const clip=document.createElement('span');clip.className='heading-clip';clip.setAttribute('aria-hidden','true');const inside=document.createElement('span');inside.textContent=word;clip.append(inside);fragment.append(clip);});node.replaceWith(fragment);
 }
 once(title,()=>title.querySelectorAll('.heading-clip>span').forEach((word,i)=>finite(word,[{transform:'translateY(105%) rotate(2deg)'},{transform:'translateY(0) rotate(0)'}],800,i*55)));
});
document.querySelectorAll<HTMLDetailsElement>('.experience').forEach(details=>{
 details.addEventListener('toggle',()=>{if(!details.open)return;details.querySelectorAll('.work-category,h3,.supervisor,li,.experience-story p,.tags').forEach((el,i)=>finite(el,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],450,i*30));});
});
document.querySelectorAll('.award,.skill-group').forEach(el=>once(el,()=>finite(el,[{opacity:.2,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],650)));
const statement=document.querySelector('.statement');if(statement)once(statement,()=>statement.querySelectorAll('.reveal-word').forEach((el,i)=>finite(el,[{opacity:.15},{opacity:1}],650,i*70)));
// Local illustration loops are independently stopped when hidden or off screen.
type LoopGroup={animations:Animation[];visible:boolean};const groups=new Map<Element,LoopGroup>();
const loopsObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{const group=groups.get(entry.target);if(group)group.visible=entry.isIntersecting;});syncLoops();},{threshold:.05});
function loop(groupEl:Element,el:Element,keyframes:Keyframe[],duration:number,delay=0,easing='ease-in-out'){
 const a=el.animate(keyframes,{duration,delay,easing,iterations:Infinity});a.pause();
 let group=groups.get(groupEl);if(!group){group={animations:[],visible:false};groups.set(groupEl,group);loopsObserver.observe(groupEl);}group.animations.push(a);
}
function syncLoops(){groups.forEach(group=>group.animations.forEach(a=>{if(group.visible&&!document.hidden&&!motionReduced())a.play();else{a.pause();if(motionReduced())a.currentTime=0;}}));}
const spatial=document.querySelector('.study-spatial');if(spatial){const upper=spatial.querySelector('.model-upper');if(upper)loop(spatial,upper,[{transform:'translateY(0)'},{transform:'translateY(-10px)'},{transform:'translateY(0)'}],6500);spatial.querySelectorAll('.sensor-points circle').forEach((el,i)=>loop(spatial,el,[{opacity:.25},{opacity:1},{opacity:.25}],2400,i*230));}
const airflow=document.querySelector('.study-airflow');if(airflow){airflow.querySelectorAll<SVGPathElement>('.airflow-streams path').forEach((el,i)=>{el.style.strokeDasharray='12 9';loop(airflow,el,[{strokeDashoffset:'0'},{strokeDashoffset:'-126'}],7000,i*90,'linear');});}
const music=document.querySelector('.instrument-drawing');if(music){music.querySelectorAll('.sound-lines path').forEach((el,i)=>loop(music,el,[{transform:'scaleY(.4)',opacity:.45},{transform:'scaleY(1)',opacity:1},{transform:'scaleY(.4)',opacity:.45}],1000+i%7*170,i*33));}
const sport=document.querySelector('.sport-art'),route=sport?.querySelector<SVGPathElement>('.runner-route'),runner=sport?.querySelector('.runner-dot');
if(sport&&route&&runner){const length=route.getTotalLength();const frames=Array.from({length:97},(_,i)=>{const p=route.getPointAtLength(length*i/96);return {transform:`translate(${p.x}px,${p.y}px)`,offset:i/96};});loop(sport,runner,frames,8500,0,'linear');}
reduced.addEventListener('change',()=>{animations.forEach(a=>a.cancel());animations.clear();syncLoops();});document.addEventListener('visibilitychange',syncLoops);
