// Fictional display readings for the portfolio interaction, not laboratory telemetry.
export const demoSensors = [
 {id:'temperature',label:'Temperature',short:'Temp',position:[0,155,74],value:'24.1',unit:'°C',detail:'Air temperature near the window.',status:'Within comfort range',trend:[22,22.4,23,22.8,23.3,23.5,23.2,23.7,24,24.1]},
 {id:'humidity',label:'Humidity',short:'Humidity',position:[0,89,63],value:'52',unit:'% RH',detail:'Relative humidity at the perimeter.',status:'Stable moisture level',trend:[55,54,53,54,52,51,52,53,52,52]},
 {id:'co2',label:'CO₂',short:'CO₂',position:[260,220,82],value:'682',unit:'ppm',detail:'Indoor carbon dioxide concentration.',status:'Ventilation demand: low',trend:[540,560,570,610,600,630,650,640,670,682]},
 {id:'occupancy',label:'Occupancy',short:'Occupancy',position:[140,120,126],value:'2',unit:'people',detail:'Estimated room occupancy.',status:'Lighting follows room use',trend:[0,0,1,1,2,2,1,2,2,2]},
 {id:'door',label:'Door contact',short:'Door',position:[0,25,96],value:'Closed',unit:'',detail:'Magnetic contact on the entrance door.',status:'Entrance contact connected',trend:[0,0,0,1,1,0,0,0,0,0]},
 {id:'water',label:'Water leak',short:'Water',position:[5,40,1],value:'Dry',unit:'',detail:'Leak detection at the wall–floor junction.',status:'No water detected',trend:[0,0,0,0,0,0,0,0,0,0]},
 {id:'gateway',label:'IoT gateway',short:'Gateway',position:[235,28,30],value:'7',unit:'nodes',detail:'Sensor messages feed the digital model.',status:'All demo nodes connected',trend:[5,5,6,6,6,7,7,7,7,7]},
];
export const roomProjection=(x:number,y:number,z=0)=>[48+x*.9+y*.5,194+x*.34-y*.3-z];
