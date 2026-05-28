import mongoose from "mongoose";
import dotenv from "dotenv";
import PauseSuggestion from "../models/PauseSuggestion.js";

dotenv.config();

const pauseSuggestions = [
  {
    id: 1,
    slug: "houding-check",
    type: "short",
    title: "Houding check",
    description: "Verbeter je lichaamshouding en voorkom spanning",
    duration: "2 min",
    icon: "posture",
    instructionTitle: "Houding check instructies",
    instructions: [
      "Ga rechtop zitten met je voeten plat op de grond",
      "Rol je schouders naar achteren",
      "Trek je kin licht naar binnen",
      "Ontspan je kaak en gezicht",
      "Neem 3 diepe ademhalingen in deze houding",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Een slechte houding beïnvloedt stress en focus direct. Een korte houding check helpt om spanning in je nek, schouders en rug te verminderen en zorgt voor meer rust en concentratie.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je hebt een pauze genomen. Even vertragen helpt je om met meer focus verder te gaan.",
  },
  {
    id: 2,
    slug: "name-one-win",
    type: "short",
    title: "Name one win",
    description: "Herken 1 positief moment van vandaag",
    duration: "1 min",
    icon: "win",
    instructionTitle: "Name one win instructies",
    instructions: [
      "Denk terug aan je dag tot nu toe",
      "Noem één ding dat goed ging, hoe klein ook",
      "Voel de positieve emotie van dit moment",
      "Neem een moment om jezelf te feliciteren",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Deze oefening helpt je om bewust stil te staan bij kleine overwinningen. Zo verschuif je je aandacht naar wat goed loopt en bouw je aan een positievere mindset.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je hebt een positief moment erkend. Neem dat gevoel mee in de rest van je dag.",
  },
  {
    id: 3,
    slug: "hand-stretch",
    type: "short",
    title: "Hand stretch",
    description: "Ontspan je handen en polsen",
    duration: "2 min",
    icon: "hand",
    instructionTitle: "Hand stretch instructies",
    instructions: [
      "Strek je armen naar voren",
      "Spreid je vingers wijd uit",
      "Maak vuisten en open ze weer 5 keer",
      "Draai je polsen 5 keer rechtsom en 5 keer linksom",
      "Schud je handen losjes uit",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Je handen en polsen staan vaak onder spanning door typen en muisgebruik. Deze korte reset helpt om spanning los te laten en je handen weer soepeler te laten aanvoelen.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je handen hebben even kunnen ontspannen. Kleine pauzes maken een groot verschil.",
  },
  {
    id: 4,
    slug: "hand-to-chest-reset",
    type: "short",
    title: "Hand to chest reset",
    description: "Kalmeer je zenuwstelsel met een simpele aanraking",
    duration: "2 min",
    icon: "touch",
    instructionTitle: "Hand to chest reset instructies",
    instructions: [
      "Leg je hand op je borst",
      "Voel je hartslag",
      "Adem rustig in en uit",
      "Focus op de warmte van je hand",
      "Blijf zo voor 1 tot 2 minuten",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Deze oefening helpt je om terug contact te maken met je lichaam. De combinatie van aanraking en rustige ademhaling kan een gevoel van veiligheid en kalmte geven.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je hebt jezelf een rustig moment gegeven. Ga met zachtere focus verder.",
  },
  {
    id: 5,
    slug: "drink-pauze",
    type: "short",
    title: "Drink pauze",
    description: "Hydrateer en reset je geest",
    duration: "1 - 2 min",
    icon: "water",
    instructionTitle: "Drink pauze instructies",
    instructions: [
      "Sta op en loop naar de keuken",
      "Pak een glas water of thee",
      "Ga ergens anders zitten dan je werkplek",
      "Drink langzaam en bewust",
      "Let op de smaak en temperatuur",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Een drinkpauze helpt je om even weg te stappen van je scherm en jezelf te hydrateren. Dit geeft je lichaam én je hoofd een korte reset.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je hebt jezelf gehydrateerd en even afstand genomen van je werkplek.",
  },
  {
    id: 6,
    slug: "oog-reset",
    type: "short",
    title: "Oog reset",
    description: "Geef je ogen rust van het scherm",
    duration: "1 min",
    icon: "eye",
    instructionTitle: "Oog reset instructies",
    instructions: [
      "Kijk weg van je scherm",
      "Focus op iets op ongeveer 6 meter afstand",
      "Kijk hier 20 seconden naar",
      "Knipper 10 keer langzaam met je ogen",
      "Sluit je ogen voor 10 seconden",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Deze oefening ontlast je oogspieren en vermindert visuele inspanning. Door bewust te knipperen en even weg te kijken, krijgen je ogen opnieuw rust.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je ogen hebben even kunnen rusten. Dat helpt om frisser verder te werken.",
  },

  {
    id: 7,
    slug: "ademhaling",
    type: "long",
    title: "Ademhaling",
    description: "Kalmeer je geest met een gestructureerd adempatroon",
    duration: "5 - 10 min",
    icon: "breath",
    isCategory: true,
  },

  {
    id: 701,
    slug: "box-breathing",
    type: "long",
    category: "breathing",
    title: "Box breathing",
    description: "Adem in een vast ritme om rust en focus te herstellen",
    duration: "2 min",
    icon: "breath",
    rhythm: "4-4-4-4",
    instructionTitle: "Box breathing instructies",
    instructions: [
      "Adem 4 seconden in",
      "Houd je adem 4 seconden vast",
      "Adem 4 seconden uit",
      "Houd opnieuw 4 seconden vast",
      "Herhaal dit ritme",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Box breathing stabiliseert je ademhaling en helpt je lichaam tot rust te komen. Deze oefening is vooral nuttig bij acute stress of wanneer je opnieuw focus nodig hebt.",
    completeTitle: "Box breathing voltooid",
    completeText:
      "Goed gedaan! Je ademhaling is vertraagd en je focus kan weer herstellen.",
    breathingPattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    methodOptions: [
      {
        label: "4-4-4-4",
        inhale: 4,
        holdAfterInhale: 4,
        exhale: 4,
        holdAfterExhale: 4,
      },
      {
        label: "5-5-5-5",
        inhale: 5,
        holdAfterInhale: 5,
        exhale: 5,
        holdAfterExhale: 5,
      },
      {
        label: "6-6-6-6",
        inhale: 6,
        holdAfterInhale: 6,
        exhale: 6,
        holdAfterExhale: 6,
      },
    ],
  },
  {
    id: 702,
    slug: "coherent-breathing",
    type: "long",
    category: "breathing",
    title: "Coherent breathing",
    description: "Vertraag je ademhaling voor meer kalmte en balans",
    duration: "3 min",
    icon: "breath",
    rhythm: "5s in - 5s uit",
    instructionTitle: "Coherent breathing instructies",
    instructions: [
      "Adem 5 seconden in",
      "Adem 5 seconden uit",
      "Houd een rustig tempo aan",
      "Adem via je buik",
      "Herhaal het ritme",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Coherent breathing helpt je ademhaling vertragen en brengt meer balans in je lichaam. Het is geschikt wanneer je je onrustig voelt of opnieuw kalmte wilt vinden.",
    completeTitle: "Coherent breathing voltooid",
    completeText:
      "Goed gedaan! Je hebt je ademhaling vertraagd en meer rust gecreëerd.",
    breathingPattern: {
      inhale: 5,
      holdAfterInhale: 0,
      exhale: 5,
      holdAfterExhale: 0,
    },
    methodOptions: [
      {
        label: "5-0-5-0",
        inhale: 5,
        holdAfterInhale: 0,
        exhale: 5,
        holdAfterExhale: 0,
      },
      {
        label: "6-0-6-0",
        inhale: 6,
        holdAfterInhale: 0,
        exhale: 6,
        holdAfterExhale: 0,
      },
    ],
  },
  {
    id: 703,
    slug: "physiological-sigh",
    type: "long",
    category: "breathing",
    title: "Physiological sigh",
    description: "Laat spanning los met een diepe dubbele ademhaling",
    duration: "1 min",
    icon: "breath",
    rhythm: "2x in - 1x lang uit",
    instructionTitle: "Physiological sigh instructies",
    instructions: [
      "Adem diep in via je neus",
      "Neem nog een korte extra inademing",
      "Adem langzaam uit via je mond",
      "Ontspan je schouders",
      "Herhaal enkele keren",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "De physiological sigh is een snelle reset bij spanning. Door twee keer in te ademen en lang uit te ademen, help je je lichaam ontladen.",
    completeTitle: "Physiological sigh voltooid",
    completeText:
      "Goed gedaan! Je hebt spanning losgelaten en ruimte gemaakt voor rust.",
    breathingPattern: {
      inhale: 2,
      secondInhale: 1,
      holdAfterInhale: 0,
      exhale: 7,
      holdAfterExhale: 0,
    },
  },
  {
    id: 704,
    slug: "ratio-breathing",
    type: "long",
    category: "breathing",
    title: "1:2 ratio breathing",
    description: "Verleng je uitademing om je lichaam tot rust te brengen",
    duration: "2 min",
    icon: "breath",
    rhythm: "4s in - 8s uit",
    instructionTitle: "1:2 ratio breathing instructies",
    instructions: [
      "Adem 4 seconden in",
      "Adem 8 seconden uit",
      "Houd een rustig tempo aan",
      "Focus op je lange uitademing",
      "Herhaal het ritme",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Bij 1:2 ratio breathing is je uitademing dubbel zo lang als je inademing. Dit helpt je lichaam vertragen en kan onrust verminderen.",
    completeTitle: "1:2 ratio breathing voltooid",
    completeText:
      "Goed gedaan! Je hebt je ademhaling vertraagd en je lichaam meer rust gegeven.",
    breathingPattern: {
      inhale: 4,
      holdAfterInhale: 0,
      exhale: 8,
      holdAfterExhale: 0,
    },
    methodOptions: [
      {
        label: "2-0-4-0",
        inhale: 2,
        holdAfterInhale: 0,
        exhale: 4,
        holdAfterExhale: 0,
      },
      {
        label: "3-0-6-0",
        inhale: 3,
        holdAfterInhale: 0,
        exhale: 6,
        holdAfterExhale: 0,
      },
      {
        label: "4-0-8-0",
        inhale: 4,
        holdAfterInhale: 0,
        exhale: 8,
        holdAfterExhale: 0,
      },
    ],
  },

  {
    id: 8,
    slug: "stretchen",
    type: "long",
    title: "Stretchen",
    description: "Beweeg en rek je hele lichaam",
    duration: "10 min",
    icon: "stretch",
    instructionTitle: "Stretchen instructies",
    instructions: [
      "Sta op van je werkplek",
      "Rek je armen boven je hoofd",
      "Buig naar links en rechts, 30 seconden per kant",
      "Draai je bovenlichaam 10 keer rustig",
      "Stretch je nekspieren voorzichtig",
      "Buig rustig voorover richting je tenen",
      "Kom langzaam weer omhoog",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Stretchen helpt om spierspanning te verminderen en je lichaam opnieuw in beweging te brengen. Het kan je flexibiliteit, doorbloeding en energieniveau ondersteunen.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je lichaam heeft beweging gekregen. Dat helpt om spanning los te laten.",
  },
  {
    id: 9,
    slug: "korte-wandeling",
    type: "long",
    title: "Korte wandeling",
    description: "Ga naar buiten voor frisse lucht en beweging",
    duration: "10 min",
    icon: "walk",
    instructionTitle: "Korte wandeling instructies",
    instructions: [
      "Sta op en pak je jas indien nodig",
      "Loop naar buiten of door het gebouw",
      "Loop in een comfortabel tempo",
      "Let op je omgeving: wat zie, hoor of ruik je?",
      "Adem de frisse lucht diep in",
      "Kom rustig terug naar je werkplek",
    ],
    infoTitle: "Wat doet dit?",
    infoText:
      "Een korte wandeling brengt je lichaam in beweging en geeft je hoofd ruimte. Het kan je energie verhogen, je stemming verbeteren en je creativiteit stimuleren.",
    completeTitle: "Goed bezig!",
    completeText:
      "Je hebt bewogen en afstand genomen van je werk. Dat helpt om met nieuwe energie verder te gaan.",
  },
];

try {
  await mongoose.connect(process.env.MONGO_URI);

  await PauseSuggestion.deleteMany();
  await PauseSuggestion.insertMany(pauseSuggestions);

  console.log("Pause suggestions toegevoegd");
  process.exit();
} catch (error) {
  console.error(error);
  process.exit(1);
}