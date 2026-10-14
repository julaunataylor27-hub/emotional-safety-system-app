'use strict';
const M = require('./lifeJourney.cjs');
const e = M.escapeHTML;
const TYPE_LABELS = {family:'Family oral history',source:'Source lead',culture:'Cultural guidance',personal:'Personal interpretation'};

function buildLifeJourneyPdfHtml(notes,date=new Date()) {
  const field = (title,text) => '<h3>'+e(title)+'</h3><p>'+e(text)+'</p>';
  const chapters = M.stages.map(stage => {
    const note = M.getNote(M.sanitiseNotes(notes),stage);
    const culture = stage.culture===M.stages[0].culture?'See the Noongar cultural framework above.':stage.culture;
    return '<section><h2>'+e(stage.title)+'</h2><p class="meta">'+e(stage.period)+'</p>'+
      field('Source record',stage.record)+field('Cultural context',culture)+field('Unknown',stage.unknown)+
      field('Possible meaning - interpretation',stage.meaning)+
      stage.readings.map((reading,i)=>field('Possible reading '+(i+1)+' - keep both open',reading)).join('')+
      field('Evidence limit',stage.limits)+
      field('Selected possible feelings - not findings',note.feelings.join(', ')||'None selected.')+
      field('Questions for life lessons - our learning today',M.lessonQuestions(stage).join('\n'))+
      field('My interpretation or question',note.reflection||'No note added.')+
      field(TYPE_LABELS[note.type]+' - unverified in this tool',note.additional||'No note added.')+
      '<details-block>'+Object.entries(stage.signals).map(([label,text])=>field(label+' - reflection question',text)).join('')+'</details-block>'+
      '<p class="meta">Sources: '+stage.sources.map(id=>'['+id+']').join(', ')+'</p></section>';
  }).join('');
  const sources = M.sources.map(source=>'<div class="source"><h3>['+source.id+'] '+e(source.title)+'</h3><p class="meta">'+e(source.type)+'</p><p>'+e(source.detail)+'</p>'+source.links.map(([label,url])=>'<p><a href="'+e(url)+'">'+e(label)+'</a><br><span class="url">'+e(url)+'</span></p>').join('')+'</div>').join('');
  return '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Yagan Life Journey - My Reflections</title><style>'+ 
    '@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#233c35;font-size:12pt;line-height:1.55;margin:0}header{border-bottom:3px solid #ac8d56;padding-bottom:14px}h1{font-size:25pt;line-height:1.2}h2{font-size:17pt;border-bottom:1px solid #b8c5b4;padding-bottom:7px;break-after:avoid}h3{font-size:11pt;margin-bottom:5px;break-after:avoid}p{white-space:pre-wrap;overflow-wrap:anywhere;orphans:3;widows:3;margin-top:0}.meta,.url{font-size:9pt;color:#5e6861}.context{background:#edf1e8;padding:13px;margin-top:20px}section{margin-top:27px}.source{break-inside:avoid}a{color:#315b51}details-block{display:block;border-top:1px solid #d9ddd1;margin-top:17px}footer{font-size:9pt;margin-top:25px;border-top:1px solid #b8c5b4;padding-top:10px}'+
    '</style></head><body><header><p class="meta">EMOTIONAL SAFETY SYSTEM - JULAUNA TAYLOR</p><h1>Yagan - Life Journey</h1><p>My historical reflection notes</p><p class="meta">'+e(date.toLocaleDateString('en-AU'))+' - Research prototype 0.1</p></header>'+ 
    '<p>Source records, cultural context, interpretations and unknowns remain separate. Selected feelings are possibilities, not findings. This does not recreate Yagan\'s mind or establish personal beliefs.</p>'+ 
    '<div class="context">'+field('Noongar cultural framework',M.stages[0].culture)+'</div>'+chapters+'<h2>Sources and original letters</h2>'+sources+
    '<footer>Prepared locally from the current Life Journey reflections. Additional knowledge remains unverified in this tool. Nothing is uploaded or shared automatically.</footer></body></html>';
}
module.exports = {buildLifeJourneyPdfHtml};
