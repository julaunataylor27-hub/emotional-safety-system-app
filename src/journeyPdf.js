const PDF_MIME = 'application/pdf';
const EQUATION = '(Knowledge × Understanding) + (Love × Kindness × Patience) = Growth × Humanity = Life';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}

function buildJourneyPdfHtml(answers, date = new Date()) {
  const field = (label, value) => `<div class="field"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(value.trim() || 'Not answered yet.')}</p></div>`;
  const selected = value => value.length ? value.join(', ') : 'Not selected yet.';
  const section = (number, title, content) => `<section><h2><span>${number}</span> ${escapeHtml(title)}</h2>${content}</section>`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>My Humanity Summary</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.55; color: #1c2d26; margin: 0; }
    header { border-bottom: 3px solid #bf8d24; padding-bottom: 16px; margin-bottom: 22px; }
    .brand { color: #27533c; font-size: 10pt; font-weight: bold; letter-spacing: 1px; }
    h1 { font-size: 25pt; line-height: 1.2; color: #173e2a; margin: 12px 0; overflow-wrap: anywhere; }
    .motto { font-size: 14pt; margin: 0 0 8px; white-space: pre-wrap; }
    .meta, footer { font-size: 9pt; color: #54645b; }
    section { margin: 22px 0; }
    h2 { font-size: 16pt; color: #173e2a; padding-bottom: 7px; border-bottom: 1px solid #d9decb; break-after: avoid; }
    h2 span { color: #a67615; }
    h3 { font-size: 11pt; margin: 14px 0 4px; color: #3a5948; break-after: avoid; }
    p { margin: 0 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; orphans: 3; widows: 3; }
    .equation { background: #f4f4e9; border-left: 4px solid #bf8d24; padding: 14px; break-inside: avoid; }
    footer { border-top: 1px solid #d9decb; margin-top: 24px; padding-top: 10px; }
  </style></head><body>
    <header><div class="brand">EMOTIONAL SAFETY SYSTEM</div><h1>${escapeHtml(answers.philosophyName.trim() || 'My Humanity Philosophy')}</h1>
    <p class="motto">${escapeHtml(answers.philosophyMotto.trim())}</p><div class="meta">MY PERSONAL JOURNEY SUMMARY · ${escapeHtml(date.toLocaleDateString('en-AU'))}</div></header>
    ${section('01','My Foundation',field('My message',answers.foundationMessage)+field('Why it matters',answers.foundationWhy)+field('What I hope changes',answers.foundationHope))}
    ${section('02','My Values',field('Values I chose',selected(answers.philosophyValues))+field('How I live these values',answers.valuesReflection))}
    ${section('03','My Identity',field('My philosophy',answers.philosophyName)+field('My motto',answers.philosophyMotto)+field('My vision',answers.philosophyVision))}
    ${section('04','My Book / My Story',field('Title',answers.bookTitle)+field('My story and notes',answers.storyNotes))}
    ${section('05','Creative Projects',field('What I want to create',selected(answers.projectSelections)))}
    ${section('06','Sharing My Message',field('Who I want to reach',selected(answers.sharingSelections)))}
    ${section('07','My Legacy',field('How I want people to feel',answers.legacyFeeling)+field('The world I hope future generations inherit',answers.legacyWorld))}
    <div class="equation"><h3>My philosophy equation</h3><p>${escapeHtml(EQUATION)}</p></div>
    <footer>Prepared from the answers entered in the Emotional Safety System. This document contains the writer’s own reflections.</footer>
  </body></html>`;
}

function createJourneyPdfService({print, fileSystem, sharing, intentLauncher, platform, now = () => new Date()}) {
  async function share(document) {
    if (!await sharing.isAvailableAsync()) throw new Error('PDF sharing is unavailable');
    await sharing.shareAsync(document.uri, {mimeType: PDF_MIME, UTI: 'com.adobe.pdf', dialogTitle: 'Save or share my journey PDF'});
  }
  return {
    async create(answers) {
      const date = now();
      const result = await print.printToFileAsync({html: buildJourneyPdfHtml(answers, date), width: 595, height: 842});
      if (!result.uri || !fileSystem.cacheDirectory) throw new Error('PDF could not be created');
      const name = 'My-Humanity-Summary-' + date.toISOString().replace(/[:.]/g, '-') + '.pdf';
      const uri = fileSystem.cacheDirectory + name;
      await fileSystem.copyAsync({from: result.uri, to: uri});
      await fileSystem.deleteAsync(result.uri, {idempotent: true}).catch(() => {});
      return {uri, name, pages: result.numberOfPages};
    },
    share,
    async open(document) {
      if (platform !== 'android') { await share(document); return; }
      const uri = await fileSystem.getContentUriAsync(document.uri);
      await intentLauncher.startActivityAsync('android.intent.action.VIEW', {data: uri, type: PDF_MIME, flags: 1});
    },
    async save(document) {
      if (platform !== 'android') { await share(document); return {chooserOpened: true}; }
      const access = await fileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!access.granted) return {cancelled: true};
      const contents = await fileSystem.readAsStringAsync(document.uri, {encoding: fileSystem.EncodingType.Base64});
      const uri = await fileSystem.StorageAccessFramework.createFileAsync(access.directoryUri, document.name.replace(/\.pdf$/i, ''), PDF_MIME);
      try {
        await fileSystem.writeAsStringAsync(uri, contents, {encoding: fileSystem.EncodingType.Base64});
      } catch (error) {
        await fileSystem.deleteAsync(uri, {idempotent: true}).catch(() => {});
        throw error;
      }
      return {saved: true, uri, name: document.name};
    }
  };
}

module.exports = {PDF_MIME, escapeHtml, buildJourneyPdfHtml, createJourneyPdfService};
