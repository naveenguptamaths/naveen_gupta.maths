const canvas=document.querySelector('#landscape'),ctx=canvas.getContext('2d');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,paused=reduce.matches,elapsed=reduce.matches?10000:0,last=null,raf;
const cycle=14500,drawTime=10500;
// Handwritten strokes in a shared 520 × 260 coordinate system.
const strokes=[
 [[70,225],[80,160,95,58,130,38],[165,18,171,75,137,98],[108,118,94,132,72,143]],
 [[45,135],[75,128,117,127,145,130]],
 [[276,128],[257,99,211,106,194,143],[175,187,210,213,242,189],[265,168,282,101,296,45],[305,10,320,20,310,57],[293,107,267,165,273,189],[280,209,296,192,308,178]],
 [[421,127],[400,101,358,106,343,143],[327,184,349,211,383,188],[403,173,414,143,421,124],[411,151,400,181,410,193],[421,204,444,187,463,173]]
];
const paths=[];
for(const stroke of strokes){let a=stroke[0],points=[a];for(const b of stroke.slice(1)){for(let i=1;i<=90;i++){const t=i/90,u=1-t;points.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*b[2]+t*t*t*b[4],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*b[3]+t*t*t*b[5]])}a=[b[4],b[5]]}paths.push(points)}
const lengths=paths.map(points=>{let n=0;const cumulative=[0];for(let i=1;i<points.length;i++){n+=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);cumulative.push(n)}return {total:n,cumulative}}),total=lengths.reduce((s,x)=>s+x.total,0);
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function draw(){ctx.fillStyle='#10130f';ctx.fillRect(0,0,width,height);const scale=Math.min((width-45)/520,(height-130)/260),ox=(width-520*scale)/2,oy=(height-260*scale)/2-10;let remaining=Math.min((elapsed%cycle)/drawTime,1)*total;ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);ctx.lineWidth=2.6/Math.sqrt(scale);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#c1d39f';ctx.shadowColor='#aac77d';ctx.shadowBlur=9;let tip=null;for(let k=0;k<paths.length;k++){if(remaining<=0)break;const points=paths[k],len=lengths[k];ctx.beginPath();ctx.moveTo(...points[0]);tip=points[0];for(let i=1;i<points.length;i++){if(len.cumulative[i]>remaining){const prev=len.cumulative[i-1],f=(remaining-prev)/(len.cumulative[i]-prev);tip=[points[i-1][0]+f*(points[i][0]-points[i-1][0]),points[i-1][1]+f*(points[i][1]-points[i-1][1])];ctx.lineTo(...tip);break}ctx.lineTo(...points[i]);tip=points[i]}ctx.stroke();remaining-=len.total}if(tip&&elapsed%cycle<drawTime){ctx.fillStyle='#d4e4b9';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(tip[0],tip[1],3,0,Math.PI*2);ctx.fill()}ctx.restore()}
function tick(now){if(last!==null)elapsed+=Math.min(now-last,80);last=now;draw();if(!paused)raf=requestAnimationFrame(tick)}
function motionLabel(){const b=document.querySelector('#motion');b.textContent=paused?'Play ↗':'Pause ↙';b.setAttribute('aria-label',paused?'Play animation':'Pause animation');b.setAttribute('aria-pressed',String(paused))}
document.querySelector('#motion').addEventListener('click',()=>{paused=!paused;last=null;motionLabel();cancelAnimationFrame(raf);if(!paused)raf=requestAnimationFrame(tick)});
reduce.addEventListener('change',event=>{paused=event.matches;last=null;cancelAnimationFrame(raf);if(paused){elapsed=drawTime;draw()}else raf=requestAnimationFrame(tick);motionLabel()});
new ResizeObserver(resize).observe(canvas);motionLabel();if(!paused)raf=requestAnimationFrame(tick);document.querySelector('#year').textContent=new Date().getFullYear();
