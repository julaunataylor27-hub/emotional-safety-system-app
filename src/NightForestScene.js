import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Defs,LinearGradient,Stop,Rect,Path,Circle,Ellipse,G} from 'react-native-svg';

// All scenery is native SVG, not a screenshot: every control drawn above it remains accessible and clickable.
const STARS=Array.from({length:85},(_,i)=>{
 const x=(i*73+29+(i*i*7)%211)%398,y=(i*47+11+(i*i*13)%97)%169;
 return {x,y,r:i%8===0?1.5:0.65,op:i%7===0?.82:.32};
});
function branch(x,y,len,angle,depth,seed,paths,leaves){
 if(depth===0) {for(let k=0;k<5;k++){
  const a=(seed*7+k*11)%6.2832, r=5+(k*3+seed)%17;
  leaves.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,r:2.5+(k%3),tone:(seed+k)%3});
 } return;}
 const nx=x+Math.cos(angle)*len,ny=y+Math.sin(angle)*len;
 paths.push({d:`M ${x.toFixed(2)} ${y.toFixed(2)} Q ${((x+nx)/2+seed%5-2).toFixed(2)} ${((y+ny)/2).toFixed(2)} ${nx.toFixed(2)} ${ny.toFixed(2)}`,width:Math.max(.8,depth*1.55)});
 const children=depth>2?3:2;
 for(let j=0;j<children;j++)branch(nx,ny,len*(.62+(j%2)*.055),angle+(-1+j)*(0.33+((seed+j)%3)*.08),depth-1,seed*3+j+1,paths,leaves);
}
const BRANCHES=[],LEAVES=[];
branch(113,219,43,-Math.PI/2,4,3,BRANCHES,LEAVES);
const PINES=Array.from({length:19},(_,i)=>({x:i*24-10,scale:.45+(i%5)*.12}));
export default function NightForestScene({height=260,style,testID,accessibilityLabel,fade=true}){
 return <View accessible testID={testID} accessibilityLabel={accessibilityLabel||'Illustrated golden tree and moonlit water'} style={[styles.wrap,{height},style]}>
  <Svg viewBox="0 0 400 270" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" accessible={false}>
    <Defs>
      <LinearGradient id="skyNight" x1="0" x2="0.1" y1="0" y2="1"><Stop offset="0" stopColor="#051321"/><Stop offset=".65" stopColor="#0B2631"/><Stop offset="1" stopColor="#17413D"/></LinearGradient>
      <LinearGradient id="waterNight" x1="0" x2="0" y1="0" y2="1"><Stop offset="0" stopColor="#133B40"/><Stop offset="1" stopColor="#061D21"/></LinearGradient>
      <LinearGradient id="fadeNight" x1="0" x2="0" y1="0" y2="1"><Stop offset="0" stopColor="#041914" stopOpacity="0"/><Stop offset="1" stopColor="#041914" stopOpacity="1"/></LinearGradient>
      <LinearGradient id="goldBark" x1="0" x2="1" y1="0" y2="1"><Stop offset="0" stopColor="#D79642"/><Stop offset=".5" stopColor="#FFE3A0"/><Stop offset="1" stopColor="#7E4C22"/></LinearGradient>
    </Defs>
    <Rect width="400" height="270" fill="url(#skyNight)"/>
    {STARS.map((s,i)=><Circle key={'s'+i} cx={s.x} cy={s.y} r={s.r} fill="#FBEFD5" opacity={s.op}/>)}
    <Circle cx="327" cy="66" r="28" fill="#D7AF67" opacity=".07"/>
    <Circle cx="327" cy="66" r="18" fill="#F6E1A8"/>
    <Circle cx="320" cy="62" r="4.5" fill="#E8C98A" opacity=".52"/>
    <Circle cx="334" cy="71" r="3.5" fill="#E5C48A" opacity=".45"/>
    <Path d="M0 179L32 135L62 157L102 108L143 157L193 129L233 167L282 118L337 159L368 136L400 167V227H0Z" fill="#082330"/>
    <Path d="M0 196L66 153L119 197L185 158L253 198L328 161L400 200V240H0Z" fill="#102F33"/>
    {PINES.map((p,i)=><G key={'p'+i} transform={`translate(${p.x} 187) scale(${p.scale})`} opacity=".84"><Path d="M0 34L11 4L5 4L19 -25L32 4L26 4L39 34Z" fill="#071F24"/><Rect x="17" y="25" width="4" height="21" fill="#071F24"/></G>)}
    <Rect x="0" y="216" width="400" height="54" fill="url(#waterNight)"/>
    {Array.from({length:18},(_,i)=><Path key={'w'+i} d={`M ${235+i*8} ${223+i*2.4} q ${12+i%7} 1 ${23+i%12} 0`} stroke="#FAD58A" strokeWidth={i%3===0?1.2:.65} opacity={.21+(i%4)*.1}/>)}
    <Path d="M0 242 Q39 205 75 227 Q115 210 158 228 Q175 213 200 233 L244 270 H0Z" fill="#091C1E"/>
    <Ellipse cx="110" cy="224" rx="69" ry="10" fill="#E1B461" opacity=".14"/>
    <Path d="M109 222Q111 177 113 141" stroke="url(#goldBark)" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {BRANCHES.map((b,i)=><Path key={'b'+i} d={b.d} stroke="url(#goldBark)" strokeWidth={b.width} fill="none" strokeLinecap="round" opacity=".88"/>)}
    {LEAVES.map((l,i)=><Circle key={'l'+i} cx={l.x} cy={l.y} r={l.r+(i%8===0?2:0)} fill={l.tone===0?'#FFF1B9':l.tone===1?'#EBC66B':'#B9933D'} opacity={i%9===0?.95:.70}/>)}
    {Array.from({length:27},(_,i)=><Circle key={'f'+i} cx={(i*41+17)%256} cy={132+(i*27)%116} r={i%6===0?1.7:1} fill="#FFE6A0" opacity={.3+(i%5)*.12}/>)}
    {fade&&<Rect y="210" width="400" height="60" fill="url(#fadeNight)"/>}
  </Svg>
 </View>;
}
const styles=StyleSheet.create({wrap:{overflow:'hidden',width:'100%',backgroundColor:'#071E27'}});
