// Physics coordinates: x in CSS pixels; y is height above the story floor.
export const flatTerrain=width=>({width,scale:1,stepHeight:34,platforms:[{id:'base',x1:0,x2:width,y1:0,y2:0}],ropes:[]});
export const cameraPanFor=(height,sceneHeight)=>Math.max(0,height-Math.max(100,sceneHeight-180));
export function projectTerrain(native,camera,projection,width){
 const world=flatTerrain(width);if(!native)return world;
 const {scale,left}=projection,{origin}=native;
 const x=v=>left+(v-origin.x)*scale,y=v=>(camera.groundY-v+origin.y)*scale;
 world.scale=scale;world.stepHeight=Math.max(18,34*scale);
 world.platforms.push(...native.footholds.filter(f=>f.x1!==f.x2).map(f=>({id:String(f.id),x1:x(f.x1),x2:x(f.x2),y1:Math.max(0,y(f.y1)),y2:Math.max(0,y(f.y2))})).filter(f=>Math.max(f.y1,f.y2)>2));
 world.ropes=native.ropes.map((r,index)=>({id:String(index),x:x(r.x),top:y(r.y1),bottom:Math.max(0,y(r.y2)),kind:r.isLadder?'ladder':'rope'})).filter(r=>r.top>r.bottom);
 return world;
}
export function surfaceY(surface,x,margin=0){
 const low=Math.min(surface.x1,surface.x2),high=Math.max(surface.x1,surface.x2);
 if(x<low-margin||x>high+margin)return null;
 return surface.y1+(surface.y2-surface.y1)*(x-surface.x1)/(surface.x2-surface.x1);
}
export function supportAt(world,x,y,preferred=null,tolerance=3){
 const candidates=world.platforms.map(s=>({surface:s,y:surfaceY(s,x,.5)})).filter(s=>s.y!==null&&Math.abs(s.y-y)<=tolerance);
 return candidates.find(s=>s.surface.id===preferred)||candidates.sort((a,b)=>b.y-a.y)[0]||null;
}
export function floorAt(world,x){return Math.max(0,...world.platforms.map(s=>surfaceY(s,x)).filter(y=>y!==null&&y>=0&&y<=world.stepHeight));}
export function stepSupport(world,fromX,toX,footY,preferred){
 return world.platforms.map(surface=>({surface,y:surfaceY(surface,toX),before:surfaceY(surface,fromX)}))
  .filter(s=>s.y!==null&&Math.abs(s.y-footY)<=world.stepHeight&&(s.surface.id===preferred||s.before===null||Math.abs(s.before-footY)<=3))
  .sort((a,b)=>b.y-a.y)[0]||null;
}
// Sweep the entire fall segment, so a fast frame cannot tunnel through a ledge.
export function landingOn(world,fromX,fromY,toX,toY,drop=false){
 if(toY>fromY)return null;const hits=[];
 for(const surface of world.platforms){
  if(drop&&surface.id!=='base')continue;
  const slope=(surface.y2-surface.y1)/(surface.x2-surface.x1),line=x=>surface.y1+(x-surface.x1)*slope;
  const before=fromY-line(fromX),after=toY-line(toX);
  if(before<-.01||after>.01||before===after)continue;
  const t=Math.max(0,Math.min(1,before/(before-after))),x=fromX+(toX-fromX)*t;
  if(t<.000001&&surfaceY(surface,toX)===null)continue;
  if(surfaceY(surface,x,.01)!==null)hits.push({surface,x,y:line(x),t});
 }
 return hits.sort((a,b)=>a.t-b.t)[0]||null;
}
export function nearbyRope(world,x,y,input){
 if(!input.up&&!input.down)return null;
 return world.ropes.filter(r=>Math.abs(r.x-x)<=16&&y>=r.bottom-50&&y<=r.top+8&&!(input.up&&!input.down&&y>=r.top-2))
  .sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0]||null;
}
