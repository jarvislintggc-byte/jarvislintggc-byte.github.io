// Hit sprites contain animation offsets, not interchangeable center origins.
// Align the largest visible frame once, preserving motion within the sequence.
const references=new WeakMap();
// Meteor, Arrow Rain and Dragon Strike have a native floor-contact origin.
const groundImpacts=new Set([2121007,3111004,5121001]);
export function effectReference(track){
 if(!references.has(track))references.set(track,track.frames.filter(f=>!f.transparent&&f.width>1&&f.height>1).reduce((best,f)=>!best||f.width*f.height>best.width*best.height?f:best,null)||track.frames[0]);
 return references.get(track);
}
export function enemyBodyTarget(monster,mobile=false,facing=1){
 const frame=monster.poses.stand[0],scale=mobile?.7:1;
 return {offsetX:(frame.width/2-frame.origin.x)*scale*(facing===-1?-1:1),height:Math.max(8,frame.origin.y-frame.height*.55)*scale};
}
export function skillTrackGeometry(ability,track,frame,{width,mobile=false},{actorX,targetX=64,targetHeight=mobile?50:75,lift=0,facing=1,flight=0}){
 const maxWidth=Math.max(...track.frames.map(f=>f.width)),baseScale=mobile?.98:1.4,scale=maxWidth>600?Math.min(baseScale,width*1.2/maxWidth):baseScale;
 const mirror=(facing===1)!==Boolean(frame.flip),sign=mirror?-1:1;
 let x=track.anchor==='actor'?actorX:targetX,y=track.anchor==='actor'?lift:0;
 if(track.anchor==='projectile'){x=actorX+(targetX-actorX)*flight;y=(35*baseScale+lift)*(1-flight)+targetHeight*flight;}
 const ground=track.anchor==='field'||track.anchor==='boss'&&groundImpacts.has(ability.id);
 if(track.anchor==='boss')y=ground?0:targetHeight;
 if(track.anchor!=='actor'){
  const reference=effectReference(track);
  x-=sign*(reference.width/2-reference.origin.x)*scale/width*100;
  if(!ground)y-=(reference.origin.y-reference.height*.5)*scale;
 }
 return {x,y,scale,mirror};
}
