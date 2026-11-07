import {floorAt} from './journey-terrain.mjs?v=b2f5ac70167e4e97';

export const portalSurface=(terrain,width,portalX=88)=>floorAt(terrain,width*portalX/100);
export function portalFrameGeometry(frame,mobile=false){
 const scale=mobile?.73:.95;
 return {width:frame.width*scale,height:frame.height*scale,originX:frame.origin.x*scale,bottom:(frame.origin.y-frame.height)*scale};
}
