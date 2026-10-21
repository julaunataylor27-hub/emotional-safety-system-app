/* Ancient animals learning records · 21 October 2026.
 * The data distinguishes fossils, reasoned reconstruction and attributed cultural knowledge.
 * External images and cultural artwork are not reproduced without reuse permission.
 */
const META=Object.freeze({
 title:'Ancient Australian Animals & Evidence',
 status:'Educational research draft · 21 October 2026',
 lead:'Discover extinct animals through fossil discoveries, original simple illustrations and museum evidence.',
 scope:'Selected examples, not a complete animal list, a local Country map or a claim that all species survived until one date.',
 artwork:'The coloured silhouettes are original learning illustrations, not fossil photographs or scientifically precise reconstructions. Follow the museum links to see attributed specimens and reconstructions.',
 overlap:'First Nations people have lived on the Australian continent for tens of thousands of years. Some megafauna overlapped with people in time. This alone cannot prove which species particular communities encountered.',
});

const SOURCES=Object.freeze({
 evidence:{label:'Queensland Museum · Fossils in the megafauna collections',url:'https://www.museum.qld.gov.au/collections-and-research/explore/megafauna'},
 country:{label:'National Museum of Australia · Ancient Sahul maps',url:'https://digital-classroom.nma.gov.au/learning-modules/1/migration-sahul'},
 pangaea:{label:'Australian Museum · Pangaea and Gondwana',url:'https://australian.museum/learn/dinosaurs/mesozoic-era/'},
 yamuti:{label:'Jacinta Koolmatrie · The Yamuti and Diprotodon (Australian Museum)',url:'https://australian.museum/learn/first-nations/yamuti/'},
});
const ANIMALS=Object.freeze([
 {id:'thylacoleo',name:'Marsupial lion',scientific:'Thylacoleo carnifex',type:'Meat-eating marsupial',
  time:'Pleistocene · about 1.6 million to 40,000 years ago',
  summary:'An unusually powerful marsupial predator, with large slicing cheek teeth and a heavy gripping thumb claw.',
  fossil:'Fossil jaws, skulls and skeletons establish its distinctive teeth, limbs and claws. Fossils occur in caves, including in southern Australia.',
  interpretation:'How it hunted or scavenged is reconstructed from its anatomy. The fossil record does not show every encounter between predators.',
  question:'What could have eaten a marsupial lion? A crocodile or another large predator might have threatened young or vulnerable animals, but a particular predator-prey encounter needs direct evidence.',
  source:'https://australian.museum/learn/australia-over-time/evolving-landscape/the-pleistocene-epoch/'},
 {id:'diprotodon',name:'Diprotodon',scientific:'Diprotodon optatum',type:'Plant-eating giant marsupial',
  time:'Pleistocene · Queensland Museum estimates about 1 million to 40,000 years ago',
  summary:'Australia’s largest known marsupial, a distant relative of wombats and koalas, that walked on four legs.',
  fossil:'Skulls, jaws and postcranial remains support a massive four-legged plant eater; numerous museum reconstructions show its likely proportions.',
  interpretation:'Fur colour, soft-tissue appearance and exact extinction timing remain less certain than the bones themselves.',
  question:'Could Diprotodon have met people? Some evidence points to broad overlap with humans, but not every region or specimen can be dated to the same time.',
  source:'https://www.museum.qld.gov.au/learn-and-discover/queenslands-ancient-past/meet-the-megafauna/diprotodon-optatum'},
 {id:'procoptodon',name:'Giant short-faced kangaroo',scientific:'Procoptodon goliah',type:'Plant-eating kangaroo relative',
  time:'Pleistocene · fossils include material from the Nullarbor in Western Australia',
  summary:'A heavily built, short-faced kangaroo relative, up to about two metres tall.',
  fossil:'Fossils from the Nullarbor include unusually complete skeletons. Its skull, hands and feet differ markedly from living kangaroos.',
  interpretation:'Its feeding style is inferred from the teeth and limbs; researchers reconstruct how it moved from its skeleton.',
  question:'Why is the Nullarbor important? Fossils from caves there preserve anatomical clues rarely available from isolated bones.',
  source:'https://australian.museum/learn/australia-over-time/extinct-animals/procoptodon-goliah/'},
 {id:'genyornis',name:'Giant flightless bird',scientific:'Genyornis newtoni',type:'Large flightless bird',
  time:'Late Pleistocene · overlapped with human occupation in Australia',
  summary:'A heavily built flightless bird more than two metres tall, with large legs and small wings.',
  fossil:'Bones, skeletons and eggshell fragments preserve evidence of its size, anatomy and breeding.',
  interpretation:'Details of diet and behaviour are researched from beak anatomy, fossils and comparisons with other birds.',
  question:'What do eggshells tell us? They offer a different kind of fossil evidence, but the identity and age of individual finds require careful study.',
  source:'https://australian.museum/learn/australia-over-time/extinct-animals/genyornis-newtoni/'},
 {id:'varanus',name:'Giant goanna',scientific:'Varanus priscus (Megalania)',type:'Meat-eating monitor lizard',
  time:'Pleistocene · Queensland Museum estimates 500,000 to 40,000 years ago',
  summary:'An enormous extinct monitor lizard with curved, serrated teeth suited to gripping and tearing meat.',
  fossil:'Teeth, jaws and other bones have been found in central and eastern Australia, including the Naracoorte area.',
  interpretation:'Its maximum size and whether its saliva contained venom remain subjects of reconstruction or research.',
  question:'Could it have threatened other megafauna? It was likely a predator or scavenger; exact ancient feeding events need fossil evidence.',
  source:'https://www.museum.qld.gov.au/learn-and-discover/queenslands-ancient-past/meet-the-megafauna/varanus-priscus'},
 {id:'quinkana',name:'Land crocodile',scientific:'Quinkana species',type:'Extinct crocodilian',
  time:'Queensland Museum estimates approximately 4 million to 40,000 years ago',
  summary:'An extinct crocodilian thought to have spent substantial time on land, with sharp teeth suited to slicing meat.',
  fossil:'Fossil teeth and remains have been found in Australian caves. Queensland Museum shows a photographed Quinkana tooth in its megafauna collection.',
  interpretation:'Its land-dwelling habits and hunting strategies are inferred from the teeth and fossil locations, not directly observed.',
  question:'What did cave fossils establish? They help identify the crocodile and show where remains accumulated; they cannot alone prove what prey was eaten.',
  source:'https://www.museum.qld.gov.au/learn-and-discover/queenslands-ancient-past/meet-the-megafauna/quinkana'},
]);

function matchesSearch(query){
 if(typeof query!=='string')return false;
 const q=query.toLowerCase().trim();
 if(!q)return true;
 const haystack=[META.title,'megafauna prehistoric fossil extinct australia animal animals palaeontology paleontology yamuti diprotodon kangaroo marsupial lion cave goanna crocodile giant bird first nations pangaea gondwana nullarbor',...ANIMALS.flatMap(a=>[a.name,a.scientific,a.type])].join(' ').toLowerCase();
 return q.split(/\s+/).every(word=>haystack.includes(word));
}
function getAnimal(id){return ANIMALS.find(a=>a.id===id)||null;}
function isMuseumSource(url){return typeof url==='string'&&/^https:\/\/(australian\.museum|www\.museum\.qld\.gov\.au)\//.test(url);}
module.exports={META,SOURCES,ANIMALS,matchesSearch,getAnimal,isMuseumSource};
