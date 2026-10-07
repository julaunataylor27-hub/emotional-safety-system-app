import React,{useEffect,useMemo,useRef,useState} from 'react';
import {View,Text,Pressable,PanResponder,Animated,StyleSheet} from 'react-native';
import {Canvas,Group,Path,Circle,LinearGradient,RadialGradient} from '@shopify/react-native-skia';
import Svg,{Path as SvgPath,Circle as SvgCircle} from 'react-native-svg';
import {GRAPHIC_COLOURS,reflectionGeometry,confineReflectionPoint,nearestReflectionCorner,linePath} from './reflectionGeometry';

const SYMBOLS={
  truth:'M12 2 21 12 12 22 3 12 Z M12 2 V22 M3 12 H21',
  values:'M12 20 C8 17 3 14 3 8 C3 3 9 2 12 7 C15 2 21 3 21 8 C21 14 16 17 12 20 Z',
  beliefs:'M12 3 22 8 12 13 2 8 Z M2 12 12 17 22 12 M2 16 12 21 22 16',
  faith:'M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 Z',
  care:'M12 20 C8 17 3 14 3 8 C3 3 9 2 12 7 C15 2 21 3 21 8 C21 14 16 17 12 20 Z',
  pressure:'M5 4 V15 M12 2 V13 M19 4 V15 M5 20 V20.1 M12 18 V18.1 M19 20 V20.1',
  freedom:'M4 12 H20 M15 7 20 12 15 17 M4 5 V19'
};
function Symbol({name,colour,size=19}) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}><SvgPath d={SYMBOLS[name]} stroke={colour} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" fill="none"/></Svg>;
}
function Light({point,focus,reduceMotion}) {
  const scale=useRef(new Animated.Value(1)).current;
  useEffect(()=>{
    scale.stopAnimation();
    if(reduceMotion){scale.setValue(1);return;}
    scale.setValue(1.15);
    const animation=Animated.timing(scale,{toValue:1,duration:280,useNativeDriver:true});
    animation.start();return ()=>animation.stop();
  },[focus,reduceMotion,scale]);
  return <Animated.View testID="reflection-light" pointerEvents="none" style={{position:'absolute',left:point.x-15,top:point.y-15,width:30,height:30,transform:[{scale}]}}>
    <Svg width={30} height={30} viewBox="0 0 30 30" accessible={false}>
      <SvgCircle cx={15} cy={15} r={13} fill="#132B27" stroke="#FFE8AE" strokeWidth={1.5}/>
      <SvgPath d="M15 5 18 12 25 15 18 18 15 25 12 18 5 15 12 12 Z" fill="#FFF2C8"/>
      <SvgCircle cx={15} cy={15} r={3} fill="#FFFFFF"/>
    </Svg>
  </Animated.View>;
}
export function GraphicsMotionControl({reduceMotion,systemReduced,onToggle}) {
  return <View style={styles.motion}>
    <Pressable accessibilityRole="switch" accessibilityLabel="Reduce motion" accessibilityState={{checked:reduceMotion,disabled:systemReduced}} disabled={systemReduced} onPress={onToggle} style={styles.motionButton}>
      <Text style={styles.motionText}>Reduce motion</Text><Text style={styles.motionValue}>{reduceMotion?'On':'Off'}</Text>
    </Pressable>
    <Text style={styles.motionHint}>{systemReduced?'Your phone’s reduced-motion setting is respected.':'On keeps the light still between your touches. You can still drag or tap a corner.'}</Text>
  </View>;
}
export function ReflectionScene({geometry,point,focus}) {
  const {width,height,centre,facets,vertices,kind}=geometry;
  const shades=kind==='diamond'?['#6E541F','#244C45','#19463E','#826B37','#CDBD82','#46766E','#2B5C4E','#B49A58']:['#6D4853','#4B4932','#284D53','#574154','#755062','#545338','#396A72','#6B5564'];
  const glow=GRAPHIC_COLOURS[focus];
  return <Canvas testID={kind+'-skia-artwork'} style={{width,height}} accessible={false}>
    <Circle cx={centre.x} cy={centre.y} r={width*.48}><RadialGradient c={centre} r={width*.48} colors={['#184337','#0A221C','#071B16']}/></Circle>
    {[.38,.46].map(r=><Circle key={r} cx={centre.x} cy={centre.y} r={width*r} color="#315449" style="stroke" strokeWidth={.6} opacity={.38}/>)}
    <Group>
      {facets.map((facet,index)=><Path key={index} path={facet.path} opacity={kind==='diamond'?.94:.7}>
        <LinearGradient start={{x:width*.24,y:height*.13}} end={{x:width*.72,y:height*.88}} colors={[shades[facet.shade%shades.length],'#102F29']}/>
      </Path>)}
      <Path path={geometry.outline} color={kind==='diamond'?'#EED18A':'#97B7A6'} style="stroke" strokeWidth={1.4} strokeJoin="round"/>
      {geometry.seams.map((path,index)=><Path key={index} path={path} color="#DFE7C8" opacity={kind==='diamond'?.28:.12} style="stroke" strokeWidth={.8}/>)}
      {kind==='triangle'&&geometry.edges.map((path,index)=><Path key={index} path={path} color={[GRAPHIC_COLOURS.care,GRAPHIC_COLOURS.pressure,GRAPHIC_COLOURS.freedom][index]} style="stroke" strokeWidth={2.1} strokeCap="round"/>)}
      <Group clip={geometry.outline}>
        <Circle cx={point.x} cy={point.y} r={width*.34}>
          <RadialGradient c={point} r={width*.34} colors={['#FFE3A14A','#FFE3A10F','#FFE3A100']}/>
        </Circle>
        <Path path={linePath(centre,point)} color="#FFF0B5" opacity={.28} style="stroke" strokeWidth={1}/>
      </Group>
    </Group>
    {Object.entries(vertices).map(([key,vertex])=><Group key={key}>
      {focus===key&&<Circle cx={vertex.x} cy={vertex.y} r={24}><RadialGradient c={vertex} r={24} colors={[GRAPHIC_COLOURS[key]+'55',GRAPHIC_COLOURS[key]+'00']}/></Circle>}
      <Circle cx={vertex.x} cy={vertex.y} r={10} color="#0D2823"/>
      <Circle cx={vertex.x} cy={vertex.y} r={10} color={GRAPHIC_COLOURS[key]} style="stroke" strokeWidth={focus===key?2.3:1.4}/>
      <Circle cx={vertex.x} cy={vertex.y} r={3} color={GRAPHIC_COLOURS[key]} opacity={focus===key?1:.55}/>
    </Group>)}
    <Circle cx={point.x} cy={point.y} r={33}><RadialGradient c={point} r={33} colors={[glow+'66',glow+'00']}/></Circle>
  </Canvas>;
}
export default function ReflectionArtwork({kind,labels,onFocus,reduceMotion,centreWord}) {
  const [width,setWidth]=useState(280),[focus,setFocus]=useState(kind==='diamond'?'truth':'care');
  const geometry=useMemo(()=>reflectionGeometry(kind,width),[kind,width]);
  const [point,setPoint]=useState(kind==='triangle'?geometry.vertices.care:geometry.centre);
  const drag=useRef({});
  const select=key=>{
    const scene=drag.current.geometry;
    setPoint({...scene.vertices[key]});setFocus(key);drag.current.focus=key;onFocus(key);
  };
  Object.assign(drag.current,{geometry,point,focus,select,onFocus});
  const responder=useRef(null);
  if(!responder.current)responder.current=PanResponder.create({
    onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
    onPanResponderGrant:()=>{drag.current.start={...drag.current.point};},
    onPanResponderMove:(_,gesture)=>{
      const next=confineReflectionPoint({x:drag.current.start.x+gesture.dx,y:drag.current.start.y+gesture.dy},drag.current.geometry);
      drag.current.point=next;setPoint(next);
    },
    onPanResponderRelease:()=>{
      const key=nearestReflectionCorner(drag.current.point,drag.current.geometry);
      drag.current.focus=key;setFocus(key);drag.current.onFocus(key);
    },
    onPanResponderTerminationRequest:()=>false,onShouldBlockNativeResponder:()=>true
  });
  return <View style={styles.artwork}>
    {kind==='triangle'&&<Text style={[styles.topLabel,{color:GRAPHIC_COLOURS.care}]}>{labels.care}</Text>}
    <View testID={kind==='diamond'?'diamond-canvas':'reflection-triangle'} accessible accessibilityRole="adjustable" accessibilityLabel={kind==='diamond'?'Diamond reflection corner':'Triangle reflection focus'} accessibilityValue={{text:labels[focus]}} accessibilityHint="Use the corner buttons below, or adjust to change the reflection question." accessibilityActions={[{name:'increment',label:'Next corner'},{name:'decrement',label:'Previous corner'}]} onAccessibilityAction={event=>{
      const keys=drag.current.geometry.keys,direction=event.nativeEvent.actionName==='decrement'?-1:1;
      drag.current.select(keys[(keys.indexOf(drag.current.focus)+direction+keys.length)%keys.length]);
    }} onLayout={event=>{
      const next=event.nativeEvent.layout.width;
      if(Number.isFinite(next)&&next>0&&next!==width){
        const updated=reflectionGeometry(kind,next);
        setPoint(confineReflectionPoint({x:drag.current.point.x/width*next,y:drag.current.point.y/geometry.height*updated.height},updated));setWidth(next);
      }
    }} style={{width:'100%',height:geometry.height}} {...responder.current.panHandlers}>
      <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFillObject}>
        <ReflectionScene geometry={geometry} point={point} focus={focus}/>
        {kind==='diamond'&&<>
          <Text style={[styles.vertex,{top:3,left:width/2-70,width:140,color:GRAPHIC_COLOURS.truth}]}>Truth</Text>
          <Text style={[styles.vertex,{top:geometry.height/2+19,left:0,width:84,color:GRAPHIC_COLOURS.values}]}>Values</Text>
          <Text style={[styles.vertex,{top:geometry.height/2+19,right:0,width:84,color:GRAPHIC_COLOURS.beliefs}]}>Beliefs</Text>
          <Text style={[styles.vertex,{bottom:3,left:width/2-70,width:140,color:GRAPHIC_COLOURS.faith}]}>Faith / Hope</Text>
        </>}
        <Light point={point} focus={focus} reduceMotion={reduceMotion}/>
        {kind==='triangle'&&<View style={[styles.centre,{top:geometry.height*.42,left:width*.18,width:width*.64}]}><Text style={styles.caption}>WORD TO EXPLORE</Text><Text style={styles.word}>{centreWord}</Text></View>}
      </View>
    </View>
    {kind==='triangle'&&<View style={styles.bottomLabels}><Text style={[styles.bottomLabel,{color:GRAPHIC_COLOURS.pressure}]}>{labels.pressure}</Text><Text style={[styles.bottomLabel,{color:GRAPHIC_COLOURS.freedom}]}>{labels.freedom}</Text></View>}
    <View style={styles.buttons}>{geometry.keys.map(key=><Pressable key={key} accessibilityRole="button" accessibilityState={{selected:focus===key}} onPress={()=>select(key)} style={[styles.cornerButton,{borderColor:focus===key?GRAPHIC_COLOURS[key]:'#3B6152',backgroundColor:focus===key?'#1D3E32':'#102C24'}]}>
      <Symbol name={key} colour={GRAPHIC_COLOURS[key]}/><Text style={styles.buttonText}>{labels[key]}</Text>
    </Pressable>)}</View>
  </View>;
}
const styles=StyleSheet.create({
  artwork:{marginVertical:12},topLabel:{textAlign:'center',fontSize:14,fontWeight:'700',marginBottom:2},
  vertex:{position:'absolute',textAlign:'center',fontSize:14,fontWeight:'700'},
  bottomLabels:{flexDirection:'row',gap:12,marginBottom:12},bottomLabel:{flex:1,fontSize:13,lineHeight:20,fontWeight:'700',textAlign:'center'},
  centre:{position:'absolute',borderWidth:1,borderColor:'#749384',borderRadius:18,paddingVertical:12,paddingHorizontal:10,backgroundColor:'#102C25'},
  caption:{fontSize:10,fontWeight:'700',letterSpacing:1,color:'#BED0C2',textAlign:'center'},word:{fontSize:17,lineHeight:23,fontWeight:'800',color:'#FFF0CA',textAlign:'center',marginTop:5},
  buttons:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:12},cornerButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,borderWidth:1,borderRadius:14,padding:12,minHeight:48},buttonText:{fontSize:14,fontWeight:'700',color:'#FFF0CA',flexShrink:1},
  motion:{marginBottom:16},motionButton:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderWidth:1,borderColor:'#58735F',backgroundColor:'#102B23',borderRadius:14,padding:14,minHeight:48},motionText:{color:'#E7EFDF',fontSize:14,fontWeight:'700'},motionValue:{color:'#FFE29A',fontSize:14,fontWeight:'800'},motionHint:{color:'#BFCDBE',fontSize:13,lineHeight:20,marginTop:6}
});
