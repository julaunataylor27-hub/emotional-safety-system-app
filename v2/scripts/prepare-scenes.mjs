// ESS v2 visual assets: public Creative Commons photographs from Wikimedia Commons.
// Downloaded only by developers / CI. Finished APK bundles files for offline use.
// Full source, photographer, license and change notes: docs/ESS_V2_PHOTO_CREDITS.md.
// Fail closed if an image is missing, unexpected, or inaccessible; never substitute legacy v1 art.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets','scenes');
const scenes=[
 ['home-coast','The Gap, Torndirrup National Park, Albany, Western Australia.jpg'],
 ['journal-banksia','Australian native Banksia flower.jpg'],
 ['learn-coast','Kalbarri NP Coastal.jpg'],
 ['support-gorge','Joffre Gorge.jpg'],
 ['more-stars','Leeman Salt Lake - Flickr - leonelpc24.jpg'],
 ['culture-flora','Banksia obovata habit.jpg'],
 ['history-country','OIC kalbarri NP road to coast.jpg'],
 ['emotions-flower','Banksia media.jpg'],
 ['rights-parliament','Parliament House Canberra.jpg'],
 ['everyday-landscape','Pinnacles Desert, Western Australia.jpg']
];
const headers={'User-Agent':'ESS-v2-Prototype/0.2 (https://github.com/julaunataylor27-hub/emotional-safety-system-app; Wikimedia attribution in docs/ESS_V2_PHOTO_CREDITS.md)',Accept:'application/json,image/jpeg,*/*'};
async function readUrl(url){
 const response=await fetch(url,{headers,signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error(`HTTP ${response.status} ${url}`);
 return response;
}
async function download(name,source){
 const dest=path.join(dir,name+'.jpg');
 try{
  const b=await readFile(dest);
  if(b.length>10000&&b[0]===255&&b[1]===216&&b[2]===255){
   console.log('Existing valid asset:',name);return;
  }
 }catch{}
 const api=new URL('https://commons.wikimedia.org/w/api.php');
 api.searchParams.set('action','query');
 api.searchParams.set('format','json');
 api.searchParams.set('prop','imageinfo');
 api.searchParams.set('iiprop','url');
 api.searchParams.set('iiurlwidth','1400');
 api.searchParams.set('titles','File:'+source);
 let imageUrl;
 try{
  const response=await readUrl(api.toString());
  const data=await response.json();
  const page=Object.values(data.query?.pages||{})[0];
  imageUrl=page?.imageinfo?.[0]?.thumburl||page?.imageinfo?.[0]?.url;
  if(!imageUrl)throw Error('No imageinfo from Wikimedia API');
 }catch(err){
  console.warn('API lookup failed; trying Wikimedia redirect',source,String(err));
  imageUrl='https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(source)+'?width=1400';
 }
 const response=await readUrl(imageUrl);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length<10000||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255){
  throw Error('Missing or invalid JPEG for '+source+'; refusing to build with old artwork');
 }
 await writeFile(dest,bytes);
 console.log('Prepared licensed image:',name,bytes.length);
}
await mkdir(dir,{recursive:true});
for(const [name,source] of scenes)await download(name,source);
console.log(`Prepared ${scenes.length} distinct ESS v2 photos`);
