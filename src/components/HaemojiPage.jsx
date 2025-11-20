import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import EmojiSelector from './EmojiSelector.jsx';
import dissonance1 from '../assets/images/dissonance-1.svg';
import dissonance2 from '../assets/images/dissonance-2.svg';
import dissonance3 from '../assets/images/dissonance-3.svg';
import profondeur1 from '../assets/images/profondeur-1.svg';
import profondeur2 from '../assets/images/profondeur-2.svg';
import profondeur3 from '../assets/images/profondeur-3.svg';
import mojonance1 from '../assets/images/mojonance-1.svg';
import mojonance2 from '../assets/images/mojonance-2.svg';
import mojonance3 from '../assets/images/mojonance-3.svg';
import soundD1 from '../assets/sounds/dissonance-1.wav';
import soundD2 from '../assets/sounds/dissonance-2.wav';
import soundD3 from '../assets/sounds/dissonance-3.wav';
import soundP1 from '../assets/sounds/profondeur-1.wav';
import soundP2 from '../assets/sounds/profondeur-2.wav';
import soundP3 from '../assets/sounds/profondeur-3.wav';
import soundM1 from '../assets/sounds/mojonance-1.wav';
import soundM2 from '../assets/sounds/mojonance-2.wav';
import soundM3 from '../assets/sounds/mojonance-3.wav';
import { createPulseAnimation } from '../utils/createPulseAnimation.js';

const createOption = (id, value, label, primary, accent) => ({
  id,
  value,
  label,
  animationData: createPulseAnimation(primary, accent),
});

const thoughtOptions = [
  createOption('thought-anger', '😡', 'Colère qui mord', '#ff5f6d', '#ffc371'),
  createOption('thought-sad', '😢', 'Pleurs ouverts', '#5c7cfa', '#8ec5ff'),
  createOption('thought-blank', '😶', 'Silence figé', '#b9becd', '#e0e4f1'),
  createOption('thought-frustrated', '😤', 'Souffle tendu', '#ff8e72', '#ffd6a5'),
  createOption('thought-anxious', '😰', 'Anxiété diffuse', '#2ec4b6', '#a0f0e4'),
  createOption('thought-tired', '😞', 'Lassitude douce', '#d7aefb', '#f5d0fe'),
  createOption('thought-overload', '😵', 'Vertige mental', '#7b61ff', '#d5b8ff'),
  createOption('thought-awkward', '😬', 'Gêne crispée', '#ffb4a2', '#ffe5d9'),
  createOption('thought-melancholy', '😔', 'Mélancolie lente', '#6f73d2', '#c0c4ff'),
];

const bodyOptions = [
  createOption('body-heart', '💔', 'Cœur serré', '#ff6b6b', '#f8b4b4'),
  createOption('body-nausea', '🤢', 'Ventre chavire', '#7ed957', '#c8f7c5'),
  createOption('body-tension', '😖', 'Tempes grincent', '#ffa69e', '#ffd7d0'),
  createOption('body-shoulders', '😣', 'Épaules tendues', '#ffb347', '#ffe0a3'),
  createOption('body-head', '🤯', 'Tête crépite', '#ff4d6d', '#ffa6c1'),
  createOption('body-neck', '😩', 'Nuque lourde', '#a0a7ff', '#d4d7ff'),
  createOption('body-shake', '🫨', 'Tremblements fins', '#5ec0db', '#bfe7ff'),
  createOption('body-breath', '🫁', 'Poumons serrés', '#1fab89', '#9bf2ea'),
  createOption('body-heat', '🔥', 'Chaleur vive', '#ff924c', '#ffd8a8'),
];

const mojoOptions = [
  createOption('mojo-sprout', '🌱', 'Graine respire', '#8bc34a', '#d0ffb3'),
  createOption('mojo-sparkle', '✨', 'Éclat doux', '#ffd166', '#ffe29a'),
  createOption('mojo-peace', '🕊️', 'Paix glisse', '#6fc3df', '#c4f1ff'),
  createOption('mojo-orbit', '💫', 'Orbite calme', '#b388ff', '#e5c6ff'),
  createOption('mojo-rainbow', '🌈', 'Arc-en-ciel', '#ff9a8b', '#fad0c4'),
  createOption('mojo-sun', '🌞', 'Rayon soleil', '#ffb347', '#ffe29a'),
  createOption('mojo-idea', '💡', 'Idée claire', '#a4f6f0', '#f4f9ff'),
  createOption('mojo-unlock', '🔓', 'Porte ouverte', '#ffb4a2', '#ffd6a5'),
  createOption('mojo-hug', '🫶', 'Mains reliées', '#ff8fab', '#ffd9e2'),
];

