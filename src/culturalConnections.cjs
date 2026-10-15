// Educational research draft. Provenance and review limits: docs/LIVING_CONNECTIONS.md
  const sources = {
    songlines: ['National Museum · custodian-led Songlines project','https://www.nma.gov.au/about/media/media-releases-listing-by-year/media-releases-2024/songlines-tracking-the-seven-sisters-finland'],
    family: ['Shino Konishi · Barangaroo biography','https://adb.anu.edu.au/biography/barangaroo-35202'],
    kimberley: ['Wunambal Gaambera Aboriginal Corporation','https://www.wunambalgaambera.org.au/about/wunambal-gaambera-people/'],
    kulin: ['ILBIJERRI · Tanderrum and participating groups','https://www.ilbijerri.com.au/event/tanderrum/'],
    language: ['Ngaanyatjarra Council · Languages','https://www.ngaanyatjarra.org.au/our-culture/languages/'],
    kinship: ['Central Land Council · Kinship systems','https://www.clc.org.au/our-kinship-systems/'],
    ochre: ['Wajarri evidence · Hamlett [2018] FCA 545, paragraphs 46–48','https://casechat.au/cases/au/hamlett-on-behalf-of-the-wajarri-yamatji-people-part-b-v-state-of-western-australia'],
    noongar: ['Collard, Harben & van den Berg · Noongar study, 2004','https://www.derbalnara.org.au/NIDJABEELIARBOODJARNOONOOKURTNYININY.pdf'],
    badimia: ['Badimia community language project · Country, People and Culture','https://badimialanguage.com.au/badimia-country-people-and-culture/'],
    yamaji: ['Charmaine Papertalk Green · first-person essay, 2024','https://www.uwa.edu.au/news/article/2024/october/friday-essay-i-claimed-our-data-confronting-the-colonial-archive-is-intense-aboriginal-love-in-action'],
    yawuru: ['Nyamba Buru Yawuru · Mabu Liyan Framework','https://www.yawuru.org.au/community/mabu-liyan-framework/?doing_wp_cron=1715201522.5489239692687988281250'],
    ngarrindjeri: ['Ngarrindjeri Regional Authority · Our Approach','https://www.ngarrindjeri.org.au/our-approach'],
    ngarrindjeriSea: ['Ngarrindjeri Regional Authority · About','https://www.ngarrindjeri.org.au/about'],
    wiradjuri: ['Charles Sturt · Yindyamarra Trust','https://www.csu.edu.au/office/advancement/giving-to-csu/support-us/yindyamarra-trust'],
    anangu: ['Uluṟu–Kata Tjuṯa · public Aṉangu teaching','https://uluru.gov.au/discover/culture/tjukurpa/'],
    yolngu: ['Arafura Swamp Rangers Aboriginal Corporation · Rom','https://www.asrac.org.au/culture/rom/'],
    quandamooka: ['Quandamooka Yoolooburrabee Aboriginal Corporation','https://qyac.net.au/'],
    gunditjmara: ['Gunditjmara Aboriginal Cooperative · About','https://www.gunditjmara.org.au/about-us'],
    kaurna: ['Kaurna Warra · About Kaurna','https://www.kaurnawarra.org.au/about-kaurna'],
    palawa: ['Tasmanian Aboriginal Centre · palawa kani','https://tacinc.com.au/programs/palawa-kani/'],
    badimiaLanguage: ['Badimia language project · acknowledgements','https://badimialanguage.com.au/acknowledgements/']
  };
  const node = (label, detail, source, lines) => ({label, detail, source, lines:lines || [label]});
  const views = {
    songlines: {
      hub:'Seven Sisters songlines', scope:'Western and Central Deserts', type:'documented',
      title:'Routes shared across Countries',
      detail:'A custodian-led project documents sections across Martu, Ngaanyatjarra and Aṉangu Pitjantjatjara Yankunytjatjara Countries.', source:'songlines',
      nodes:[node('Martu','Martu Country is one of the three areas traversed in the documented exhibition project.','songlines'),node('Ngaanyatjarra','Ngaanyatjarra Country is another area of the documented songline journey.','songlines'),node('Aṉangu Pitjantjatjara Yankunytjatjara','The project also follows sections on Aṉangu Pitjantjatjara Yankunytjatjara lands.','songlines',['Aṉangu','Pitjantjatjara','Yankunytjatjara'])]
    },
    family: {
      hub:'Bennelong and Barangaroo', scope:'Sydney Harbour · recorded family', type:'documented',
      title:'A particular family connection', detail:'The biography records Bennelong, a Wangal man, and Barangaroo, a Gamaragal woman, as partners and parents of Dilboong.',source:'family',
      nodes:[node('Bennelong · Wangal','Bennelong is identified as a Wangal man in the historical account.','family',['Bennelong','Wangal']),node('Barangaroo · Gamaragal','Barangaroo was a Gamaragal (Cammeraygal) woman with authority in her community.','family',['Barangaroo','Gamaragal']),node('Dilboong · daughter','Dilboong was born to Barangaroo and Bennelong in 1791. This records one family, not a national descent tree.','family',['Dilboong','Their daughter'])]
    },
    kimberley: {
      hub:'Wanjina Wunggurr community',scope:'North Kimberley · shared ancestral tradition',type:'documented',
      title:'Shared traditions, distinct Country',detail:'The community describes shared Wanjina Wunggurr ancestors, with each group managing its own Country.',source:'kimberley',
      nodes:[node('Wunambal Gaambera','Wunambal Gaambera people describe themselves as saltwater and freshwater people.','kimberley',['Wunambal','Gaambera']),node('Worrorra · Dambimangari','Worrorra (Dambimangari) people are named as part of the Wanjina Wunggurr community.','kimberley',['Worrorra','Dambimangari']),node('Ngarinyin · Wilinggin','Ngarinyin (Wilinggin) people are named as part of the shared community. This is a cultural account of ancestors.','kimberley',['Ngarinyin','Wilinggin'])]
    },
    kulin: {
      hub:'Tanderrum',scope:'Eastern Kulin · ceremony and relationships',type:'documented',
      title:'Groups brought together in ceremony',detail:'ILBIJERRI documents Tanderrum bringing these five groups together through a living ceremony.',source:'kulin',
      nodes:[node('Wurundjeri / Woiwurrung','A participating group in the documented Tanderrum ceremony.','kulin',['Wurundjeri','Woiwurrung']),node('Boon Wurrung','A participating group in the documented Tanderrum ceremony.','kulin'),node('Taungurung','The source describes connections through language, ceremony and kinship.','kulin'),node('Wadawurrung','A participating group in the documented Tanderrum ceremony.','kulin'),node('Dja Dja Wurrung','A participating group whose account links Country, creation and Law.','kulin',['Dja Dja','Wurrung'])]
    },
    language: {
      hub:'Western Desert language',scope:'Wati · languages and dialects',type:'documented',
      title:'A documented linguistic relationship',detail:'Ngaanyatjarra Council lists these among Western Desert dialects. Language relationship alone does not establish a person’s ancestry.',source:'language',
      nodes:['Ngaanyatjarra','Ngaatjatjarra','Pitjantjatjara','Yankunytjatjarra','Manytjilytjarra','Kukatja','Luritja','Pintupi','Yulparitja','Kiyatjarra'].map(label=>node(label,'Listed among Western Desert dialects by Ngaanyatjarra Council.','language'))
    },
    trade: {
      hub:'Wilgie Mia connections',scope:'Wajarri Country · reported regional connections',type:'documented',
      title:'Regional connections in the court record',detail:'The judgment records Wajarri evidence linking Wilgie Mia ochre and stories with the Western Desert and Pilbara. The source is a hosted copy.',source:'ochre',
      nodes:[node('Wajarri · Wilgie Mia','Wilgie Mia and the Weld Range are described as places of major cultural and ceremonial importance.','ochre',['Wajarri','Wilgie Mia']),node('Western Desert peoples','The evidence describes ochre and stories extending to the Western Desert; this is a broad regional label.','ochre',['Western Desert','Regional connection']),node('Pilbara peoples','The evidence also names Pilbara connections. It does not provide a complete list of participating families or groups.','ochre',['Pilbara','Regional connection'])]
    },
    kinship: {
      hub:'Regional kinship systems',scope:'Central Australia · comparison of roles',type:'comparison',
      title:'Comparable categories, local differences',detail:'The Central Land Council compares skin-name systems across languages. These lines indicate comparison, not individual blood relationships.',source:'kinship',
      nodes:['Eastern/Central Arrernte','Kaytetye','Eastern Anmatyerr','Alyawarr','Warumungu','Warlpiri','Pintupi Luritja','Pintupi','Ngaanyatjarra'].map(label=>node(label,'Included in the Central Land Council’s comparison. Systems and spellings vary between groups.','kinship',label==='Eastern/Central Arrernte'?['Eastern/Central','Arrernte']:label==='Eastern Anmatyerr'?['Eastern','Anmatyerr']:[label]))
    },
    country: {
      hub:'Country, waters and wellbeing',scope:'English comparison · distinct local accounts',type:'comparison',
      title:'A recurring connection with place',detail:'These separate public accounts connect people’s lives and responsibilities with land or waters. The lines compare themes; the Ngarrindjeri entry is a source pointer only.',source:'quandamooka',
      nodes:[node('Quandamooka','QYAC describes its work caring for Country through its Aboriginal Land and Sea Management Agency.','quandamooka'),node('Ngarrindjeri · source pointer','Read the Regional Authority’s own account. It requests advice about use of its knowledge; use guidance for this draft is pending.','ngarrindjeri',['Ngarrindjeri','Source pointer']),node('Gunditjmara','The community account describes river and lake Country, family kinship and continuing cultural practices.','gunditjmara'),node('Wunambal Gaambera','The corporation links healthy Country, teaching young people and caring for saltwater and freshwater places.','kimberley',['Wunambal','Gaambera'])]
    },
    care: {
      hub:'Care, love and responsibility',scope:'English comparison · distinct teachings',type:'comparison',
      title:'Shared themes with their own meanings',detail:'These sources describe care, belonging or wellbeing in their own terms. They are not interchangeable teachings or proof of shared descent.',source:'yawuru',
      nodes:[node('Noongar','Collard, Harben and van den Berg’s 2004 study connects Country, family/relations and knowledge. This draft does not attribute their trilogy to Yagan personally.','noongar'),node('Charmaine Papertalk Green · Yamaji account','Papertalk Green identifies as Wajarri, Badimaya and Wilunyu. Her first-person essay describes love for family, Old People, Country and culture; it is one named voice.','yamaji',['Charmaine','Papertalk Green','Yamaji account']),node('Yawuru','Mabu liyan links wellbeing with people, culture and Country.','yawuru'),node('Wiradjuri','The published Yindyamarra account emphasises mutual respect, kindness, love, wisdom and deep listening.','wiradjuri'),node('Aṉangu','The public Tjukurpa account describes caring for one another and the land that supports people.','anangu'),node('Yolŋu and Bi','ASRAC describes Rom, kinship responsibilities and learning how to respect people, Country and oneself.','yolngu',['Yolŋu and Bi','Gurruwiling'])]
    },
    renewal: {
      hub:'Language and cultural renewal',scope:'English comparison · community-led work',type:'comparison',
      title:'Knowledge carried into the future',detail:'Different communities maintain or restore language in their own ways. These links compare work, not linguistic origins.',source:'palawa',
      nodes:[node('Badimia','The project credits named families, speakers and Elders for recordings, stories and language resources.','badimiaLanguage'),node('Kaurna','Kaurna Warra provides community language, people and Country resources.','kaurna'),node('palawa kani','The Tasmanian Aboriginal Centre describes restoring spoken language through community-led research and remembered knowledge.','palawa',['palawa kani','Lutruwita/Tasmania']),node('Wunambal Gaambera','The corporation describes work keeping languages and cultural knowledge alive with young people on Country.','kimberley',['Wunambal','Gaambera'])]
    }
  };
  const words = [
    ['boodjar','Noongar','Country; one part of the documented trilogy with family and knowledge.','noongar'],
    ['moort','Noongar','Family or relations; understood together with Country and knowledge.','noongar'],
    ['katitjin','Noongar','Knowledge, including applied knowledge within the study’s Noongar framework.','noongar'],
    ['Barna','Badimia','Country, linked in the public account with care, language, stories and spiritual responsibilities.','badimia'],
    ['Tjukurpa','Aṉangu','A complex foundation connecting ancestral Law, spirituality, behaviour, care and knowledge; this is a brief public orientation.','anangu'],
    ['Rom','Yolŋu Matha / Gurruwiling account','A foundation relating people and Country, joining Law, kinship, knowledge and more; no direct English equivalent.','yolngu'],
    ['Yothu Yindi','Yolŋu','A mother–child relationship carrying rights and responsibilities to people and Country in this public account.','yolngu'],
    ['Ngala Dakku','Rembarrnga','ASRAC’s Rembarrnga term for the mother–child relationship discussed alongside Yothu Yindi.','yolngu'],
    ['mabu liyan','Yawuru','Good wellbeing connected with people, culture, Country and community; broader than a passing feeling.','yawuru'],
    ['Ruwe/Ruwar','Ngarrindjeri · source pointer','Read the Regional Authority’s explanation at the source. Use guidance is pending.','ngarrindjeri'],
    ['Yannarumi','Ngarrindjeri · source pointer','Read the Regional Authority’s explanation at the source. Use guidance is pending.','ngarrindjeri'],
    ['Yarluwar-Ruwe','Ngarrindjeri · source pointer','Read the Regional Authority’s explanation at the source. Use guidance is pending.','ngarrindjeriSea'],
    ['Yindyamarra','Wiradjuri','Respectful ways of living; the linked account includes kindness, love, wisdom and deep listening.','wiradjuri'],
    ['Tanderrum','Eastern Kulin','A ceremony bringing groups together; this is a practice, not a synonym for love or Law.','kulin'],
    ['Djandak','Dja Dja Wurrung','Country, described in the participating group’s account as living and holding creation stories and histories.','kulin'],
    ['Yarta','Kaurna','Country, in Kaurna Warra’s public resource headings.','kaurna'],
    ['Warra','Kaurna','Language, in Kaurna Warra’s public resource headings.','kaurna'],
    ['Miyurna','Kaurna','People, in Kaurna Warra’s public resource headings.','kaurna'],
    ['palawa kani','Tasmanian Aboriginal Centre','“Tasmanian Aborigines speak”; a restored spoken language drawing on original languages and community knowledge.','palawa'],
    ['Wanjina Wunggurr','Wunambal Gaambera, Worrorra, Ngarinyin','A shared ancestral and cultural tradition in the community’s account. This draft does not establish anyone’s biological descent.','kimberley']
  ];

