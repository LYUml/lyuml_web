import {demoSensors,roomProjection} from '../data/demo-sensors';
import {openingNames,openingTour,ventilation,type Opening,type Openings} from '../lib/airflow';

const reduction=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=()=>reduction.matches||new URLSearchParams(location.search).get('motion')==='reduce';
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');

// No background interval: each tour owns one cancellable timeout, only while visible.
function idleTour(root:HTMLElement,step:()=>void,playback:(motion:boolean)=>void,interval=4000){
 let visible=false,hover=false,until=0,timer:ReturnType<typeof setTimeout>|undefined;
 const refresh=()=>{
  clearTimeout(timer);
  const motion=visible&&!document.hidden&&!reduced();
  const focused=root.contains(document.activeElement)&&!!document.activeElement?.matches(':focus-visible');
  const automatic=motion&&!hover&&!focused&&performance.now()>=until;
  root.dataset.tour=automatic?'playing':'paused';root.dataset.motion=motion?'on':'off';
  root.querySelectorAll<HTMLElement>('.demo-mode').forEach(el=>el.textContent=automatic?'Auto tour':'Your turn');
  playback(motion);
  if(automatic)timer=setTimeout(()=>{step();refresh();},interval);
  else if(motion&&!hover&&!focused&&until>performance.now())timer=setTimeout(refresh,until-performance.now()+30);
 };
 const manual=()=>{until=performance.now()+9000;refresh();};
 const observation=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;refresh();},{threshold:.12});observation.observe(root);
 root.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&finePointer.matches){hover=true;refresh();}});
 root.addEventListener('pointerleave',()=>{hover=false;until=0;refresh();});
 root.addEventListener('focusin',()=>queueMicrotask(refresh));
 root.addEventListener('focusout',()=>queueMicrotask(refresh));
 root.addEventListener('click',manual);
 reduction.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 window.addEventListener('pagehide',()=>{clearTimeout(timer);observation.disconnect();playback(false);},{once:true});
 return {manual,refresh};
}

const sensorDemo=document.querySelector<HTMLElement>('[data-sensor-demo]');
if(sensorDemo){
 const stage=sensorDemo.querySelector<HTMLElement>('[data-sensor-stage]')!;
 const info=sensorDemo.querySelector<HTMLElement>('[data-sensor-info]')!;
 const buttons=Array.from(sensorDemo.querySelectorAll<HTMLButtonElement>('[data-sensor]'));
 let current=-1,bounds:DOMRect|undefined,cardAnimation:Animation|undefined;
 const positions=demoSensors.map(s=>roomProjection(...s.position as [number,number,number]));
 const place=()=>{
  if(current<0)return;
  const width=stage.clientWidth,height=stage.clientHeight;
  const [x,y]=positions[current].map((v,i)=>v*(i===0?width/440:height/310));
  const left=x+26+220<width?x+26:x-246;
  info.style.left=`${Math.max(8,Math.min(left,width-228))}px`;
  info.style.top=`${Math.max(8,Math.min(y-65,height-218))}px`;
 };
 const select=(index:number,force=false)=>{
  if(index===current&&!force)return;
  current=index;const sensor=demoSensors[index];
  info.hidden=false;
  sensorDemo.dataset.activeSensor=sensor.id;
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sensor===sensor.id)));
  sensorDemo.querySelectorAll<SVGGElement>('[data-sensor-marker]').forEach(el=>el.classList.toggle('is-selected',el.dataset.sensorMarker===sensor.id));
  const fields:Record<string,string>={name:sensor.label,value:sensor.value,unit:sensor.unit,detail:sensor.detail,status:sensor.status};
  Object.entries(fields).forEach(([key,value])=>{info.querySelector(`[data-sensor-${key}]`)!.textContent=value;});
  const min=Math.min(...sensor.trend),max=Math.max(...sensor.trend),range=max-min||1;
  const path=sensor.trend.map((v,i)=>`${i?'L':'M'}${i*20} ${max===min?18:30-(v-min)/range*24}`).join('');
  info.querySelector('[data-sensor-trend]')!.setAttribute('d',path);
  place();cardAnimation?.cancel();
  if(!reduced())cardAnimation=info.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
 };
 const tour=idleTour(sensorDemo,()=>select((current+1)%demoSensors.length),()=>{});
 const measure=()=>{bounds=undefined;place();};new ResizeObserver(measure).observe(stage);
 stage.addEventListener('pointerenter',()=>{bounds=stage.getBoundingClientRect();});
 window.addEventListener('scroll',()=>{bounds=undefined;},{passive:true});
 stage.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!finePointer.matches)return;
  bounds??=stage.getBoundingClientRect();
  const x=(event.clientX-bounds.left)/bounds.width*440,y=(event.clientY-bounds.top)/bounds.height*310;
  let nearest=0,distance=Infinity;
  positions.forEach(([sx,sy],i)=>{const d=Math.hypot(x-sx,y-sy);if(d<distance){distance=d;nearest=i;}});
  if(current>=0&&nearest!==current){const [sx,sy]=positions[current];if(Math.hypot(x-sx,y-sy)-distance<7)return;}
  select(nearest);
 });
 buttons.forEach((button,i)=>{
  button.addEventListener('click',()=>{tour.manual();select(i,true);});
  button.addEventListener('focus',()=>select(i,true));
  button.addEventListener('keydown',event=>{
   const direction=event.key==='ArrowRight'||event.key==='ArrowDown'?1:event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:0;
   if(direction){event.preventDefault();buttons[(i+direction+buttons.length)%buttons.length].focus();}
  });
 });
 sensorDemo.addEventListener('keydown',event=>{if(event.key==='Escape'){info.hidden=true;cardAnimation?.cancel();}});
 reduction.addEventListener('change',()=>cardAnimation?.cancel());
 select(0);tour.refresh();
}

