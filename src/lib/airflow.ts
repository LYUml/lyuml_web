export type Opening='west'|'doorA'|'doorB'|'east';
export type Openings=Record<Opening,boolean>;
export const openingNames:Record<Opening,string>={west:'West window',doorA:'Door A',doorB:'Door B',east:'East window'};
export const ventilation=(state:Openings)=>{
 const reached=[state.west,false,state.east];
 for(let i=0;i<3;i++){
  if(state.doorA&&(reached[0]||reached[1]))reached[0]=reached[1]=true;
  if(state.doorB&&(reached[1]||reached[2]))reached[1]=reached[2]=true;
 }
 const cross=state.west&&state.east&&state.doorA&&state.doorB;
 return {zones:reached,cross,label:cross?'Cross ventilation':reached.some(Boolean)?'Partial ventilation':'No outdoor connection'};
};
export const openingTour:Openings[]=[
 {west:false,doorA:false,doorB:false,east:false},
 {west:true,doorA:false,doorB:false,east:false},
 {west:true,doorA:true,doorB:false,east:false},
 {west:true,doorA:true,doorB:true,east:false},
 {west:true,doorA:true,doorB:true,east:true},
 {west:false,doorA:true,doorB:true,east:true},
];
