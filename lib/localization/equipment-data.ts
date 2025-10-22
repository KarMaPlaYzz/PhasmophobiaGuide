/**
 * Equipment Data Localization
 * Descriptions, usage, and recommendations for all equipment
 */

import { SupportedLanguage } from './types';

// Equipment descriptions
export const equipmentDescriptions: Record<string, Record<SupportedLanguage, string>> = {
  'emf-reader': {
    en: 'Detects electromagnetic fields to identify ghost presence and activity',
    de: 'Erkennt elektromagnetische Felder um Geistpräsenz zu identifizieren',
    nl: 'Detecteert elektromagnetische velden om geestpresence te identificeren',
    fr: 'Détecte les champs électromagnétiques pour identifier la présence de fantômes',
    es: 'Detecta campos electromagnéticos para identificar presencia de fantasmas',
    it: 'Rileva campi elettromagnetici per identificare la presenza di fantasmi',
    pt: 'Detecta campos eletromagnéticos para identificar presença de fantasmas',
    sv: 'Detekterar elektromagnetiska fält för att identifiera spökesnärvaro',
  },
  'spirit-box': {
    en: 'Allows communication with ghosts through white noise and radio frequencies',
    de: 'Ermöglicht Kommunikation mit Geistern durch weißes Rauschen',
    nl: 'Maakt communicatie met geesten mogelijk door witruisgeluiden',
    fr: 'Permet la communication avec les fantômes par bruit blanc',
    es: 'Permite comunicarse con fantasmas a través de ruido blanco',
    it: 'Permette la comunicazione con i fantasmi tramite rumore bianco',
    pt: 'Permite comunicação com fantasmas através de ruído branco',
    sv: 'Tillåter kommunikation med spöken genom vita ljud',
  },
  'ghost-writing-book': {
    en: 'Records ghost writing to collect evidence of paranormal activity',
    de: 'Zeichnet Geisterschrift auf um paranormale Aktivität zu dokumentieren',
    nl: 'Registreert geestschrift om paranormale activiteit vast te leggen',
    fr: 'Enregistre les écritures de fantômes pour documenter l\'activité paranormale',
    es: 'Registra escritura de fantasmas para documentar actividad paranormal',
    it: 'Registra la scrittura di fantasmi per documentare l\'attività paranormale',
    pt: 'Registra escritura de fantasmas para documentar atividade paranormal',
    sv: 'Registrerar spökeskrivning för att dokumentera paranormal aktivitet',
  },
  'thermometer': {
    en: 'Measures temperature changes to detect supernatural cold spots',
    de: 'Misst Temperaturänderungen um übernatürliche Kaltstellen zu erkennen',
    nl: 'Meet temperatuurveranderingen om bovennatuurlijke koude plekken op te sporen',
    fr: 'Mesure les changements de température pour détecter les points froids surnaturels',
    es: 'Mide cambios de temperatura para detectar puntos fríos sobrenaturales',
    it: 'Misura i cambiamenti di temperatura per rilevare punti freddi sovrannaturali',
    pt: 'Mede mudanças de temperatura para detectar pontos frios sobrenaturais',
    sv: 'Mäter temperaturförändringar för att detektera övernaturliga kalla punkter',
  },
  'uv-light': {
    en: 'Reveals invisible fingerprints left by ghosts under ultraviolet light',
    de: 'Offenbart unsichtbare Fingerabdrücke von Geistern unter UV-Licht',
    nl: 'Onthult onzichtbare vingerafdrukken van geesten onder UV-licht',
    fr: 'Révèle les empreintes digitales invisibles des fantômes sous la lumière UV',
    es: 'Revela las huellas dactilares invisibles de fantasmas bajo luz UV',
    it: 'Rivela le impronte digitali invisibili dei fantasmi sotto la luce UV',
    pt: 'Revela as impressões digitais invisíveis de fantasmas sob luz UV',
    sv: 'Avslöjar osynliga fingeravtryck från spöken under UV-ljus',
  },
  'crucifix': {
    en: 'Prevents ghosts from hunting within a certain radius when placed strategically',
    de: 'Verhindert Geistjagden innerhalb eines bestimmten Radius',
    nl: 'Voorkomt geestjachten binnen een bepaalde radius',
    fr: 'Empêche la chasse des fantômes dans un certain rayon',
    es: 'Evita que los fantasmas cacen dentro de un cierto radio',
    it: 'Impedisce ai fantasmi di cacciare entro un certo raggio',
    pt: 'Evita que os fantasmas cacem dentro de um certo raio',
    sv: 'Förhindrar spökjakt inom en viss radie',
  },
  'dots-projector': {
    en: 'Projects laser dots that reveal ghost silhouettes when the ghost passes through',
    de: 'Projiziert Laserpunkte die Geistsilhouetten offenbaren',
    nl: 'Projecteert laserpunten die geestsilhouetten onthullen',
    fr: 'Projette des points laser qui révèlent les silhouettes de fantômes',
    es: 'Proyecta puntos láser que revelan las siluetas de fantasmas',
    it: 'Proietta punti laser che rivelano le silhouette dei fantasmi',
    pt: 'Projeta pontos de laser que revelam silhuetas de fantasmas',
    sv: 'Projicerar laserpunkter som avslöjar spöksilhuetter',
  },
  'video-camera': {
    en: 'Records video evidence including ghost manifestations and D.O.T.S. interactions',
    de: 'Zeichnet Videobeweise auf einschließlich Geistmanifestationen',
    nl: 'Neemt videobewijs op inclusief geestmanifestaties',
    fr: 'Enregistre les preuves vidéo y compris les manifestations de fantômes',
    es: 'Registra pruebas de video incluyendo manifestaciones de fantasmas',
    it: 'Registra prove video incluse manifestazioni di fantasmi',
    pt: 'Registra provas de vídeo incluindo manifestações de fantasmas',
    sv: 'Spelar in videobevisen inklusive spökemanifestationer',
  },
  'parabolic-microphone': {
    en: 'Captures paranormal sounds and ghost vocalizations from a distance',
    de: 'Erfasst paranormale Geräusche und Geistlokalisierungen aus der Ferne',
    nl: 'Legt paranormale geluiden en geestgeluideen vast van afstand',
    fr: 'Capture les sons paranormaux et les vocalisations de fantômes de loin',
    es: 'Captura sonidos paranormales y vocalizaciones de fantasmas desde la distancia',
    it: 'Cattura suoni paranormali e vocalizzazioni di fantasmi da lontano',
    pt: 'Captura sons paranormais e vocalizações de fantasmas de longe',
    sv: 'Fångar paranormala ljud och spökvokalisationer från långt bort',
  },
  'sanity-medication': {
    en: 'Restores sanity to players, essential for surviving dangerous encounters',
    de: 'Stellt Geist wieder her, wesentlich zum Überleben gefährlicher Begegnungen',
    nl: 'Herstelt zielkracht, essentieel om gevaarlijke ontmoetingen te overleven',
    fr: 'Restaure la sanité, essentiel pour survivre aux rencontres dangereuses',
    es: 'Restaura la cordura, esencial para sobrevivir encuentros peligrosos',
    it: 'Ripristina la sanità, essenziale per sopravvivere agli incontri pericolosi',
    pt: 'Restaura sanidade, essencial para sobreviver encontros perigosos',
    sv: 'Återställer förstånd, väsentligt för att överleva farliga möten',
  },
};

