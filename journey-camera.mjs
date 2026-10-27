// World positions use the existing percent-of-screen physics units. Only the
// camera changes their presentation; HUD and touch controls stay in screen space.
export function horizontalCamera(actorX,viewWidth,worldWidth){
 return Math.max(0,Math.min(Math.max(0,worldWidth-viewWidth),actorX/100*viewWidth-viewWidth*.5));
}
export function worldLimit(viewWidth,worldWidth,margin=6){
 return Math.max(94,worldWidth/Math.max(1,viewWidth)*100-margin);
}
export const screenActorX=(actorX,cameraX,viewWidth)=>actorX-cameraX/Math.max(1,viewWidth)*100;
// Keep a compact window around the authored scene focus. Raw map edges can
// contain transparent construction margins that were never intended as floor.
export function mapGroundSpan(camera,native){
 const runs=[];
 for(const f of (native?.footholds||[]).filter(f=>Math.abs(f.y1-f.y2)<1&&Math.abs(f.y1-native.origin.y-camera.groundY)<5)
  .map(f=>({left:Math.max(0,Math.min(f.x1,f.x2)-native.origin.x),right:Math.min(camera.width,Math.max(f.x1,f.x2)-native.origin.x)})).filter(f=>f.right>f.left).sort((a,b)=>a.left-b.left)){
  const last=runs.at(-1);if(last&&f.left<=last.right+1)last.right=Math.max(last.right,f.right);else runs.push(f);
 }
 const distance=r=>Math.max(r.left-camera.focusX,0,camera.focusX-r.right);
 return runs.sort((a,b)=>distance(a)-distance(b)||(b.right-b.left)-(a.right-a.left))[0]||{left:0,right:camera.width};
}
export function mobileMapWindow(camera,projection,viewWidth,native=null){
 const ground=mapGroundSpan(camera,native),span=ground.right-ground.left;
 const scale=Math.max(projection.scale,viewWidth/span),width=camera.width*scale;
 const worldWidth=Math.min(span*scale,Math.max(viewWidth,Math.floor(width*.5)));
 const start=Math.max(ground.left*scale,Math.min(ground.right*scale-worldWidth,camera.focusX*scale-worldWidth*.5));
 const foot=projection.top+camera.groundY*projection.scale;
 return {worldWidth,ground,projection:{...projection,scale,width,height:camera.height*scale,left:-start,top:foot-camera.groundY*scale}};
}
export function portalDirection(portalX,cameraX,viewWidth,open){
 if(!open||!Number.isFinite(portalX))return null;
 const x=portalX/100*viewWidth-cameraX;
 return x<0?'left':x>viewWidth?'right':null;
}