const airflow=document.querySelector<HTMLElement>('[data-airflow-demo]');
if(airflow){
 let state:Openings={west:true,doorA:true,doorB:true,east:true},tourIndex=4;
 const paths=Array.from(airflow.querySelectorAll<SVGPathElement>('[data-flow-path]'));
 const animations=paths.map((path,i)=>{
  path.style.strokeDasharray='7 10';
  const animation=path.animate([{strokeDashoffset:'0'},{strokeDashoffset:'-170'}],{duration:7000+i%4*450,iterations:Infinity,easing:'linear'});animation.pause();return animation;
 });
 const update=()=>{
  const flow=ventilation(state);
  airflow.dataset.openings=JSON.stringify(state);airflow.dataset.flow=flow.cross?'cross':flow.zones.some(Boolean)?'partial':'sealed';
  airflow.querySelector('[data-flow-label]')!.textContent=flow.label;
  (Object.keys(openingNames) as Opening[]).forEach(key=>{
   const button=airflow.querySelector<HTMLButtonElement>(`[data-opening="${key}"]`)!;
   button.setAttribute('aria-pressed',String(state[key]));
   button.setAttribute('aria-label',`${state[key]?'Close':'Open'} ${openingNames[key]}`);
   airflow.querySelector(`[data-opening-state="${key}"]`)!.textContent=state[key]?'Open':'Closed';
   const leaf=airflow.querySelector<SVGGElement>(`[data-opening-leaf="${key}"]`)!;
   leaf.style.transform=`rotate(${state[key]?leaf.dataset.openAngle:0}deg)`;
   airflow.querySelector<SVGGElement>(`[data-opening-link="${key}"]`)!.style.opacity=state[key]&&!flow.cross?'1':'0';
  });
  airflow.querySelector<SVGGElement>('[data-cross-flow]')!.style.opacity=flow.cross?'1':'0';
  flow.zones.forEach((connected,i)=>{airflow.querySelector<SVGGElement>(`[data-zone-flow="${i}"]`)!.style.opacity=flow.cross?'0':connected?'1':'.18';});
 };
 const tour=idleTour(airflow,()=>{tourIndex=(tourIndex+1)%openingTour.length;state={...openingTour[tourIndex]};update();},motion=>animations.forEach(animation=>motion?animation.play():animation.pause()),4500);
 airflow.querySelectorAll<HTMLButtonElement>('[data-opening]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.opening as Opening;state={...state,[key]:!state[key]};tour.manual();update();}));
 update();tour.refresh();
}
