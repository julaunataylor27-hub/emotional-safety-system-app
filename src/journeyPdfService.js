import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import {Platform} from 'react-native';
import {createJourneyPdfService} from './journeyPdf';

export default createJourneyPdfService({print: Print, fileSystem: FileSystem, sharing: Sharing, intentLauncher: IntentLauncher, platform: Platform.OS});