// Equipment usage tips
export const equipmentUsage: Record<string, Record<SupportedLanguage, string>> = {
  'emf-reader': {
    en: 'Place near suspected ghost activity areas. EMF Level 5 readings are strong evidence.',
    de: 'Platzieren Sie in der Nähe vermuteter Geistaktivitätsbereiche.',
    nl: 'Plaats in de buurt van vermoede geestactiviteitsbereiken.',
    fr: 'Placez près des zones d\'activité de fantômes suspectes.',
    es: 'Coloca cerca de áreas de actividad de fantasmas sospechosa.',
    it: 'Posiziona vicino alle aree di attività di fantasmi sospette.',
    pt: 'Coloque perto de áreas de atividade de fantasmas suspeita.',
    sv: 'Placera nära misstänkta spökaktivitetsområden.',
  },
  'spirit-box': {
    en: 'Ask questions to communicate with the ghost. More active with certain ghost types.',
    de: 'Stellen Sie Fragen um mit dem Geist zu kommunizieren.',
    nl: 'Stel vragen om met de geest te communiceren.',
    fr: 'Posez des questions pour communiquer avec le fantôme.',
    es: 'Haz preguntas para comunicarte con el fantasma.',
    it: 'Fai domande per comunicare con il fantasma.',
    pt: 'Faça perguntas para se comunicar com o fantasma.',
    sv: 'Ställ frågor för att kommunicera med spöket.',
  },
  'ghost-writing-book': {
    en: 'Place in ghost room and wait for it to write. Check frequently for messages.',
    de: 'Platzieren Sie im Geisterzimmer und warten Sie auf Schrift.',
    nl: 'Plaats in het geesterkamer en wacht op schrift.',
    fr: 'Placez dans la chambre du fantôme et attendez qu\'il écrive.',
    es: 'Coloca en la habitación del fantasma y espera que escriba.',
    it: 'Posiziona nella stanza del fantasma e aspetta che scriva.',
    pt: 'Coloque no quarto do fantasma e espere que escreva.',
    sv: 'Placera i spökrummet och vänta på att det skriver.',
  },
};

/**
 * Helper functions
 */
export const getEquipmentDescription = (equipmentId: string, language: SupportedLanguage): string => {
  return equipmentDescriptions[equipmentId]?.[language] ?? equipmentDescriptions[equipmentId]?.en ?? '';
};

export const getEquipmentUsage = (equipmentId: string, language: SupportedLanguage): string => {
  return equipmentUsage[equipmentId]?.[language] ?? equipmentUsage[equipmentId]?.en ?? '';
};
