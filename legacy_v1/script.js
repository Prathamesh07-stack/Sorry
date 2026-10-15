/* =============================================
   SORRY — script.js (v3 Enhanced)
   ============================================= */

/* ---- 1. FALLING PETALS ---- */
(function() {
  const canvas = document.getElementById('petalCanvas');
  const ctx = canvas.getContext('2d');
  let petals = [], W, H;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resize(); addEventListener('resize', resize);
  const COLORS=['rgba(253,198,208,','rgba(251,113,133,','rgba(244,63,94,','rgba(253,164,175,','rgba(255,228,230,'];
  function mkPetal(){
    const c=COLORS[Math.floor(Math.random()*COLORS.length)];
    return{x:Math.random()*W,y:-20,size:4+Math.random()*9,vy:0.6+Math.random()*1.2,vx:(Math.random()-0.5)*0.7,
      angle:Math.random()*Math.PI*2,rot:(Math.random()-0.5)*0.05,
      sway:Math.random()*0.9,swaySpd:0.01+Math.random()*0.015,swayOff:Math.random()*Math.PI*2,
      color:c,alpha:0.4+Math.random()*0.5};
  }
  for(let i=0;i<45;i++){const p=mkPetal();p.y=Math.random()*H;petals.push(p);}
  let f=0;
  function tick(){
    ctx.clearRect(0,0,W,H);f++;
    if(f%7===0&&petals.length<75) petals.push(mkPetal());
    petals=petals.filter(p=>p.y<H+30);
    for(const p of petals){
      p.swayOff+=p.swaySpd;p.x+=p.vx+Math.sin(p.swayOff)*p.sway;p.y+=p.vy;p.angle+=p.rot;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);
      ctx.beginPath();ctx.scale(1,0.55);ctx.arc(0,0,p.size,0,Math.PI*2);
      const g=ctx.createRadialGradient(0,0,0,0,0,p.size);
      g.addColorStop(0,`${p.color}${p.alpha})`);g.addColorStop(1,`${p.color}0)`);
      ctx.fillStyle=g;ctx.fill();ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---- 2. TWINKLING STARS ---- */
(function() {
  const bg=document.getElementById('starsBg');
  for(let i=0;i<90;i++){
    const s=document.createElement('div');s.className='star';
    const sz=1+Math.random()*2.5;
    s.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*6}s;`;
    bg.appendChild(s);
  }
})();

/* ---- 3. HERO PARTICLE BURST ---- */
(function() {
  const canvas=document.getElementById('heroParticles');
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  class Particle{
    constructor(burst=false){
      if(burst){
        this.x=W/2;this.y=H*0.42;
        const a=Math.random()*Math.PI*2;
        const sp=3+Math.random()*6;
        this.vx=Math.cos(a)*sp;this.vy=Math.sin(a)*sp;
        this.life=1;this.decay=0.015+Math.random()*0.02;
        this.size=3+Math.random()*6;this.burst=true;
      } else {
        this.reset();this.y=Math.random()*H;this.burst=false;
      }
    }
    reset(){
      this.x=Math.random()*W;this.y=H+10;
      this.vx=(Math.random()-0.5)*0.5;this.vy=-(0.3+Math.random()*0.8);
      this.life=1;this.decay=0.003+Math.random()*0.005;
      this.size=2+Math.random()*4;this.burst=false;
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;
      if(this.burst) this.vy+=0.1;
      return this.life>0&&this.y>-10;
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.life*0.7;
      ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      const hue=340+Math.random()*30;
      ctx.fillStyle=`hsl(${hue},90%,${65+Math.random()*20}%)`;
      ctx.fill();ctx.restore();
    }
  }

  for(let i=0;i<30;i++) particles.push(new Particle());

  // burst on name reveal
  setTimeout(()=>{
    for(let i=0;i<80;i++) particles.push(new Particle(true));
  },1500);

  function tick(){
    ctx.clearRect(0,0,W,H);
    particles=particles.filter(p=>{
      const alive=p.update();p.draw();
      if(!alive&&!p.burst){p.reset();return true;}
      return alive;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---- 4. HERO TYPEWRITER TAGLINE ---- */
(function() {
  const el=document.getElementById('heroTagline');
  const text="I messed up. And I hate that I did.\nSo I made this — just for you.";
  let i=0;
  const cursor=document.createElement('span');
  cursor.className='cursor';el.appendChild(cursor);

  function type(){
    if(i<text.length){
      const ch=text[i];
      if(ch==='\n'){ el.insertBefore(document.createElement('br'),cursor); }
      else { el.insertBefore(document.createTextNode(ch),cursor); }
      i++;setTimeout(type,35+Math.random()*30);
    } else {
      cursor.style.display='none';
    }
  }
  setTimeout(type,2000);
})();

/* ---- 5. SCROLL REVEAL ---- */
(function() {
  const els=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}
    }
  },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
  for(const el of els) obs.observe(el);
})();

/* ---- 6. SMOOTH SCROLL ---- */
document.getElementById('scrollBtn').addEventListener('click',e=>{
  e.preventDefault();
  document.getElementById('letter').scrollIntoView({behavior:'smooth'});
});

/* ---- 7. CURSOR SPARKLE ---- */
(function() {
  const COLORS=['#fda4af','#f43f5e','#fecdd3','#fb7185','#ffe4e6','#ffd700'];
  document.addEventListener('mousemove',e=>{
    const el=document.createElement('div');
    const sz=4+Math.random()*7;
    el.style.cssText=`position:fixed;left:${e.clientX-sz/2}px;top:${e.clientY-sz/2}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${COLORS[Math.floor(Math.random()*COLORS.length)]};pointer-events:none;z-index:9999;transition:transform 0.5s ease,opacity 0.5s ease;opacity:0.9;`;
    document.body.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform=`translate(${(Math.random()-0.5)*40}px,${-12-Math.random()*22}px) scale(0)`;
      el.style.opacity='0';
    });
    setTimeout(()=>el.remove(),500);
  });
})();

/* ---- 8. GIFT BOX OPEN ON SCROLL ---- */
(function() {
  const gifts=document.querySelectorAll('.gift-box');
  const obs=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('opened'),400);obs.unobserve(e.target);}
    }
  },{threshold:0.3});
  for(const g of gifts) obs.observe(g);
})();

/* ---- 9. LETTER TYPEWRITER ---- */
(function() {
  const container=document.getElementById('letterBody');
  const closing=document.getElementById('letterClosing');

  const paragraphs=[
    "Okay so, I know I really messed up. And I'm not gonna try to make excuses or talk my way out of it — that's not what you deserve.",
    "What I will say is this — I thought about it a lot. Like a LOT a lot. And honestly, the fact that it's bothering me this much just proves how much you mean to me.",
    "You're not just any person in my life, Sid. You're the kind of person I don't want to imagine not having around. And I hate that I made you feel like you were less than that to me — because you're not. You're one of the best things that's happened to me.",
    "I'm genuinely, truly sorry. Not the half-hearted kind either. The kind that's been sitting heavy on my chest since it happened.",
    "I just need you to know — you matter to me. A lot. And I'd really like to make this right."
  ];

  let started=false;

  const obs=new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting&&!started){
        started=true;
        obs.disconnect();
        typeParagraphs();
      }
    }
  },{threshold:0.4});
  obs.observe(container.closest('.letter-section'));

  function typeParagraphs(){
    let pi=0;
    function nextParagraph(){
      if(pi>=paragraphs.length){
        closing.style.opacity='1';return;
      }
      const p=document.createElement('p');
      container.appendChild(p);
      const cursor=document.createElement('span');
      cursor.className='letter-cursor';p.appendChild(cursor);
      let ci=0;
      function typeChar(){
        if(ci<paragraphs[pi].length){
          p.insertBefore(document.createTextNode(paragraphs[pi][ci]),cursor);
          ci++;setTimeout(typeChar,22+Math.random()*18);
        } else {
          cursor.remove();pi++;
          setTimeout(nextParagraph,400);
        }
      }
      typeChar();
    }
    nextParagraph();
  }
})();

/* ---- 10. WEB AUDIO LO-FI MUSIC ---- */
(function() {
  const btn=document.getElementById('musicBtn');
  const player=document.getElementById('musicPlayer');
  let ctx=null,playing=false,nodes=[];

  function buildLofi(){
    ctx=new (window.AudioContext||window.webkitAudioContext)();

    // Master gain
    const master=ctx.createGain();
    master.gain.setValueAtTime(0,ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18,ctx.currentTime+2);
    master.connect(ctx.destination);

    // Reverb
    const convolver=ctx.createConvolver();
    const reverbBuf=ctx.createBuffer(2,ctx.sampleRate*3,ctx.sampleRate);
    for(let c=0;c<2;c++){
      const d=reverbBuf.getChannelData(c);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
    }
    convolver.buffer=reverbBuf;
    const reverbGain=ctx.createGain();reverbGain.gain.value=0.3;
    convolver.connect(reverbGain);reverbGain.connect(master);

    // Notes for a soft minor melody (C minor pentatonic ish)
    const NOTES=[261.63,311.13,349.23,392.00,466.16,523.25,622.25];
    const CHORD_ROOTS=[130.81,155.56,174.61,196.00];

    function playNote(freq,time,dur,vol=0.05){
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type='triangle';
      osc.frequency.setValueAtTime(freq,time);
      gain.gain.setValueAtTime(0,time);
      gain.gain.linearRampToValueAtTime(vol,time+0.05);
      gain.gain.exponentialRampToValueAtTime(0.001,time+dur);
      osc.connect(gain);gain.connect(convolver);gain.connect(master);
      osc.start(time);osc.stop(time+dur+0.1);
    }

    function playChord(root,time){
      playNote(root,time,1.5,0.04);
      playNote(root*1.189,time,1.5,0.03);
      playNote(root*1.498,time,1.5,0.03);
    }

    // Schedule melody loop
    let t=ctx.currentTime+0.5;
    const BEAT=0.45;

    function scheduleMelody(){
      for(let bar=0;bar<16;bar++){
        const note=NOTES[Math.floor(Math.random()*NOTES.length)];
        const barTime=t+bar*BEAT*2;
        playNote(note,barTime,BEAT*1.5,0.06);
        if(Math.random()>0.4){
          const n2=NOTES[Math.floor(Math.random()*NOTES.length)];
          playNote(n2,barTime+BEAT*0.75,BEAT*0.8,0.04);
        }
        if(bar%4===0) playChord(CHORD_ROOTS[Math.floor(bar/4)%CHORD_ROOTS.length],barTime);
      }
      t+=16*BEAT*2;
    }

    // Vinyl crackle
    function crackle(){
      const buf=ctx.createBuffer(1,ctx.sampleRate*0.1,ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()-0.5)*0.015;
      const src=ctx.createBufferSource();
      const g=ctx.createGain();g.gain.value=0.3;
      src.buffer=buf;src.loop=true;
      src.connect(g);g.connect(master);src.start();
      return {src,g};
    }

    const {src:crackleSrc}=crackle();
    nodes.push(crackleSrc);

    // Schedule loops
    scheduleMelody();
    const loopInterval=setInterval(scheduleMelody,16*BEAT*2*1000);
    nodes.push({stop:()=>clearInterval(loopInterval)});

    return master;
  }

  btn.addEventListener('click',()=>{
    if(!ctx){
      buildLofi();
      playing=true;
    } else if(playing){
      ctx.suspend();playing=false;
    } else {
      ctx.resume();playing=true;
    }
    player.classList.toggle('playing',playing);
  });
})();

/* ---- 11. BIG CONFETTI CANVAS ---- */
(function() {
  const overlay=document.getElementById('thankYouOverlay');
  const canvas=document.getElementById('confettiCanvas');
  const ctx=canvas.getContext('2d');
  let particles=[],animId,running=false;

  function resize(){canvas.width=overlay.offsetWidth;canvas.height=overlay.offsetHeight;}

  const COLORS=['#f43f5e','#fda4af','#ffd700','#ff6b9d','#fff','#fecdd3','#ff9999','#ffcc00','#c0392b'];

  class Confetti{
    constructor(){this.reset(true);}
    reset(fromTop=false){
      this.x=Math.random()*canvas.width;
      this.y=fromTop?(Math.random()-0.5)*100:-20;
      this.vx=(Math.random()-0.5)*6;
      this.vy=2+Math.random()*5;
      this.rot=Math.random()*360;
      this.rotV=(Math.random()-0.5)*10;
      this.w=8+Math.random()*14;
      this.h=4+Math.random()*8;
      this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
      this.alpha=1;
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;this.rot+=this.rotV;this.vy+=0.05;
      if(this.y>canvas.height+20) this.reset();
    }
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha;
      ctx.translate(this.x,this.y);ctx.rotate(this.rot*Math.PI/180);
      ctx.fillStyle=this.color;
      ctx.beginPath();ctx.ellipse(0,0,this.w/2,this.h/2,0,0,Math.PI*2);
      ctx.fill();ctx.restore();
    }
  }

  function startConfetti(){
    running=true;resize();
    for(let i=0;i<200;i++) particles.push(new Confetti());
    function tick(){
      if(!running)return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const p of particles){p.update();p.draw();}
      animId=requestAnimationFrame(tick);
    }
    tick();
  }

  function stopConfetti(){
    running=false;cancelAnimationFrame(animId);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles=[];
  }

  window.__startConfetti=startConfetti;
  window.__stopConfetti=stopConfetti;
})();

/* ---- 12. FORGIVE + REPLY FLOW ---- */
(function() {
  const forgiveBtn=document.getElementById('forgiveBtn');
  const overlay=document.getElementById('thankYouOverlay');
  const closeBtn=document.getElementById('tyCloseBtn');
  const actionBtn=document.getElementById('tyActionBtn');
  const replySection=document.getElementById('replySection');
  const replyInner=document.getElementById('replyInner');
  const textarea=document.getElementById('replyTextarea');
  const counter=document.getElementById('replyCount');
  const sendBtn=document.getElementById('replySendBtn');
  const sentOverlay=document.getElementById('replySentOverlay');
  const rsText=document.getElementById('rsText');
  const rsClose=document.getElementById('rsClose');

  forgiveBtn.addEventListener('click',()=>{
    overlay.setAttribute('aria-hidden','false');
    overlay.classList.add('visible');
    document.body.style.overflow='hidden';
    window.__startConfetti();
  });

  function closeOverlay(){
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    window.__stopConfetti();
  }

  closeBtn.addEventListener('click',closeOverlay);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeOverlay();});

  actionBtn.addEventListener('click',()=>{
    closeOverlay();
    replySection.style.display='flex';
    setTimeout(()=>{
      replySection.scrollIntoView({behavior:'smooth'});
      setTimeout(()=>replyInner.classList.add('visible'),200);
    },400);
  });

  textarea.addEventListener('input',()=>{
    counter.textContent=textarea.value.length;
  });

  sendBtn.addEventListener('click',()=>{
    const msg=textarea.value.trim();
    if(!msg){textarea.focus();return;}
    rsText.textContent=`"${msg}"`;
    sentOverlay.setAttribute('aria-hidden','false');
    sentOverlay.classList.add('visible');
    document.body.style.overflow='hidden';
  });

  rsClose.addEventListener('click',()=>{
    sentOverlay.classList.remove('visible');
    sentOverlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  });
  sentOverlay.addEventListener('click',e=>{if(e.target===sentOverlay)rsClose.click();});
})();
