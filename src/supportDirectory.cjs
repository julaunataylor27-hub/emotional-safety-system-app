const DIRECTORY = require('./supportDirectory.json');

const REGIONS = [
  {id:'National',label:'National',name:'National services'},
  {id:'WA',label:'WA',name:'Western Australia'},
  {id:'NSW',label:'NSW',name:'New South Wales'},
  {id:'VIC',label:'VIC',name:'Victoria'},
  {id:'QLD',label:'QLD',name:'Queensland'},
  {id:'SA',label:'SA',name:'South Australia'},
  {id:'TAS',label:'TAS',name:'Tasmania'},
  {id:'ACT',label:'ACT',name:'Australian Capital Territory'},
  {id:'NT',label:'NT',name:'Northern Territory'},
];
const CATEGORIES = [
  {id:'all',label:'All support'},
  {id:'family',label:'Violence and family safety',match:/Violence|Family support|Child sexual|Behaviour change/i},
  {id:'children',label:'Children and young people',match:/Child/i},
  {id:'housing',label:'Housing, food and money',match:/Housing|Food|Money/i},
  {id:'wellbeing',label:'Mental health and wellbeing',match:/Crisis support|Mental health|Trauma|LGBTIQA|wellbeing/i},
  {id:'first-nations',label:'Aboriginal and Torres Strait Islander support',match:/First Nations/i},
  {id:'legal',label:'Legal help',match:/legal/i},
  {id:'access',label:'Disability, carers and access',match:/Disability|Carers|Older people|Language|Accessible/i},
  {id:'online',label:'Online safety',match:/Online safety/i},
];
const DEFAULT_FILTERS = {region:'WA',category:'all',query:''};
const EMERGENCY = DIRECTORY.services.find(s=>s.id==='emergency');

function filterServices({region='WA',category='all',query=''}={}) {
  const chosen = CATEGORIES.find(item=>item.id===category) || CATEGORIES[0];
  const tokens = String(query).trim().toLocaleLowerCase('en-AU').split(/\s+/).filter(Boolean);
  return DIRECTORY.services.filter(service=> {
    if(service.id==='emergency'||!service.regions.includes(region))return false;
    if(chosen.match&&!chosen.match.test(service.category))return false;
    const searchable = [service.name,service.category,service.audience,service.help,
      service.hours,service.notes,...service.contacts.map(c=>c.number)].join(' ').toLocaleLowerCase('en-AU');
    return tokens.every(token=>searchable.includes(token));
  });
}

module.exports = {DIRECTORY,REGIONS,CATEGORIES,DEFAULT_FILTERS,EMERGENCY,filterServices};
