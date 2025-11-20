import { useEffect, useRef, useState } from 'react';
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

const thoughtOptions = ['😡', '😢', '😶', '😤', '😰', '😞', '😵', '😬', '😔'];
const bodyOptions = ['💔', '🤢', '😖', '😣', '🤯', '😩', '🫨', '🫁', '🔥'];
const mojoOptions = ['🌱', '✨', '🕊️', '💫', '🌈', '🌞', '💡', '🔓', '🫶'];

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
        emojis={thoughtOptions}
        selectedEmoji={thoughtEmoji}
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
        emojis={bodyOptions}
        selectedEmoji={bodyEmoji}
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
        emojis={mojoOptions}
        selectedEmoji={mojoEmoji}
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
          <span className="summary-emoji">{thoughtEmoji || '—'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Corps</span>
          <span className="summary-emoji">{bodyEmoji || '—'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Mini-solution</span>
          <span className="summary-emoji">{mojoEmoji || '—'}</span>
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
          <span className="result-emoji">{thoughtEmoji}</span>
        </div>
        <div>
          <span className="result-label">Corps</span>
          <span className="result-emoji">{bodyEmoji}</span>
        </div>
        <div>
          <span className="result-label">Mini-solution</span>
          <span className="result-emoji">{mojoEmoji}</span>
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