const buildOptionMap = (options) =>
  options.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {});

const THOUGHT_OPTION_MAP = buildOptionMap(thoughtOptions);
const BODY_OPTION_MAP = buildOptionMap(bodyOptions);
const MOJO_OPTION_MAP = buildOptionMap(mojoOptions);

const lineThought = {
  '😡': 'La colère grince,',
  '😢': 'Les larmes scintillent,',
  '😶': 'Le silence tourne,',
  '😤': 'Le souffle cogne,',
  '😰': 'L’angoisse s’insinue,',
  '😞': 'La lassitude tombe,',
  '😵': 'Ça tourne en rond,',
  '😬': 'Le mental accroche,',
  '😔': 'Un nuage s’attarde,',
};
const lineBody = {
  '💔': 'Le cœur tire un peu,',
  '🤢': 'Le ventre chavire,',
  '😖': 'Les tempes grincent,',
  '😣': 'Les épaules se crispen,',
  '🤯': 'La tête crépite,',
  '😩': 'La nuque soupire,',
  '🫨': 'Tout tremble doucement,',
  '🫁': 'Les poumons serrent,',
  '🔥': 'La chaleur monte,',
};
const lineMojo = {
  '🌱': 'Une graine respire.',
  '✨': 'Une étincelle persiste.',
  '🕊️': 'Une paix glisse.',
  '💫': 'Une orbite s’adoucit.',
  '🌈': 'Une éclaircie s’annonce.',
  '🌞': 'Un soleil se pointe.',
  '💡': 'Une idée s’allume.',
  '🔓': 'Une porte s’entrebâille.',
  '🫶': 'Tes mains se rejoignent.',
};

const triptychSources = [
  { id: 'd1', label: 'Nuage indocile', src: dissonance1 },
  { id: 'd2', label: 'Contours fiévreux', src: dissonance2 },
  { id: 'd3', label: 'Éclats de colère', src: dissonance3 },
  { id: 'p1', label: 'Épaisseur du corps', src: profondeur1 },
  { id: 'p2', label: 'Souffle profond', src: profondeur2 },
  { id: 'p3', label: 'Tension diffuse', src: profondeur3 },
  { id: 'm1', label: 'Pousse mojo', src: mojonance1 },
  { id: 'm2', label: 'Lumière douce', src: mojonance2 },
  { id: 'm3', label: 'Élan mojo', src: mojonance3 },
];

const audioClips = [
  { id: 'sd1', label: 'Beat nuage', src: soundD1 },
  { id: 'sd2', label: 'Fracas doux', src: soundD2 },
  { id: 'sd3', label: 'Orage lent', src: soundD3 },
  { id: 'sp1', label: 'Pulse thorax', src: soundP1 },
  { id: 'sp2', label: 'Basses viscères', src: soundP2 },
  { id: 'sp3', label: 'Souffle granulaire', src: soundP3 },
  { id: 'sm1', label: 'Clair mojo', src: soundM1 },
  { id: 'sm2', label: 'Rayon souple', src: soundM2 },
  { id: 'sm3', label: 'Métronome chill', src: soundM3 },
];

const STEP_LABELS = {
  0: 'Accueil',
  1: '1) Ton bad mood',
  2: '2) Ton corps',
  3: '3) Mini-solution',
  4: '4) Prêt à générer',
  5: 'Résultat',
};

function pickRandomItems(collection, count) {
  const pool = [...collection];
  const picks = [];
  while (pool.length && picks.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(idx, 1)[0]);
  }
  return picks;
}

function buildHaiku(thought, body, mojo) {
  return [
    lineThought[thought] ?? 'Tes pensées murmurent,',
    lineBody[body] ?? 'Ton corps clignote,',
    lineMojo[mojo] ?? 'Une éclaircie respire.',
  ];
}

const OptionVisual = ({ option, size = 'md' }) => {
  if (!option) {
    return <span className="summary-placeholder">—</span>;
  }

  const sizeClass = size === 'lg' ? 'option-visual-lg' : 'option-visual-md';

  return (
    <div className={`option-visual ${sizeClass}`} aria-label={option.label}>
      <Lottie className="summary-lottie" animationData={option.animationData} loop autoplay />
      <span>{option.label}</span>
    </div>
  );
};

