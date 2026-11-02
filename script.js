const canvas=document.querySelector('#landscape'),ctx=canvas.getContext('2d');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,paused=reduce.matches,elapsed=reduce.matches?14000:0,last=null,raf;
const cycle=19000,drawTime=16000;
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function curve(x){return .72*Math.sin(1.6*x+.9*Math.sin(2.3*x))+.48*Math.cos(4.7*x)*Math.exp(-.018*x*x)+.28*Math.sin(10.4*x+.6*Math.cos(3.2*x))+.15*Math.cos(18.6*x)/(1+.035*x*x)}
function draw(){
 ctx.clearRect(0,0,width,height);ctx.fillStyle='#10130f';ctx.fillRect(0,0,width,height);
 const left=width<450?42:65,right=width-35,top=65,bottom=height-90;
 const xMin=-Math.PI*2,xMax=Math.PI*2,yMin=-2,yMax=2;
 const px=x=>left+(x-xMin)/(xMax-xMin)*(right-left),py=y=>bottom-(y-yMin)/(yMax-yMin)*(bottom-top);
 ctx.lineWidth=1;ctx.font='10px monospace';
 for(let x=-6;x<=6;x++){ctx.strokeStyle='#a2b18412';ctx.beginPath();ctx.moveTo(px(x),top);ctx.lineTo(px(x),bottom);ctx.stroke()}
 for(let y=-2;y<=2;y+=.5){ctx.strokeStyle='#a2b18412';ctx.beginPath();ctx.moveTo(left,py(y));ctx.lineTo(right,py(y));ctx.stroke()}
 ctx.strokeStyle='#a9b69670';ctx.beginPath();ctx.moveTo(left,py(0));ctx.lineTo(right+8,py(0));ctx.moveTo(px(0),bottom+8);ctx.lineTo(px(0),top-10);ctx.stroke();
 ctx.beginPath();ctx.moveTo(right+3,py(0)-4);ctx.lineTo(right+8,py(0));ctx.lineTo(right+3,py(0)+4);ctx.moveTo(px(0)-4,top-5);ctx.lineTo(px(0),top-10);ctx.lineTo(px(0)+4,top-5);ctx.stroke();
 ctx.fillStyle='#a9b696';ctx.fillText('x',right+10,py(0)+4);ctx.fillText('y',px(0)+9,top-6);
 ctx.textAlign='center';for(const [x,label] of [[-2*Math.PI,'−2π'],[-Math.PI,'−π'],[Math.PI,'π'],[2*Math.PI,'2π']]){ctx.fillText(label,px(x),py(0)+19)}ctx.textAlign='right';for(const y of [-1,1])ctx.fillText(String(y),px(0)-10,py(y)+4);ctx.textAlign='left';ctx.fillText('0',px(0)+8,py(0)+18);
 const progress=Math.min((elapsed%cycle)/drawTime,1),end=xMin+(xMax-xMin)*progress;
 ctx.strokeStyle='#bdcf99';ctx.lineWidth=2;ctx.lineJoin='round';ctx.shadowColor='#a9ce84';ctx.shadowBlur=9;ctx.beginPath();
 const steps=Math.max(1,Math.ceil(progress*1800));for(let i=0;i<=steps;i++){const x=xMin+(end-xMin)*i/steps,y=curve(x);if(i===0)ctx.moveTo(px(x),py(y));else ctx.lineTo(px(x),py(y))}ctx.stroke();ctx.shadowBlur=0;
 const ex=px(end),ey=py(curve(end));ctx.setLineDash([3,5]);ctx.strokeStyle='#bdcf9940';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex,py(0));ctx.stroke();ctx.setLineDash([]);
 ctx.fillStyle='#c8dda8';ctx.shadowColor='#b7d297';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(ex,ey,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;

}
function tick(now){if(last!==null)elapsed+=Math.min(now-last,80);last=now;draw();if(!paused)raf=requestAnimationFrame(tick)}
function motionLabel(){const b=document.querySelector('#motion');b.textContent=paused?'Play ↗':'Pause ↙';b.setAttribute('aria-label',paused?'Play animation':'Pause animation');b.setAttribute('aria-pressed',String(paused))}
document.querySelector('#motion').addEventListener('click',()=>{paused=!paused;last=null;motionLabel();cancelAnimationFrame(raf);if(!paused)raf=requestAnimationFrame(tick)});
reduce.addEventListener('change',event=>{paused=event.matches;last=null;cancelAnimationFrame(raf);if(paused){elapsed=drawTime;draw()}else raf=requestAnimationFrame(tick);motionLabel()});
new ResizeObserver(resize).observe(canvas);motionLabel();if(!paused)raf=requestAnimationFrame(tick);document.querySelector('#year').textContent=new Date().getFullYear();
