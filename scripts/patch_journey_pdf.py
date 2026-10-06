"""Add document creation, opening, Android folder saving and PDF sharing."""
from pathlib import Path

p = Path('App.js')
s = p.read_text()
if "from './src/journeyPdfService'" in s:
    print('Journey PDF export already connected.')
    raise SystemExit(0)
s = "import journeyPdfService from './src/journeyPdfService';\n" + s
anchor = '  const summaryText=buildJourneySummary(journeyAnswers);'
if anchor not in s:
    raise SystemExit('Journey PDF: summary memory must be applied first')
s = s.replace(anchor, r'''  const [pdfBusy,setPdfBusy]=useState(false);
  const [pdfDocument,setPdfDocument]=useState(null);
  const [pdfNotice,setPdfNotice]=useState('');
  const pdfBusyRef=useRef(false);
  const pdfSnapshot=useRef('');
  const runPdfAction=async(action)=>{
    if(pdfBusyRef.current) return;
    pdfBusyRef.current=true;
    setPdfBusy(true); setPdfNotice('');
    try {
      const snapshot=JSON.stringify(journeyAnswers);
      let document=pdfDocument;
      if(!document||snapshot!==pdfSnapshot.current) {
        document=await journeyPdfService.create(journeyAnswers);
        pdfSnapshot.current=snapshot;
        setPdfDocument(document);
      }
      if(action==='open') {
        await journeyPdfService.open(document);
        setPdfNotice('Your PDF is ready.');
      } else if(action==='save') {
        const outcome=await journeyPdfService.save(document);
        setPdfNotice(outcome.saved?`Saved to the folder you chose: ${document.name}`:outcome.cancelled?'Saving cancelled. Your journey answers are still saved in the app.':'Choose Save to Files in the menu to keep your PDF.');
      } else {
        await journeyPdfService.share(document);
        setPdfNotice('Your PDF is ready. Choose an app and recipient in the sharing menu.');
      }
    } catch {
      setPdfNotice(action==='save'?'Your PDF could not be saved. Try choosing another folder.':action==='open'?'Your PDF could not be opened. Try Save PDF or Share PDF.':'Your PDF could not be shared. Try Save PDF.');
      Alert.alert('PDF action unavailable','Your journey answers are still saved in the app. You can try again.');
    } finally { pdfBusyRef.current=false; setPdfBusy(false); }
  };
''' + anchor, 1)
anchor = '        <Card><Text selectable style={styles.body}>{summaryText}</Text></Card>'
if anchor not in s:
    raise SystemExit('Journey PDF: preview screen missing')
s = s.replace(anchor, r'''        <Card>
          <Text style={styles.cardTitle}>My PDF Document</Text>
          <Text style={styles.body}>Turn your answers into a document you can open, save to your files or share.</Text>
          <View pointerEvents={pdfBusy?'none':'auto'} accessibilityState={{busy:pdfBusy}} style={pdfBusy?{opacity:.6}:null}>
            <PrimaryButton onPress={()=>runPdfAction('open')} color="#D9A72E">OPEN MY PDF →</PrimaryButton>
            <PrimaryButton onPress={()=>runPdfAction('save')} color="#6E9B3F">SAVE PDF TO MY FILES ↓</PrimaryButton>
            <PrimaryButton onPress={()=>runPdfAction('share')} color="#D9A72E">SHARE PDF →</PrimaryButton>
          </View>
          <Text accessibilityLiveRegion="polite" style={styles.body}>{pdfBusy?'Preparing your document…':pdfNotice||'Save PDF lets you choose a folder. On Android, create a folder such as My Journey Documents if your phone asks you to choose one.'}</Text>
        </Card>
''' + anchor, 1)
s = s.replace('SHARE MY SUMMARY →', 'SHARE AS TEXT →')
p.write_text(s)
print('Journey PDF opening, folder saving and sharing connected.')