function HaemojiPage() {
  const [step, setStep] = useState(0);
  const [thoughtEmoji, setThoughtEmoji] = useState('');
  const [bodyEmoji, setBodyEmoji] = useState('');
  const [mojoEmoji, setMojoEmoji] = useState('');
  const [haikuLines, setHaikuLines] = useState(['', '', '']);
  const [triptych, setTriptych] = useState([]);
  const [vibeMix, setVibeMix] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioRefs = useRef([]);
  const vibeTimeoutRef = useRef(null);

  useEffect(() => () => stopVibe(), []);

  const readyForGate = Boolean(thoughtEmoji && bodyEmoji && mojoEmoji);
  const selectedThoughtOption = THOUGHT_OPTION_MAP[thoughtEmoji];
  const selectedBodyOption = BODY_OPTION_MAP[bodyEmoji];
  const selectedMojoOption = MOJO_OPTION_MAP[mojoEmoji];

  const stopVibe = () => {
    audioRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRefs.current = [];
    if (vibeTimeoutRef.current) {
      clearTimeout(vibeTimeoutRef.current);
      vibeTimeoutRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  const startVibe = () => {
    if (!vibeMix.length) return;
    stopVibe();
    audioRefs.current = vibeMix.map((clip) => {
      const audio = new Audio(clip.src);
      audio.loop = true;
      audio.volume = 0.35;
      audio.play();
      return audio;
    });
    setIsAudioPlaying(true);
    vibeTimeoutRef.current = setTimeout(() => {
      stopVibe();
    }, 20000);
  };

  const handleToggleVibe = () => {
    if (!vibeMix.length) return;
    if (isAudioPlaying) {
      stopVibe();
    } else {
      startVibe();
    }
  };

  const goToStep = (nextStep) => {
    setStep(nextStep);
  };

  const handleGenerate = () => {
    if (!readyForGate) return;
    stopVibe();
    setHaikuLines(buildHaiku(thoughtEmoji, bodyEmoji, mojoEmoji));
    setTriptych(pickRandomItems(triptychSources, 3));
    setVibeMix(pickRandomItems(audioClips, 3));
    setStep(5);
  };

  const resetFlow = () => {
    stopVibe();
    setThoughtEmoji('');
    setBodyEmoji('');
    setMojoEmoji('');
    setHaikuLines(['', '', '']);
    setTriptych([]);
    setVibeMix([]);
    setStep(1);
  };

  const renderIntro = () => (
    <section className="haemoji-step intro" key="intro">
      <p className="intro-title">HAÏMOJI•°</p>
      <h1>Si t’es kéblo, retrouve ton mojo</h1>
      <p className="step-body">
        Choisis juste trois émojis. Pas besoin d’écrire ni de tout raconter. Tu regardes ton nuage, ton corps, puis la
        sensation positive qui pointe. Ready?
      </p>
      <button className="primary-btn" type="button" onClick={() => goToStep(1)}>
        Commencer
      </button>
    </section>
  );

  const renderThoughtStep = () => (
    <section className="haemoji-step" key="thought">
      <h2>1) Ton bad mood</h2>
      <p className="step-body">
        « C’est quoi qui te saoule ? Pense à ton bad mood du moment. » Choisis l’emoji qui va avec tes pensées.
      </p>
      <EmojiSelector
        label="Ton bad mood"
        description="Tapote l’emoji qui colle à ce qui tourne dans ta tête."
        options={thoughtOptions}
        selectedValue={thoughtEmoji}
        onSelect={setThoughtEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(0)}>
          Retour
        </button>
        <button className="primary-btn" type="button" disabled={!thoughtEmoji} onClick={() => goToStep(2)}>
          Étape suivante
        </button>
      </div>
    </section>
  );

  const renderBodyStep = () => (
    <section className="haemoji-step" key="body">
      <h2>2) Ce que ça te fait dans le corps</h2>
      <p className="step-body">
        « Où ça bloque en toi ? Sensation ? Tension ? Choisis l’emoji qui match. ».
      </p>
      <EmojiSelector
        label="Ton corps"
        description="Montre comment ça se sent physiquement."
        options={bodyOptions}
        selectedValue={bodyEmoji}
        onSelect={setBodyEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(1)}>
          Retour
        </button>
        <button className="primary-btn" type="button" disabled={!bodyEmoji} onClick={() => goToStep(3)}>
          Étape suivante
        </button>
      </div>
    </section>
  );

  const renderMojoStep = () => (
    <section className="haemoji-step" key="mojo">
      <h2>3) Ta mini-solution qui fait du bien</h2>
      <p className="step-body">
        « Imagine le moment où ça va un peu mieux. Pas parfait, juste mieux. Quel emoji résonne avec ça ? »
      </p>
      <EmojiSelector
        label="Ton futur mojo"
        description="Choisis ce qui incarne le petit mieux qui démarre."
        options={mojoOptions}
        selectedValue={mojoEmoji}
        onSelect={setMojoEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(2)}>
          Retour
        </button>
        <button className="primary-btn" type="button" disabled={!mojoEmoji} onClick={() => goToStep(4)}>
          Étape suivante
        </button>
      </div>
    </section>
  );

  const renderGateStep = () => (
    <section className="haemoji-step" key="gate">
      <h2>4) Ton Haïmoji•°</h2>
      <p className="step-body">
        Pas encore calculé. Tu as ton trio prêt ? Clique ci-dessous pour générer l’affichage complet.
      </p>
      <div className="summary-grid gate">
        <div className="summary-item">
          <span className="summary-label">Bad mood</span>
          <OptionVisual option={selectedThoughtOption} />
        </div>
        <div className="summary-item">
          <span className="summary-label">Corps</span>
          <OptionVisual option={selectedBodyOption} />
        </div>
        <div className="summary-item">
          <span className="summary-label">Mini-solution</span>
          <OptionVisual option={selectedMojoOption} />
        </div>
      </div>
      <button className="primary-btn large" type="button" disabled={!readyForGate} onClick={handleGenerate}>
        Générer mon Haïmoji
      </button>
    </section>
  );

  const renderResultStep = () => (
    <section className="haemoji-step result" key="result">
      <h2>Ton Haïmoji•°</h2>
      <div className="result-trio">
        <div>
          <span className="result-label">Bad mood</span>
          <OptionVisual option={selectedThoughtOption} size="lg" />
        </div>
        <div>
          <span className="result-label">Corps</span>
          <OptionVisual option={selectedBodyOption} size="lg" />
        </div>
        <div>
          <span className="result-label">Mini-solution</span>
          <OptionVisual option={selectedMojoOption} size="lg" />
        </div>
      </div>

      <div className="haiku-block">
        <h3>Ton mini-haïku</h3>
        <p>{haikuLines[0]}</p>
        <p>{haikuLines[1]}</p>
        <p>{haikuLines[2]}</p>
      </div>

      <div className="triptych-block">
        <h3>Ton triptyque visuel</h3>
        <div className="triptych-grid">
          {triptych.map((panel) => (
            <div className="triptych-cell" key={panel.id}>
              <img src={panel.src} alt={panel.label} />
              <span>{panel.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="audio-block">
        <div className="audio-top">
          <div>
            <h3>Ta mini-vibe audio (20 sec)</h3>
            <p className="step-body small">
              Trois samples légers mixés. Clique, écoute vingt secondes, respire.
            </p>
          </div>
          <button className="ghost-btn audio-btn" type="button" onClick={handleToggleVibe} disabled={!vibeMix.length}>
            {isAudioPlaying ? '⏸️ Pause' : '▶️ Écouter'}
          </button>
        </div>
        <div className="clip-tags">
          {vibeMix.map((clip) => (
            <span key={clip.id}>{clip.label}</span>
          ))}
        </div>
      </div>

      <div className="premium-block">
        <h3>Option Premium · MojoMaster</h3>
        <ul>
          <li>Vidéo 3 min</li>
          <li>Sons stylés</li>
          <li>Cosmoji vivant</li>
        </ul>
        <button className="premium-btn" type="button">
          Devenir MojoMaster
        </button>
      </div>

      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={resetFlow}>
          Refaire un Haïmoji
        </button>
      </div>
    </section>
  );

  const renderStep = () => {
    if (step === 0) return renderIntro();
    if (step === 1) return renderThoughtStep();
    if (step === 2) return renderBodyStep();
    if (step === 3) return renderMojoStep();
    if (step === 4) return renderGateStep();
    return renderResultStep();
  };

  return (
    <div className="haemoji-shell">
      <div className="haemoji-stack">
        <header className="haemoji-hero">
          <span className="hero-tag">Haïmoji</span>
          <h1>
            Si t’es kéblo,
            <br />
            retrouve ton mojo
          </h1>
          <p>On regarde le souci, le corps, puis le petit mieux qui débarque.</p>
        </header>
        <div className="haemoji-card">
          <div className="haemoji-card-header">
            <p className="step-indicator">{STEP_LABELS[step]}</p>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default HaemojiPage;
