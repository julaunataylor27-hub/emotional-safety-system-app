import React,{useEffect,useState} from 'react';
import {View,Pressable,StyleSheet,Linking,BackHandler} from 'react-native';
import {AppText as Text,AppInput as TextInput} from './AppPreferences';
import {P} from './PresentationTheme';
const {DIRECTORY,REGIONS,CATEGORIES,EMERGENCY,filterServices}=require('./supportDirectory.cjs');

function LinkButton({id,label,url,open,secondary=false}) {
  return <Pressable testID={id} accessibilityRole="button" accessibilityLabel={label}
    onPress={()=>open(id,url)} style={({pressed})=>[styles.button,secondary&&styles.secondary,pressed&&{opacity:.75}]}>
    <Text style={[styles.buttonText,secondary&&styles.secondaryText]}>{label}</Text>
  </Pressable>;
}

function LinkFailure({error,open}) {
  return <View testID="support-link-error" accessibilityLiveRegion="polite" style={styles.error}>
    <Text style={styles.body}>Could not open this link. You can use the displayed contact manually or try again.</Text>
    <Text selectable style={styles.url}>{error.url}</Text>
    <LinkButton id="support-retry-link" label="Try link again" url={error.url} open={(id,url)=>open(error.id,url)} secondary/>
  </View>;
}

function ServiceCard({service,open,error}) {
  const [expanded,setExpanded]=useState(false);
  const prefix='support-'+service.id;
  return <View testID={prefix} style={styles.card}>
    <Text style={styles.category}>{service.category}</Text>
    <Text accessibilityRole="header" style={styles.serviceName}>{service.name}</Text>
    <Text style={styles.body}>{service.help}</Text>
    <Text style={styles.muted}><Text style={styles.strong}>For: </Text>{service.audience}</Text>
    <Text style={styles.muted}><Text style={styles.strong}>Hours: </Text>{service.hours}</Text>
    {service.contacts.map((contact,i)=><LinkButton key={contact.label} id={prefix+'-contact-'+i}
      label={contact.label+' · '+contact.number} url={contact.url} open={open}/>)}
    {error?.id.startsWith(prefix+'-')&&<LinkFailure error={error} open={open}/>}
    {!service.contacts.length&&<LinkButton id={prefix+'-website'} label={'Open '+service.name+' website'} url={service.website} open={open}/>}
    <Pressable testID={prefix+'-details-toggle'} accessibilityRole="button" accessibilityState={{expanded}}
      accessibilityLabel={(expanded?'Hide':'Show')+' details and sources for '+service.name}
      onPress={()=>setExpanded(x=>!x)} style={styles.detailsToggle}>
      <Text style={styles.detailsLabel}>{expanded?'Hide details and sources':'Details and sources'} {expanded?'−':'+'}</Text>
    </Pressable>
    {expanded&&<View testID={prefix+'-details'} style={styles.details}>
      {!!service.notes&&<Text style={styles.muted}>{service.notes}</Text>}
      <Text style={styles.checked}>Web checked {service.checked}.</Text>
      {!!service.contacts.length&&<LinkButton id={prefix+'-website'} label={'Open '+service.name+' website'} url={service.website} open={open} secondary/>}
      {service.extra_links.map((item,i)=><LinkButton key={item.url} id={prefix+'-extra-'+i} label={item.label} url={item.url} open={open} secondary/>)}
      <LinkButton id={prefix+'-source'} label={'Read verification source for '+service.name} url={service.source_url} open={open} secondary/>
      <Text selectable style={styles.url}>{service.source_url}</Text>
    </View>}
  </View>;
}

