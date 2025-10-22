/**
 * Evidence Data Localization
 * Complete descriptions and collection tips for all evidence types
 */

import { SupportedLanguage } from './types';

// Evidence descriptions
export const evidenceDescriptions: Record<string, Record<SupportedLanguage, string>> = {
  'EMF Level 5': {
    en: 'Electromagnetic field spike - indicates ghost presence and paranormal activity',
    de: 'Elektromagnetische Feldspitze - deutet auf Geistpräsenz hin',
    nl: 'Elektromagnetische veldpieken - duidt op geestpresence',
    fr: 'Pic de champ électromagnétique - indique la présence de fantômes',
    es: 'Pico de campo electromagnético - indica presencia de fantasmas',
    it: 'Picco di campo elettromagnetico - indica la presenza di fantasmi',
    pt: 'Pico de campo eletromagnético - indica presença de fantasmas',
    sv: 'Elektromagnetisk fältökning - indikerar spökesnärvaro',
  },
  'Spirit Box': {
    en: 'Ghost communication through white noise - direct spirit voice evidence',
    de: 'Geistkommunikation durch weißes Rauschen - direkte Geistbeweise',
    nl: 'Geestkommunicatie via witruisgeluiden - direct geestbewijs',
    fr: 'Communication fantôme via bruit blanc - preuve vocale directe',
    es: 'Comunicación de fantasmas a través de ruido blanco - prueba de voz',
    it: 'Comunicazione fantasma tramite rumore bianco - prova vocale diretta',
    pt: 'Comunicação fantasmagórica por ruído branco - prova de voz direta',
    sv: 'Spökkommunikation via vitt ljud - direkt röstbevis',
  },
  'Ghost Writing': {
    en: 'Written messages from the ghost - paranormal text evidence',
    de: 'Geschriebene Nachrichten vom Geist - paranormale Textbeweise',
    nl: 'Geschreven boodschappen van de geest - paranormale tekstbewijzen',
    fr: 'Messages écrits du fantôme - preuve textuelle paranormale',
    es: 'Mensajes escritos del fantasma - prueba textual paranormal',
    it: 'Messaggi scritti del fantasma - prova testuale paranormale',
    pt: 'Mensagens escritas do fantasma - prova textual paranormal',
    sv: 'Skrivna meddelanden från spöket - paranormalt textbevis',
  },
  'Ghost Orb': {
    en: 'Glowing paranormal orbs visible on camera or physical manifestations',
    de: 'Leuchtende paranormale Orbs sichtbar auf der Kamera',
    nl: 'Gloeinde paranormale orbs zichtbaar op camera',
    fr: 'Orbes paranormales brillantes visibles sur caméra',
    es: 'Orbes paranormales brillantes visibles en cámara',
    it: 'Orbe paranormali luminose visibili sulla telecamera',
    pt: 'Orbes paranormais brilhantes visíveis na câmera',
    sv: 'Glödande paranormala orber synliga på kamera',
  },
  'Freezing Temperatures': {
    en: 'Unexplained cold spots and temperature drops - supernatural thermal anomaly',
    de: 'Unerklärte kalte Stellen - übernatürliche thermische Anomalie',
    nl: 'Onverklaarde koude plekken - bovennatuurlijke thermische anomalie',
    fr: 'Points froids inexpliqués - anomalie thermique surnaturelle',
    es: 'Puntos fríos inexplicables - anomalía térmica sobrenatural',
    it: 'Punti freddi inspiegabili - anomalia termica sovrannaturale',
    pt: 'Pontos frios inexplicáveis - anomalia térmica sobrenatural',
    sv: 'Oförklarade kalla punkter - övernaturlig värmeanomali',
  },
  'D.O.T.S. Projector': {
    en: 'Laser grid silhouettes showing ghost movement - visual manifestation',
    de: 'Lasergitter-Silhouetten zeigen Geistbewegung',
    nl: 'Lasergrid-silhouetten tonen geestbeweging',
    fr: 'Les silhouettes de grille laser montrent le mouvement du fantôme',
    es: 'Las siluetas de cuadrícula láser muestran el movimiento del fantasma',
    it: 'Le siluette della griglia laser mostrano il movimento del fantasma',
    pt: 'As silhuetas de grade de laser mostram o movimento do fantasma',
    sv: 'Lasergridsilhuetter visar spökerörelse',
  },
  'Ultraviolet': {
    en: 'Invisible fingerprints revealed under UV light - ghost contact evidence',
    de: 'Unsichtbare Fingerabdrücke unter UV-Licht - Geistkontaktbeweis',
    nl: 'Onzichtbare vingerafdrukken onder UV-licht - geestcontactbewijs',
    fr: 'Empreintes digitales invisibles sous la lumière UV - preuve de contact fantôme',
    es: 'Huellas dactilares invisibles bajo luz UV - prueba de contacto fantasma',
    it: 'Impronte digitali invisibili sotto la luce UV - prova di contatto fantasma',
    pt: 'Impressões digitais invisíveis sob luz UV - prova de contato fantasma',
    sv: 'Osynliga fingeravtryck under UV-ljus - spökekontaktbevis',
  },
};

