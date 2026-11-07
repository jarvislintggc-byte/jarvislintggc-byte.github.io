// Independently authored Web Audio instrument. No reference-site source or assets.
(() => {
 'use strict';
 class BuildSound {
  constructor(){this.ctx=null;this.on=true;this.keys=new Map();this.voices=0;this.noteAt=0;}
  init(){
   if(this.ctx)return true;
   try{
    this.voices=0;this.keys.clear();this.noteAt=-1;
    this.ctx=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
    this.out=this.ctx.createGain();this.out.gain.value=1;this.out.connect(this.ctx.destination);
    this.compressor=this.ctx.createDynamicsCompressor();this.compressor.threshold.value=-22;this.compressor.ratio.value=4;this.compressor.connect(this.out);
    this.room=this.ctx.createConvolver();const length=Math.ceil(this.ctx.sampleRate*1.9),impulse=this.ctx.createBuffer(2,length,this.ctx.sampleRate);
    for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);let low=0;for(let i=0;i<length;i++){low+=(Math.random()*2-1-low)*.23;data[i]=low*Math.exp(-i/length*6)*Math.min(1,i/400);}}
    this.room.buffer=impulse;const wet=this.ctx.createGain();wet.gain.value=.24;this.room.connect(wet);wet.connect(this.compressor);
    this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate);const samples=this.noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
    return true;
   }catch{return false;}
  }
  ready(){return this.on&&this.ctx?.state==='running';}
  setOn(value){this.on=value;if(!this.ctx)return;const t=this.ctx.currentTime;this.out.gain.cancelScheduledValues(t);this.out.gain.setTargetAtTime(value?1:0,t,.035);}
  position(x,width){return Math.max(-.85,Math.min(.85,(x/Math.max(1,width)-.5)*1.7));}
  route(x,width){const panner=this.ctx.createStereoPanner();panner.pan.value=this.position(x,width);panner.connect(this.compressor);panner.connect(this.room);return panner;}
  click(x,width,frequency=1700,strength=.055){
   if(!this.ready()||this.voices>36)return;
   const t=this.ctx.currentTime+.003,src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain(),panner=this.route(x,width);
   src.buffer=this.noise;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=1.7;
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(strength,t+.0015);gain.gain.exponentialRampToValueAtTime(.0001,t+.035);
   src.connect(filter);filter.connect(gain);gain.connect(panner);this.voices++;src.start(t,Math.random()*.6);src.stop(t+.045);src.onended=()=>{this.voices--;panner.disconnect();src.disconnect();filter.disconnect();gain.disconnect();};
  }
  tone(midi,x,width,volume=.035){
   if(!this.ready()||this.voices>32)return;
   const t=this.ctx.currentTime+.008,frequency=440*2**((midi-69)/12),pan=this.route(x,width),partials=[[1,1,1.5],[2,.28,.72],[2.72,.12,.48],[4,.045,.25]];
   let remaining=partials.length;
   for(const [ratio,level,decay]of partials){const oscillator=this.ctx.createOscillator(),gain=this.ctx.createGain();oscillator.type='sine';oscillator.frequency.value=frequency*ratio;
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume*level,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+decay);
    oscillator.connect(gain);gain.connect(pan);this.voices++;oscillator.start(t);oscillator.stop(t+decay+.02);oscillator.onended=()=>{this.voices--;oscillator.disconnect();gain.disconnect();if(!--remaining)pan.disconnect();};
   }
  }
  key(x,width,id,count=1){if(!this.ready())return;const now=this.ctx.currentTime;if(now-(this.keys.get(id)??-1)<.045)return;this.keys.set(id,now);this.click(x,width,1100+Math.random()*1700,.032+Math.min(count,3)*.008);}
  press(x,width){this.click(x,width,2600,.065);}
  grow(step,x,width){this.click(x,width,1900+step*170,.024);}
  place(kind,x,y,w,h,width,height){
   if(!this.ready()||kind==='text'||this.ctx.currentTime-this.noteAt<.12)return;
   this.noteAt=this.ctx.currentTime;const scale=[0,2,4,7,9],degree=Math.min(4,Math.max(0,Math.floor(x/Math.max(width,1)*5))),area=w*h/Math.max(1,width*height),octave=area>.08?0:area>.015?12:24;
   this.tone(52+octave+scale[degree],x,width,kind==='image'?.045:.032);
   if(kind==='dup')this.tone(59,x,width,.022);
  }
  start(){this.tone(64,innerWidth*.4,innerWidth,.026);}
 }
 window.JarvisBuildSound=BuildSound;
})();
