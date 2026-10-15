import React,{createContext,useContext,useEffect,useState,useCallback,forwardRef} from 'react';
import {Text as NativeText,TextInput as NativeInput,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFonts} from 'expo-font';
const M=require('./appPreferences.cjs');
const DEFAULT={preferences:M.DEFAULT_PREFERENCES,status:'ready',save:async()=>{},retry:()=>{},t:key=>M.translate('en',key),fontsLoaded:false};
const Context=createContext(DEFAULT);
export function PreferencesProvider({children,storage=AsyncStorage}){
 const [preferences,setPreferences]=useState(M.DEFAULT_PREFERENCES),[status,setStatus]=useState('loading');
 const [fontsLoaded]=useFonts({ESSBody:require('../assets/fonts/DM-Sans.ttf'),ESSHeading:require('../assets/fonts/Marcellus-Regular.ttf')});
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let live=true;setStatus('loading');storage.getItem(M.PREFERENCE_KEY).then(raw=>{const next=M.decodePreferences(raw);if(live){setPreferences(next);setStatus('ready');}}).catch(()=>{if(live)setStatus('load-error');});return()=>{live=false;};},[storage,attempt]);
 const save=useCallback(async next=>{if(status==='loading'||status==='load-error')throw Error('Load preferences before saving');const clean=M.normalisePreferences(next);await storage.setItem(M.PREFERENCE_KEY,JSON.stringify({version:1,preferences:clean}));setPreferences(clean);},[storage,status]);
 return <Context.Provider value={{preferences,status,save,retry:()=>setAttempt(x=>x+1),t:key=>M.translate(preferences.language,key),fontsLoaded}}>{children}</Context.Provider>;
}
export const useAppPreferences=()=>useContext(Context);
function flat(style){return StyleSheet.flatten?StyleSheet.flatten(style)||{}:Object.assign({},...[style].flat(Infinity).filter(x=>x&&typeof x==='object'));}
export const AppText=forwardRef(function AppText({style,...props},ref){
 const {preferences,fontsLoaded}=useAppPreferences(),current=flat(style),scale=preferences.readingSize==='large'?1.16:1;
 const size=typeof current.fontSize==='number'?Math.max(13,current.fontSize)*scale:undefined;
 const line=typeof current.lineHeight==='number'?Math.max(current.lineHeight*scale,(size||16)*1.35):size?size*1.5:undefined;
 return <NativeText ref={ref} {...props} style={[fontsLoaded&&{fontFamily:'ESSBody'},style,size&&{fontSize:size,lineHeight:line}]}/>;
});
export const AppInput=forwardRef(function AppInput({style,...props},ref){
 const {preferences,fontsLoaded}=useAppPreferences(),size=Math.max(16,flat(style).fontSize||16)*(preferences.readingSize==='large'?1.16:1);
 return <NativeInput ref={ref} {...props} style={[fontsLoaded&&{fontFamily:'ESSBody'},style,{fontSize:size,lineHeight:size*1.5}]}/>;
});