const VIEW_OPTIONS = [
  [
    "songlines",
    "Songlines across Countries"
  ],
  [
    "family",
    "A documented family relationship"
  ],
  [
    "kimberley",
    "Shared ancestral traditions"
  ],
  [
    "kulin",
    "Ceremony and relationships"
  ],
  [
    "language",
    "Related languages"
  ],
  [
    "trade",
    "Wilgie Mia regional connections"
  ],
  [
    "kinship",
    "Kinship roles across languages"
  ],
  [
    "country",
    "Country, sea and wellbeing"
  ],
  [
    "care",
    "Care, love and responsibility"
  ],
  [
    "renewal",
    "Language and cultural renewal"
  ]
];

const META = {
 title: 'Living connections',
 purpose: 'For inspiration, learning and understanding',
 date: '15 October 2026',
 status: 'Research draft · AI-assisted educational summary',
 review: 'Cultural review, reuse permissions and legal review pending. No community endorsement claimed.',
 scope: 'Selected public accounts of Aboriginal Nations, language groups and clans in Australia. This is a schematic comparison, not a genealogy or boundary map.',
 limits: 'Shared teachings alone do not establish a shared bloodline. Local meanings and use protocols apply. This draft is not a clinical assessment or evidence that the app improves safety.',
};
const READING_LINKS = [
 ['austlang','AIATSIS · AustLang language database','https://aiatsis.gov.au/research/languages/austlang'],
 ['map','AIATSIS · Map of Indigenous Australia','https://aiatsis.gov.au/explore/map-indigenous-australia'],
 ['family-history','AIATSIS · Begin family-history research','https://aiatsis.gov.au/family-history/research-step-step/start-yourself'],
 ['yamaji-context','Solid Kids · Yamaji regional context','https://www.solidkids.net.au/welcome-to-our-country/'],
 ['ethics','AIATSIS · Code of Ethics','https://aiatsis.gov.au/research/ethical-research/code-ethics'],
 ['icip','Arts Law · Cultural knowledge and intellectual property','https://www.artslaw.com.au/information-sheet/indigenous-cultural-intellectual-property-icip-aitb/'],
 ['palawa-protocol','Tasmanian Aboriginal Centre · palawa kani use protocol (PDF)','https://tacinc.com.au/wp-content/uploads/2024/09/Policy-Protocol-for-Use-of-palawa-kani-Aboriginal-Language-2019-1.pdf'],
];
const SOURCE_POINTERS = ['ngarrindjeri','ngarrindjeriSea'];
function evidenceLabel(source,comparison=false) {
 return SOURCE_POINTERS.includes(source)?'Source pointer · Use guidance pending':comparison?'Our thematic comparison · Cultural review pending':'Public-source summary · Cultural review pending';
}
const SEARCH_TEXT=JSON.stringify({views,words,sources,VIEW_OPTIONS}).toLowerCase();
function matchesSearch(query){return typeof query==='string'&&SEARCH_TEXT.includes(query.trim().toLowerCase());}
module.exports = {META,sources,views,words,VIEW_OPTIONS,READING_LINKS,SOURCE_POINTERS,evidenceLabel,matchesSearch};
