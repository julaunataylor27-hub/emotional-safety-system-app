import {StyleSheet} from 'react-native';
import {HUMANITY} from './theme/AustralianHumanityTheme';
// All shared layout and colour overrides now read from one reviewed source.
export const P=HUMANITY.colours;
export function cleanLabel(value){if(typeof value!=='string')return value;const clean=value.replace(/\\n/g,'\n').replace(/[🌱❤️🌳🧠📖🎨🌏🛡🔗💡✦◉]+\s*/gu,'').trim();if(!/[a-z]/.test(clean)&&/[A-Z]{3}/.test(clean))return clean.toLowerCase().replace(/(^|[.!?]\s+|\n)([a-z])/g,(_,p,c)=>p+c.toUpperCase()).replace(/\b(pdf|ai|ei|wa|ndis)\b/gi,x=>x.toUpperCase());return clean;}
export function presentationStyles(input,core=true){
 const out={};
 const backgrounds=new Set(['#020609','#07141C','#0B1E2B','#08141C','#102A39','#102A38','#0A1B25','#0E2938','#0E2E44','#102838','#123047','#071B12','#081D14','#081E14','#082016','#082017','#071C13','#071C13','#071A12','#102119','#102719','#102B1B','#0B2518','#071D2C','#0A2117','#0A1C24']);
 for(const [key,raw] of Object.entries(input)){
  const s={...(StyleSheet.flatten?StyleSheet.flatten(raw):raw)};
  if(typeof s.fontSize==='number'){s.fontSize=Math.max(13,s.fontSize);s.lineHeight=Math.max(s.lineHeight||0,s.fontSize*1.42);s.fontFamily='ESSBody';if(Number(s.fontWeight)>700)s.fontWeight='700';}
  if(typeof s.backgroundColor==='string'&&backgrounds.has(s.backgroundColor.toUpperCase()))s.backgroundColor=P.panel;
  if(s.borderWidth&&s.borderColor)s.borderColor=P.line;
  if(s.textShadowRadius){s.textShadowRadius=0;s.textShadowColor='transparent';}
  if(s.shadowOpacity)s.shadowOpacity=0;
  out[key]=s;
 }
 const overrides={
  safe:{flex:1,backgroundColor:'#03070B'},scroll:{padding:16,paddingBottom:30,width:'100%',maxWidth:720,alignSelf:'center'},
  card:{backgroundColor:P.panel,borderColor:P.line,borderWidth:1,borderRadius:18,padding:16,marginBottom:12},
  body:{fontSize:16,lineHeight:25,color:P.text},bullet:{fontSize:15,lineHeight:24,color:P.text,marginVertical:5},
  cardTitle:{fontSize:19,lineHeight:26,color:P.text,fontWeight:'700',marginBottom:10,fontFamily:'ESSBody'},cardEyebrow:{fontSize:11,lineHeight:17,color:P.gold,marginBottom:8,letterSpacing:.9,fontWeight:'700'},
  primary:{minHeight:52,borderRadius:15,paddingHorizontal:17,paddingVertical:12,marginVertical:7},primaryText:{fontSize:15,lineHeight:22,textAlign:'center',fontWeight:'700'},
  input:{backgroundColor:P.bg,borderColor:P.line,color:P.text,fontSize:16,lineHeight:25,minHeight:140,padding:16},
  pill:{minHeight:46,justifyContent:'center',backgroundColor:P.panel,borderColor:P.line,paddingVertical:11},pillText:{color:P.text,fontSize:14,lineHeight:21},pillActive:{backgroundColor:'#315946',borderColor:P.gold},pillTextActive:{color:P.text},
  backTitle:{minHeight:48,marginBottom:14},backBtn:{width:44,height:44,borderRadius:22,borderColor:P.line},screenTitle:{fontSize:22,lineHeight:29,color:P.text,fontFamily:'ESSBody',fontWeight:'700'},
  menuRow:{backgroundColor:P.panel,borderColor:P.line,borderRadius:17,padding:14,minHeight:74,gap:12,marginBottom:9},menuTitle:{fontSize:16,lineHeight:22,color:P.text,fontWeight:'700'},menuSub:{fontSize:12.5,lineHeight:18,color:P.muted,marginTop:3},menuIcon:{width:44,height:44,borderRadius:22,backgroundColor:P.panel2,borderColor:P.line},
  humanityPage:{width:'100%',padding:0},humanityScreenHeader:{marginBottom:18,gap:12},humanityScreenTitle:{fontSize:25,lineHeight:33,color:P.text},humanityScreenStep:{fontSize:13,lineHeight:20,color:P.gold,letterSpacing:0.5},humanityBack:{width:48,height:48,borderRadius:24},
  stageLead:{fontSize:16,lineHeight:25,color:P.muted,textAlign:'left',marginBottom:18},humanitySectionLabel:{fontSize:14,lineHeight:22,color:P.gold,letterSpacing:1,marginTop:22,marginBottom:12},
  journeyTile:{minHeight:94,padding:16,borderRadius:18,borderColor:P.line,backgroundColor:P.panel,marginBottom:12,gap:14},journeyTileTitle:{fontSize:17,lineHeight:25,color:P.text},journeyTileSub:{fontSize:14,lineHeight:21,color:P.muted,marginTop:5},journeyTileIcon:{width:48,height:48,borderRadius:24,backgroundColor:P.panel2},
  journeyQuestion:{fontSize:17,lineHeight:25,color:P.text,marginTop:4,marginBottom:12},journeyInput:{fontSize:16,lineHeight:25,backgroundColor:P.bg,borderColor:P.line,minHeight:124,padding:15},journeyInputSingle:{fontSize:16,lineHeight:24,backgroundColor:P.bg,borderColor:P.line,minHeight:54},
  promptCard:{padding:18,gap:12,marginBottom:14,borderColor:P.line,backgroundColor:P.panel,borderRadius:18},promptNumber:{color:P.gold,fontSize:14,lineHeight:22},
  stageProgressWrap:{backgroundColor:P.panel,borderColor:P.line,padding:16,marginVertical:12},stageProgressLabel:{fontSize:13,lineHeight:20,letterSpacing:0.3},stageProgressCount:{fontSize:13,lineHeight:20},stageProgressText:{fontSize:14,lineHeight:21},
  stageProgressDot:{width:24,height:24},valueMeaning:{fontSize:13,lineHeight:20,color:P.muted},valueName:{fontSize:15,lineHeight:23,color:P.text},valueCard:{minHeight:132,padding:14,backgroundColor:P.panel,borderColor:P.line},
  primaryGold:{backgroundColor:P.gold,paddingHorizontal:14,minHeight:52,justifyContent:'center'},primaryGoldText:{color:'#102B23',fontSize:15,textAlign:'center'},secondaryGold:{borderColor:P.line,minHeight:52,paddingHorizontal:14,justifyContent:'center'},secondaryGoldText:{color:P.text,fontSize:15,textAlign:'center'},
  techBody:{fontSize:14,lineHeight:22,color:P.muted},techTitle:{fontSize:17,lineHeight:25,color:P.text,flex:1},techTitleRow:{flexWrap:'wrap',gap:8},techStatus:{fontSize:12,lineHeight:18,letterSpacing:0.1},techCard:{padding:17,marginBottom:12,minHeight:108,backgroundColor:P.panel},
  learningHero:{height:230,borderRadius:22,overflow:'hidden',padding:18,justifyContent:'flex-end',marginBottom:14},learningHeroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,24,18,0.62)'},learningHeroKicker:{fontSize:13,lineHeight:20,letterSpacing:0.4,color:P.gold},learningHeroTitle:{fontSize:29,lineHeight:36,color:P.text},learningHeroText:{fontSize:16,lineHeight:25,color:P.text},
  aboutBrandHero:{height:210,borderRadius:22,padding:18,justifyContent:'flex-end'},aboutBrandTitle:{fontSize:26,lineHeight:34,color:P.text},aboutLead:{fontSize:16,lineHeight:25,color:P.muted,textAlign:'left'},aboutTile:{width:'100%',minHeight:122,padding:20,backgroundColor:P.panel,borderColor:P.line,alignItems:'flex-start'},aboutTitle:{fontSize:18,lineHeight:26,textAlign:'left'},aboutText:{fontSize:15,lineHeight:23,textAlign:'left'},
  infoBox:{backgroundColor:P.panel2,borderColor:P.line,padding:16},infoText:{fontSize:14,lineHeight:22,color:P.muted},tabRow:{flexWrap:'wrap',gap:8},tab:{minWidth:70,minHeight:46,justifyContent:'center',backgroundColor:P.panel2},tabOn:{backgroundColor:P.gold},tabText:{fontSize:14,lineHeight:22,color:P.text},tabTextOn:{fontSize:14,lineHeight:22,color:P.bg},
  signalRow:{flexWrap:'wrap',gap:8,marginVertical:12},signalName:{fontSize:14,lineHeight:21,width:92},riskText:{fontSize:12,lineHeight:18},signalIcon:{width:34,height:34},
  flowBox:{padding:18,gap:15,backgroundColor:P.panel,borderColor:P.line},flowTitle:{fontSize:17,lineHeight:25},flowSub:{fontSize:14,lineHeight:22,flexShrink:1},
  progressSmall:{fontSize:13,lineHeight:20,color:P.muted},progressTitle:{fontSize:16,lineHeight:24},progressCard:{backgroundColor:P.panel,borderColor:P.line,padding:18},
  projectTitle:{fontSize:14,lineHeight:21},projectCard:{minHeight:125,padding:16,backgroundColor:P.panel,borderColor:P.line},shareText:{fontSize:16,lineHeight:24},shareRow:{minHeight:54,backgroundColor:P.panel,borderColor:P.line},
  chapterLine:{fontSize:15,lineHeight:25},promiseLine:{fontSize:15,lineHeight:25},legacyText:{fontSize:16,lineHeight:25},legacyTitle:{fontSize:23,lineHeight:31},
 };
 const details={body:{fontSize:16,lineHeight:26,color:P.text},bullet:{fontSize:15,lineHeight:24,color:P.text},mini:{fontSize:13,lineHeight:21,color:P.muted},footerText:{fontSize:13,lineHeight:21,color:P.muted},input:{fontSize:16,lineHeight:25,color:P.text},button:{minHeight:48},choice:{minHeight:48},choiceText:{fontSize:14,lineHeight:22}};
 for(const [key,change] of Object.entries(core?overrides:details))if(core||out[key])out[key]={...out[key],...change};
 return out;
}