export default function SupportDirectoryScreen({filters,onChange,onBack,existingNationalResource}) {
  const [picker,setPicker]=useState('');
  const [error,setError]=useState(null);
  const region=REGIONS.find(item=>item.id===filters.region)||REGIONS[1];
  const category=CATEGORIES.find(item=>item.id===filters.category)||CATEGORIES[0];
  const services=filterServices(filters);
  const change=patch=>{setError(null);onChange({...filters,...patch});};
  useEffect(()=>{
    const sub=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(picker)setPicker('');else onBack();
      return true;
    });
    return ()=>sub.remove();
  },[picker,onBack]);
  const open=async(id,url)=>{
    setError(null);
    try {await Linking.openURL(url);}catch {setError({id,url});}
  };
  const showExisting=filters.region==='National'&&['all','wellbeing','first-nations'].includes(filters.category)
    &&(!filters.query.trim()||/13yarn|aboriginal|crisis/i.test(filters.query.trim()));
  return <View testID="support-directory-screen" style={styles.screen}>
    <View style={styles.emergency}>
      <Text style={styles.body}>Immediate danger or a life-threatening emergency</Text>
      <LinkButton id="support-emergency" label="Emergency · 000" url={EMERGENCY.contacts[0].url} open={open}/>
    </View>
    <Text style={styles.lead}>Find support across Australia.</Text>
    <Text style={styles.muted}>National services are available in every state and territory. Choose a location and the kind of help you want.</Text>
    <View style={styles.filters}>
      <Pressable testID="support-choose-region" accessibilityRole="button" accessibilityState={{expanded:picker==='region'}}
        accessibilityLabel={'Choose state or territory. Current: '+region.name}
        onPress={()=>setPicker(picker==='region'?'':'region')} style={styles.selector}>
        <Text style={styles.selectorLabel}>State or territory</Text><Text style={styles.selectorValue}>{region.name} {picker==='region'?'−':'+'}</Text>
      </Pressable>
      {picker==='region'&&<View testID="support-region-options" style={styles.regionGrid}>{REGIONS.map(item=><Pressable
        key={item.id} testID={'support-region-'+item.id} accessibilityRole="button"
        accessibilityLabel={item.name} accessibilityState={{selected:region.id===item.id}}
        onPress={()=>{change({region:item.id});setPicker('');}} style={[styles.regionOption,region.id===item.id&&styles.selected]}>
        <Text style={[styles.optionText,region.id===item.id&&styles.selectedText]}>{item.label}</Text>
      </Pressable>)}</View>}
      <Pressable testID="support-choose-category" accessibilityRole="button" accessibilityState={{expanded:picker==='category'}}
        accessibilityLabel={'Choose type of help. Current: '+category.label}
        onPress={()=>setPicker(picker==='category'?'':'category')} style={styles.selector}>
        <Text style={styles.selectorLabel}>Type of help</Text><Text style={styles.selectorValue}>{category.label} {picker==='category'?'−':'+'}</Text>
      </Pressable>
      {picker==='category'&&<View testID="support-category-options" style={styles.categoryOptions}>{CATEGORIES.map(item=><Pressable
        key={item.id} testID={'support-category-'+item.id} accessibilityRole="button" accessibilityLabel={item.label}
        accessibilityState={{selected:category.id===item.id}} onPress={()=>{change({category:item.id});setPicker('');}}
        style={[styles.categoryOption,category.id===item.id&&styles.selected]}>
        <Text style={[styles.optionText,category.id===item.id&&styles.selectedText]}>{item.label}</Text>
      </Pressable>)}</View>}
      <TextInput testID="support-search" accessibilityLabel="Search public support services" value={filters.query}
        onChangeText={query=>change({query})} placeholder="Search services or needs…" placeholderTextColor={P.muted}
        autoCorrect={false} maxLength={150} style={styles.search}/>
      {(filters.category!=='all'||!!filters.query)&&<Pressable testID="support-clear-filters" accessibilityRole="button"
        onPress={()=>change({category:'all',query:''})} style={styles.detailsToggle}>
        <Text style={styles.detailsLabel}>Clear search and type of help</Text>
      </Pressable>}
    </View>
    {error?.id==='support-emergency'&&<LinkFailure error={error} open={open}/>}
    <Text accessibilityRole="header" testID="support-results-heading" style={styles.results}>{region.name}</Text>
    <Text testID="support-results-count" style={styles.checked}>{services.length} matching {services.length===1?'entry':'entries'} · {category.label}</Text>
    {services.length===0&&<View testID="support-empty" style={styles.card}>
      <Text style={styles.body}>No matching entries in this section. Clear the filters or choose National for Australia-wide support.</Text>
      <LinkButton id="support-empty-national" label="Show national support" url="" open={()=>{change({region:'National',category:'all',query:''});setPicker('');}} secondary/>
    </View>}
    {services.map(service=><ServiceCard key={service.id} service={service} open={open} error={error}/>)}
    {showExisting&&existingNationalResource}
    <View style={styles.notice}>
      <Text style={styles.muted}>Tap a number to open your phone’s dialler. You decide whether to call. Your writing is not sent with these links.</Text>
      <Text style={styles.checked}>Directory web checked {DIRECTORY.checked}. Hours, eligibility, fees and availability can change. Confirm them with the service.</Text>
      <Text style={styles.checked}>Counselling, child-protection reporting and emergency response have different purposes. This directory is a starting point for finding help.</Text>
    </View>
  </View>;
}

