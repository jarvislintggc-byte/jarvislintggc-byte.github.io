/* Original seven-color fluid study. No libraries, tracking, or copied site assets. */
(() => {
  'use strict';
  const stage = document.querySelector('.ink-atmosphere');
  const intro = document.querySelector('.intro-screen');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let canvas = document.querySelector('#ink-canvas');
  let enabled = !reducedMotion.matches;
  let engine;
  let width = 1;
  let height = 1;
  let frame = 0;
  let previousTime = 0;
  let lastInput = 0;
  let previousPointer = null;
  // Count gestures, never the interpolated fluid samples within a gesture.
  const palette = [[14,14,14],[38,65,119],[25,112,130],[48,111,72],[144,98,28],[153,60,48],[105,58,130]];
  let actionCount = 0;
  let color = palette[0];
  let lastMotion = -Infinity;
  let pressedPointer = null;
  const controls = 'a,button,input,textarea,select,dialog,[role="tab"]';
  function beginAction() { color = palette[Math.floor(actionCount / 3) % palette.length]; actionCount++; }
  function resetGesture() { previousPointer = null; lastMotion = -Infinity; pressedPointer = null; }
  function canPaint(event) { return enabled && !document.hidden && scrollY < height && !document.querySelector('dialog[open]') && !event.target.closest(controls); }
  const points = [];

  function createFluid(target) {
    const gl = target.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error('WebGL unavailable');
    const half = gl.getExtension('OES_texture_half_float');
    gl.getExtension('EXT_color_buffer_half_float');
    if (!half) throw new Error('Half-float textures unavailable');
    const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision ? 'highp' : 'mediump';
    const vertex = `attribute vec2 aPosition; varying vec2 vUv; void main(){ vUv=aPosition*.5+.5; gl_Position=vec4(aPosition,0.,1.); }`;
    const common = `precision ${precision} float; varying vec2 vUv; uniform vec2 texel;
      vec4 sampleLinear(sampler2D t,vec2 uv,vec2 size){vec2 p=clamp(uv,vec2(0.),vec2(1.))/size-.5;vec2 i=floor(p);vec2 f=fract(p);vec2 a=(i+.5)*size;return mix(mix(texture2D(t,a),texture2D(t,a+vec2(size.x,0.)),f.x),mix(texture2D(t,a+vec2(0.,size.y)),texture2D(t,a+size),f.x),f.y);}`;
    function shader(type, source) {
      const result = gl.createShader(type); gl.shaderSource(result, source); gl.compileShader(result);
      if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { const error = gl.getShaderInfoLog(result); gl.deleteShader(result); throw new Error(error); }
      return result;
    }
    const vertexShader = shader(gl.VERTEX_SHADER, vertex);
    function program(source) {
      const result = gl.createProgram(); const fragment = shader(gl.FRAGMENT_SHADER, common + source);
      gl.attachShader(result, vertexShader); gl.attachShader(result, fragment); gl.bindAttribLocation(result, 0, 'aPosition'); gl.linkProgram(result); gl.deleteShader(fragment);
      if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(result));
      const uniforms = {};
      for (let i = 0; i < gl.getProgramParameter(result, gl.ACTIVE_UNIFORMS); i++) { const name = gl.getActiveUniform(result, i).name; uniforms[name] = gl.getUniformLocation(result, name); }
      return { result, uniforms };
    }
    const programs = {
      splat: program(`uniform sampler2D source;uniform vec2 point;uniform vec4 amount;uniform float aspect;uniform float radius;void main(){vec2 p=vUv-point;p.x*=aspect;float drop=exp(-dot(p,p)/radius);gl_FragColor=texture2D(source,vUv)+amount*drop;}`),
      advect: program(`uniform sampler2D source;uniform sampler2D velocity;uniform vec2 sourceTexel;uniform float dt;uniform float decay;void main(){vec2 flow=sampleLinear(velocity,vUv,texel).xy;vec2 uv=vUv-dt*flow*texel;gl_FragColor=sampleLinear(source,uv,sourceTexel)*decay;}`),
      curl: program(`uniform sampler2D velocity;void main(){float l=texture2D(velocity,vUv-vec2(texel.x,0.)).y;float r=texture2D(velocity,vUv+vec2(texel.x,0.)).y;float b=texture2D(velocity,vUv-vec2(0.,texel.y)).x;float t=texture2D(velocity,vUv+vec2(0.,texel.y)).x;gl_FragColor=vec4(.5*(r-l-t+b),0.,0.,1.);}`),
      vortex: program(`uniform sampler2D velocity;uniform sampler2D curl;uniform float dt;void main(){float l=texture2D(curl,vUv-vec2(texel.x,0.)).x;float r=texture2D(curl,vUv+vec2(texel.x,0.)).x;float b=texture2D(curl,vUv-vec2(0.,texel.y)).x;float t=texture2D(curl,vUv+vec2(0.,texel.y)).x;float c=texture2D(curl,vUv).x;vec2 force=.5*vec2(abs(t)-abs(b),abs(r)-abs(l));force/=length(force)+.0001;force*=13.*c;force.y*=-1.;vec2 v=texture2D(velocity,vUv).xy;gl_FragColor=vec4(clamp(v+force*dt,vec2(-500.),vec2(500.)),0.,1.);}`),
      divergence: program(`uniform sampler2D velocity;void main(){float l=texture2D(velocity,vUv-vec2(texel.x,0.)).x;float r=texture2D(velocity,vUv+vec2(texel.x,0.)).x;float b=texture2D(velocity,vUv-vec2(0.,texel.y)).y;float t=texture2D(velocity,vUv+vec2(0.,texel.y)).y;vec2 c=texture2D(velocity,vUv).xy;if(vUv.x<texel.x)l=-c.x;if(vUv.x>1.-texel.x)r=-c.x;if(vUv.y<texel.y)b=-c.y;if(vUv.y>1.-texel.y)t=-c.y;gl_FragColor=vec4(.5*(r-l+t-b),0.,0.,1.);}`),
      pressure: program(`uniform sampler2D pressure;uniform sampler2D divergence;void main(){float l=texture2D(pressure,vUv-vec2(texel.x,0.)).x;float r=texture2D(pressure,vUv+vec2(texel.x,0.)).x;float b=texture2D(pressure,vUv-vec2(0.,texel.y)).x;float t=texture2D(pressure,vUv+vec2(0.,texel.y)).x;float d=texture2D(divergence,vUv).x;gl_FragColor=vec4((l+r+b+t-d)*.25,0.,0.,1.);}`),
      gradient: program(`uniform sampler2D pressure;uniform sampler2D velocity;void main(){float l=texture2D(pressure,vUv-vec2(texel.x,0.)).x;float r=texture2D(pressure,vUv+vec2(texel.x,0.)).x;float b=texture2D(pressure,vUv-vec2(0.,texel.y)).x;float t=texture2D(pressure,vUv+vec2(0.,texel.y)).x;vec2 v=texture2D(velocity,vUv).xy;v-=vec2(r-l,t-b);gl_FragColor=vec4(v,0.,1.);}`),
      display: program(`uniform sampler2D ink;uniform vec2 inkTexel;void main(){vec4 wash=sampleLinear(ink,vUv,inkTexel);float d=max(0.,wash.a);vec3 color=clamp(wash.rgb/max(d,.00001),0.,1.);float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float pigment=1.-exp(-d*1.5);float alpha=pigment*.4*(.87+.13*grain);gl_FragColor=vec4(color,alpha);}`)
    };
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.disable(gl.BLEND);
    let targets = [];
    let velocity, ink, pressure, divergence, curl;
    function texture(w, h) {
      const value = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, value); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, half.HALF_FLOAT_OES, null);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, value, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { gl.deleteFramebuffer(fbo); gl.deleteTexture(value); throw new Error('Fluid framebuffer unavailable'); }
      const result = { value, fbo, width:w, height:h }; targets.push(result); gl.viewport(0,0,w,h); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); return result;
    }
    function double(w,h) { return { read:texture(w,h), write:texture(w,h), swap(){ [this.read,this.write]=[this.write,this.read]; } }; }
    function bind(p) { gl.useProgram(p.result); return p.uniforms; }
    function sampler(uniform, value, unit) { gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,value.value); gl.uniform1i(uniform,unit); }
    function blit(destination) { gl.bindFramebuffer(gl.FRAMEBUFFER,destination?.fbo??null); gl.viewport(0,0,destination?.width??target.width,destination?.height??target.height); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); }
    function clear() { for(const t of targets){gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT); }
    function resize(w,h) {
      for(const t of targets){gl.deleteFramebuffer(t.fbo);gl.deleteTexture(t.value);} targets=[];
      const ratio=w/h, base=w<650?88:120;
      const sw=Math.round(ratio>=1?base*ratio:base),sh=Math.round(ratio>=1?base:base/ratio);
      velocity=double(sw,sh);pressure=double(sw,sh);divergence=texture(sw,sh);curl=texture(sw,sh);ink=double(sw*3,sh*3);
      const dpr=Math.min(devicePixelRatio||1,1.5);target.width=Math.round(w*dpr);target.height=Math.round(h*dpr);clear();
    }
    function splat(point) {
      let u=bind(programs.splat);sampler(u.source,velocity.read,0);gl.uniform2f(u.point,point.x,1-point.y);gl.uniform4f(u.amount,point.dx*3600,-point.dy*3600,0,0);gl.uniform1f(u.aspect,width/height);gl.uniform1f(u.radius,point.down?.00105:.00052);blit(velocity.write);velocity.swap();
      const density=point.down?.75:.19;
      sampler(u.source,ink.read,0);gl.uniform4f(u.amount,point.color[0]/255*density,point.color[1]/255*density,point.color[2]/255*density,density);gl.uniform1f(u.radius,point.down?.00068:.00027);blit(ink.write);ink.swap();
    }
    function step(dt) {
      let u=bind(programs.curl);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);sampler(u.velocity,velocity.read,0);blit(curl);
      u=bind(programs.vortex);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);sampler(u.velocity,velocity.read,0);sampler(u.curl,curl,1);gl.uniform1f(u.dt,dt);blit(velocity.write);velocity.swap();
      u=bind(programs.divergence);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);sampler(u.velocity,velocity.read,0);blit(divergence);
      // Pressure is solved afresh; no stale pressure accumulates while idle.
      for(const t of [pressure.read,pressure.write]){gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}
      u=bind(programs.pressure);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);sampler(u.divergence,divergence,1);
      for(let i=0;i<12;i++){sampler(u.pressure,pressure.read,0);blit(pressure.write);pressure.swap();}
      u=bind(programs.gradient);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);sampler(u.pressure,pressure.read,0);sampler(u.velocity,velocity.read,1);blit(velocity.write);velocity.swap();
      u=bind(programs.advect);gl.uniform2f(u.texel,1/velocity.read.width,1/velocity.read.height);gl.uniform1f(u.dt,dt);gl.uniform1f(u.decay,Math.exp(-1.35*dt));gl.uniform2f(u.sourceTexel,1/velocity.read.width,1/velocity.read.height);sampler(u.source,velocity.read,0);sampler(u.velocity,velocity.read,1);blit(velocity.write);velocity.swap();
      gl.uniform1f(u.decay,Math.exp(-.48*dt));gl.uniform2f(u.sourceTexel,1/ink.read.width,1/ink.read.height);sampler(u.velocity,velocity.read,1);sampler(u.source,ink.read,0);blit(ink.write);ink.swap();
      u=bind(programs.display);sampler(u.ink,ink.read,0);gl.uniform2f(u.inkTexel,1/ink.read.width,1/ink.read.height);blit(null);
    }
    target.dataset.inkRenderer='webgl';
    return {resize,splat,step,clear};
  }

  // A restrained 2D wash remains available when floating-point WebGL is absent.
  function createWash(target) {
    const ctx=target.getContext('2d');if(!ctx)return null;
    let drops=[];
    return {
      resize(w,h){target.width=Math.round(w);target.height=Math.round(h);drops=[];},
      splat(p){if(drops.length>150)drops.shift();drops.push({x:p.x*width,y:p.y*height,vx:p.dx*width*10,vy:p.dy*height*10,life:1,r:p.down?34:20,phase:Math.random()*6.28,down:p.down,color:p.color.join(',')});},
      clear(){drops=[];ctx.clearRect(0,0,target.width,target.height);},
      step(dt){ctx.clearRect(0,0,target.width,target.height);drops=drops.filter(p=>p.life>.015);for(const p of drops){p.life*=Math.exp(-.6*dt);p.phase+=dt*.7;p.x+=(p.vx+Math.cos(p.phase)*5)*dt;p.y+=(p.vy+Math.sin(p.phase)*4)*dt;p.vx*=Math.exp(-dt*1.5);p.vy*=Math.exp(-dt*1.5);p.r+=dt*3;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(${p.color},${p.life*(p.down?.0875:.03125)})`);g.addColorStop(.5,`rgba(${p.color},${p.life*.01875})`);g.addColorStop(1,`rgba(${p.color},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,p.r,0,0,Math.PI*2);ctx.fill();}}
    };
  }
  function fallback() {
    const replacement=document.createElement('canvas');replacement.id='ink-canvas';canvas.replaceWith(replacement);canvas=replacement;canvas.dataset.inkRenderer='2d';return createWash(canvas);
  }
  try { engine=createFluid(canvas); } catch { engine=fallback(); }
  if(!engine)return;

  function resize(){const nextWidth=intro.clientWidth,nextHeight=intro.offsetHeight;if(nextWidth===width&&nextHeight===height)return;width=nextWidth;height=nextHeight;stage.style.height=`${height}px`;try{engine.resize(width,height);}catch{engine=fallback();if(!engine)return;engine.resize(width,height);}points.length=0;resetGesture();if(enabled)seed();}
  function wake(){if(!enabled||document.hidden||scrollY>height)return;lastInput=performance.now();if(!frame){previousTime=0;frame=requestAnimationFrame(render);}}
  function render(now){frame=0;if(!enabled||document.hidden||scrollY>height)return;if(now-lastInput>9000){engine.clear();return;}const dt=previousTime?Math.min((now-previousTime)/1000,.033):1/60;previousTime=now;for(const point of points.splice(0,24))engine.splat(point);engine.step(dt);frame=requestAnimationFrame(render);}
  function add(x,y,dx,dy,down){points.push({x,y,dx:Math.max(-.07,Math.min(.07,dx)),dy:Math.max(-.07,Math.min(.07,dy)),down,color});if(points.length>48)points.splice(0,points.length-48);wake();}
  function seed(){if(!enabled)return;const path=[{x:.06,y:.19},{x:.1,y:.14},{x:.17,y:.13},{x:.24,y:.16},{x:.29,y:.22}];path.forEach((p,i)=>{add(p.x,p.y,i?.018:.008,.006,i===1||i===2);});add(.91,.68,-.02,-.012,true);add(.88,.64,-.018,.007,false);}
  function pointer(event) {
    if (!canPaint(event)) { resetGesture(); return; }
    const y = event.clientY + scrollY;
    if (y < 0 || y > height) { resetGesture(); return; }
    const p = { x:event.clientX/width, y:y/height, time:event.timeStamp };
    if (previousPointer && p.time - previousPointer.time < 280) {
      const dx=p.x-previousPointer.x, dy=p.y-previousPointer.y;
      const distance=Math.hypot(dx*width,dy*height);
      if (distance > 1) {
        if (pressedPointer !== event.pointerId && p.time - lastMotion >= 280) beginAction();
        lastMotion = p.time;
        const count=Math.min(7,Math.ceil(distance/18));
        for(let i=1;i<=count;i++){const t=i/count;add(previousPointer.x+dx*t,previousPointer.y+dy*t,dx/count,dy/count,Boolean(event.buttons&1));}
      }
    }
    previousPointer=p;
  }
  function dab(event) {
    if (!canPaint(event) || event.button > 0 || event.shiftKey) return;
    const y=event.clientY+scrollY;
    if(y>=0 && y<=height) {
      if(event.pointerType==='mouse')event.preventDefault();
      beginAction();pressedPointer=event.pointerId;lastMotion=event.timeStamp;
      previousPointer={x:event.clientX/width,y:y/height,time:event.timeStamp};
      add(event.clientX/width,y/height,.003,-.004,true);
    }
  }
  document.addEventListener('pointermove',pointer,{passive:true});
  document.addEventListener('pointerdown',dab,{passive:false});
  document.addEventListener('pointerup',event=>{if(pressedPointer===event.pointerId)resetGesture();},{passive:true});
  document.addEventListener('pointercancel',resetGesture,{passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget)resetGesture();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;resetGesture();}else if(enabled&&performance.now()-lastInput<9000)wake();});
  window.addEventListener('blur',resetGesture);
  window.addEventListener('scroll',()=>{resetGesture();if(scrollY>height){cancelAnimationFrame(frame);frame=0;}},{passive:true});
  reducedMotion.addEventListener('change',event=>{enabled=!event.matches;cancelAnimationFrame(frame);frame=0;points.length=0;resetGesture();engine.clear();if(enabled)seed();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;enabled=false;points.length=0;engine=fallback();if(engine)engine.resize(width,height);});
  let resizeTimer;const observer=new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,100);});observer.observe(intro);
  resize();
})();
