import {useEffect,useState} from 'react';
import {AccessibilityInfo} from 'react-native';

export default function useGraphicsMotion() {
  // Start still while the phone's preference is being read.
  const [systemReduced,setSystemReduced]=useState(true);
  const [manualReduced,setManualReduced]=useState(false);
  useEffect(()=>{
    let live=true,changed=false;
    const subscription=AccessibilityInfo.addEventListener('reduceMotionChanged',value=>{
      changed=true;if(live)setSystemReduced(!!value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value=>{
      if(live&&!changed)setSystemReduced(!!value);
    }).catch(()=>{});
    return ()=>{live=false;subscription.remove();};
  },[]);
  return {reduceMotion:systemReduced||manualReduced,systemReduced,toggle:()=>setManualReduced(value=>!value)};
}