// Evidence collection tips
export const evidenceTips: Record<string, Record<SupportedLanguage, string[]>> = {
  'EMF Level 5': {
    en: [
      'Use EMF Reader to detect electromagnetic spikes',
      'Check near equipment and ghost activity zones',
      'EMF Level 5 is strong and reliable evidence',
      'May appear near beds or electronic devices',
    ],
    de: [
      'Verwenden Sie EMF-Lesegerät um elektromagnetische Spitzen zu erkennen',
      'Überprüfen Sie in der Nähe von Ausrüstung und Geistaktivitätszonen',
      'EMF Level 5 ist starker und zuverlässiger Beweis',
      'Kann in der Nähe von Betten oder elektronischen Geräten erscheinen',
    ],
    nl: [
      'Gebruik EMF-meter om elektromagnetische pieken op te sporen',
      'Controleer in de buurt van apparatuur en geestactiviteitszones',
      'EMF Level 5 is sterk en betrouwbaar bewijs',
      'Kan in de buurt van bedden of elektronische apparaten verschijnen',
    ],
    fr: [
      'Utilisez le lecteur EMF pour détecter les pics électromagnétiques',
      'Vérifiez près de l\'équipement et des zones d\'activité de fantômes',
      'EMF Level 5 est une preuve forte et fiable',
      'Peut apparaître près des lits ou des appareils électroniques',
    ],
    es: [
      'Usa el lector EMF para detectar picos electromagnéticos',
      'Verifica cerca del equipo y las zonas de actividad de fantasmas',
      'EMF Level 5 es prueba fuerte y confiable',
      'Puede aparecer cerca de camas o dispositivos electrónicos',
    ],
    it: [
      'Utilizzare il lettore EMF per rilevare i picchi elettromagnetici',
      'Controllare vicino alle apparecchiature e alle zone di attività fantasma',
      'EMF Level 5 è una prova forte e affidabile',
      'Può apparire vicino ai letti o ai dispositivi elettronici',
    ],
    pt: [
      'Use o leitor EMF para detectar picos eletromagnéticos',
      'Verifique perto do equipamento e zonas de atividade fantasmagórica',
      'EMF Level 5 é prova forte e confiável',
      'Pode aparecer perto de camas ou dispositivos eletrônicos',
    ],
    sv: [
      'Använd EMF-läsaren för att detektera elektromagnetiska toppar',
      'Kontrollera nära utrustning och spökaktivitetszon',
      'EMF Level 5 är starkt och tillförlitligt bevis',
      'Kan visas nära sängar eller elektroniska enheter',
    ],
  },
};

// Common mistakes
export const evidenceCommonMistakes: Record<string, Record<SupportedLanguage, string[]>> = {
  'EMF Level 5': {
    en: [
      'Confusing EMF Level 5 with lower readings',
      'Not checking all rooms thoroughly',
      'Forgetting to reset EMF Reader between checks',
      'Assuming any spike is EMF Level 5 evidence',
    ],
    de: [
      'EMF Level 5 mit niedrigeren Messwerten verwechseln',
      'Nicht alle Räume gründlich überprüfen',
      'Vergessen, EMF-Lesegerät zwischen Checks zurückzusetzen',
      'Annehmen, dass jeder Spike ein Beweis ist',
    ],
    nl: [
      'EMF Level 5 verwarren met lagere metingen',
      'Niet alle kamers grondig controleren',
      'Vergeten EMF-meter tussen controles opnieuw in te stellen',
      'Aannemen dat elke piek EMF Level 5 bewijs is',
    ],
    fr: [
      'Confondre EMF Level 5 avec des lectures inférieures',
      'Ne pas vérifier toutes les pièces à fond',
      'Oublier de réinitialiser le lecteur EMF entre les vérifications',
      'Supposer que tout pic est une preuve EMF Level 5',
    ],
    es: [
      'Confundir EMF Level 5 con lecturas más bajas',
      'No verificar todas las habitaciones a fondo',
      'Olvidar reiniciar el lector EMF entre comprobaciones',
      'Suponer que cualquier pico es prueba de EMF Level 5',
    ],
    it: [
      'Confondere EMF Level 5 con letture inferiori',
      'Non controllare tutte le stanze a fondo',
      'Dimenticare di ripristinare il lettore EMF tra i controlli',
      'Supporre che ogni picco sia una prova EMF Level 5',
    ],
    pt: [
      'Confundir EMF Level 5 com leituras inferiores',
      'Não verificar todas as salas completamente',
      'Esquecer de redefinir o leitor EMF entre as verificações',
      'Supor que qualquer pico é prova de EMF Level 5',
    ],
    sv: [
      'Förvixa EMF Level 5 med lägre avläsningar',
      'Inte kontrollera alla rum noggrant',
      'Glömma att återställa EMF-läsaren mellan checkuppgifter',
      'Anta att varje topp är EMF Level 5 bevis',
    ],
  },
};

/**
 * Helper functions
 */
export const getEvidenceDescription = (evidenceId: string, language: SupportedLanguage): string => {
  return evidenceDescriptions[evidenceId]?.[language] ?? evidenceDescriptions[evidenceId]?.en ?? '';
};

export const getEvidenceTip = (evidenceId: string, index: number, language: SupportedLanguage): string => {
  const tips = evidenceTips[evidenceId]?.[language] ?? evidenceTips[evidenceId]?.en ?? [];
  return tips[index] ?? '';
};

export const getEvidenceCommonMistake = (evidenceId: string, index: number, language: SupportedLanguage): string => {
  const mistakes = evidenceCommonMistakes[evidenceId]?.[language] ?? evidenceCommonMistakes[evidenceId]?.en ?? [];
  return mistakes[index] ?? '';
};