const styles=StyleSheet.create({
  screen:{gap:12},lead:{fontSize:21,lineHeight:30,color:P.gold,fontWeight:'700'},
  body:{fontSize:16,lineHeight:25,color:P.text},muted:{fontSize:14,lineHeight:22,color:P.muted,marginTop:5},
  strong:{fontWeight:'700'},emergency:{backgroundColor:P.panel2,borderWidth:1,borderColor:P.red,borderRadius:18,padding:16},
  filters:{gap:9,marginVertical:5},selector:{minHeight:66,padding:14,borderRadius:14,backgroundColor:P.panel2,borderWidth:1,borderColor:P.line},
  selectorLabel:{fontSize:13,lineHeight:20,color:P.muted},selectorValue:{fontSize:16,lineHeight:24,color:P.text,fontWeight:'700',marginTop:3},
  regionGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},regionOption:{minWidth:'30%',flexGrow:1,minHeight:48,padding:12,borderWidth:1,borderColor:P.line,borderRadius:12,justifyContent:'center',alignItems:'center',backgroundColor:P.panel},
  categoryOptions:{gap:7},categoryOption:{minHeight:48,borderWidth:1,borderColor:P.line,borderRadius:12,padding:12,justifyContent:'center',backgroundColor:P.panel},
  optionText:{fontSize:14,lineHeight:22,color:P.text},selected:{backgroundColor:P.gold,borderColor:P.gold},selectedText:{color:P.bg,fontWeight:'700'},
  search:{fontSize:16,lineHeight:25,color:P.text,minHeight:54,borderWidth:1,borderColor:P.line,borderRadius:14,padding:14,backgroundColor:P.panel},
  card:{backgroundColor:P.panel,borderWidth:1,borderColor:P.line,borderRadius:18,padding:18,gap:5},
  category:{fontSize:13,lineHeight:20,color:P.gold},serviceName:{fontSize:20,lineHeight:28,color:P.text,fontWeight:'700'},
  button:{minHeight:48,paddingVertical:12,paddingHorizontal:14,borderRadius:12,backgroundColor:P.gold,justifyContent:'center',marginTop:8},
  buttonText:{fontSize:15,lineHeight:23,color:P.bg,fontWeight:'700',textAlign:'center'},secondary:{backgroundColor:P.panel2,borderWidth:1,borderColor:P.line},secondaryText:{color:P.text},
  detailsToggle:{minHeight:48,paddingVertical:12,justifyContent:'center'},detailsLabel:{fontSize:14,lineHeight:22,color:P.gold},details:{borderTopWidth:1,borderColor:P.line,paddingTop:9,gap:5},
  url:{fontSize:13,lineHeight:21,color:P.muted,marginTop:5},checked:{fontSize:13,lineHeight:21,color:P.muted},
  results:{fontSize:23,lineHeight:32,color:P.text,fontWeight:'700',marginTop:8},notice:{padding:16,borderRadius:14,backgroundColor:P.panel2,gap:8},
  error:{padding:16,borderRadius:14,borderWidth:1,borderColor:P.red,backgroundColor:P.panel},
});
